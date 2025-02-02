'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { db, auth } from '@/lib/firebase'
import { doc, getDoc, collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns' // ✅ Formats timestamps

export default function PostDetailPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)

  // ✅ Place this `useEffect` inside the `PostDetailPage` component
  useEffect(() => {
    async function fetchPost() {
      try {
        const postRef = doc(db, 'posts', id)
        const postSnap = await getDoc(postRef)
        if (postSnap.exists()) {
          setPost({ id: postSnap.id, ...postSnap.data() })
        } else {
          console.error('Post not found')
        }

        // ✅ Fetch comments with timestamps
        const commentsRef = query(collection(db, 'posts', id, 'comments'), orderBy('createdAt', 'asc'))
        const commentsSnap = await getDocs(commentsRef)
        setComments(commentsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date()
        })))
      } catch (error) {
        console.error('Error fetching post or comments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id]) // ✅ Dependency array: runs when `id` changes

  async function addComment() {
    if (!newComment.trim()) return

    try {
      const user = auth.currentUser
      if (!user) {
        alert("You must be logged in to comment.")
        return
      }

      const docRef = await addDoc(collection(db, 'posts', id, 'comments'), {
        text: newComment.trim(),
        authorId: user.uid,
        authorName: user.displayName || user.email,
        createdAt: new Date(),
      })

      setComments([
        ...comments,
        {
          id: docRef.id,
          text: newComment,
          authorName: user.displayName || user.email,
          createdAt: new Date()
        }
      ])
      setNewComment('')
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  if (loading) return <p>Loading...</p>
  if (!post) return <p>Post not found.</p>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-gray-700 mt-4">{post.description}</p>

      {/* Comments Section */}
      <div className="mt-6 bg-white shadow-md rounded-lg p-6 border">
        <h2 className="text-xl font-semibold mb-2">Discussion</h2>

        {/* Comment Input */}
        <Textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mb-2 border-gray-300"
        />
        <Button onClick={addComment} disabled={!newComment.trim()} className="mt-2">Add Comment</Button>

        {/* Comment List */}
        <div className="mt-6 space-y-3">
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="p-4 border border-gray-200 rounded-md shadow-sm bg-gray-50">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-blue-600">{comment.authorName || "Anonymous"}</p>
                  <p className="text-sm text-gray-500">
                    {format(comment.createdAt, "MMMM dd, yyyy • hh:mm a")}
                  </p>
                </div>
                <p className="mt-2 text-gray-700">{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
