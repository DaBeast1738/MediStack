'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { addDoc, collection } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function CreatePostPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !description) {
      setError('Title and description are required.')
      return
    }

    setIsLoading(true)

    try {
      const user = auth.currentUser
      if (!user) {
        setError('You must be logged in to create a post.')
        return
      }

      await addDoc(collection(db, 'posts'), {
        title,
        description,
        author: user.email,
        createdAt: new Date(),
        votes: 0,
        responses: []
      })

      router.push('/')
    } catch (error) {
      setError('Failed to create post. Try again.')
      console.error('Error creating post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Create a New Post</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Textarea
          placeholder="Describe your medical concern..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Create Post'}
        </Button>
      </form>
    </div>
  )
}
