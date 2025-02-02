'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function PostDetailPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')

  useEffect(() => {
    async function fetchPost() {
      try {
        const docRef = doc(db, 'posts', id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setPost(docSnap.data())
        }
      } catch (error) {
        console.error('Error fetching post:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!comment) return

    try {
      const docRef = doc(db, 'posts', id)
      await updateDoc(docRef, {
        responses: [...post.responses, { text: comment, createdAt: new Date() }]
      })
      setPost((prev) => ({
        ...prev,
        responses: [...prev.responses, { text: comment, createdAt: new Date() }]
      }))
      setComment('')
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-gray-700 mt-4">{post.description}</p>

      <form onSubmit={handleCommentSubmit} className="mt-6">
        <Input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button type="submit">Comment</Button>
      </form>

      <h2 className="text-xl font-bold mt-6">Comments</h2>
      {post.responses.map((response, index) => (
        <p key={index} className="mt-2">{response.text}</p>
      ))}
    </div>
  )
}
