'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { db, auth } from '@/lib/firebase'
import { doc, getDoc, collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'

export default function PostDetailPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)

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

        // Fetch comments
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
  }, [id])

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

  if (loading) return <p className="text-center text-lg">Loading...</p>
  if (!post) return <p className="text-center text-lg text-red-500">Post not found.</p>

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Post Header */}
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800">{post.title}</h1>
        <p className="text-gray-500 mt-2 text-sm">By {post.authorName}</p>
        <p className="text-gray-700 mt-4">{post.description}</p>
      </div>

      {/* Comment Section */}
      <div className="mt-8 bg-gray-50 shadow-lg rounded-lg p-6 border">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Discussion</h2>

        {/* Comment Input */}
        <Textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mb-4 border border-gray-300 rounded-lg p-3 text-gray-700"
        />
        <Button onClick={addComment} disabled={!newComment.trim()} className="mt-2 w-full">Add Comment</Button>

        {/* Comment List */}
        <div className="mt-6 space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white flex flex-col">
                <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
                    {comment.authorName ? comment.authorName.charAt(0).toUpperCase() : "?"}
                </div>
                  <div>
                    <p className="font-semibold text-blue-600">{comment.authorName || "Anonymous"}</p>
                    <p className="text-sm text-gray-500">
                      {format(comment.createdAt, "MMMM dd, yyyy • hh:mm a")}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-gray-800">{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
