'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ThumbsUp, MessageCircle, Trash } from 'lucide-react'
import Link from 'next/link'
import { db, auth } from '@/lib/firebase'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'

interface Post {
  id: string
  title: string
  description: string
  votes: number
  responses: number
  authorName: string
  authorId: string
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser)
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    async function fetchPosts() {
      try {
        const querySnapshot = await getDocs(collection(db, 'posts'))
        const fetchedPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Post[]
        setPosts(fetchedPosts)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  async function handleDelete(postId: string) {
    if (!confirm("Are you sure you want to delete this post?")) return
    try {
      await deleteDoc(doc(db, 'posts', postId))
      setPosts(posts.filter(post => post.id !== postId)) // Update UI
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  return (
    <div className="space-y-4">
      {loading ? <p>Loading posts...</p> : (
        posts.length === 0 ? <p>No posts available.</p> : (
          posts.map(post => (
            <Card key={post.id} className="w-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl hover:text-blue-600 transition">
                      <Link href={`/posts/${post.id}`}>{post.title}</Link>
                    </CardTitle>
                    <p className="text-sm text-gray-500">By {post.authorName}</p>
                  </div>
                  {user?.uid === post.authorId && (
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{post.description}</p>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="w-4 h-4 mr-2" /> {post.votes}
                  </Button>
                  <span className="text-sm text-gray-500">
                    <MessageCircle className="w-4 h-4 inline mr-1" />
                    {post.responses} responses
                  </span>
                </div>
                <Link href={`/posts/${post.id}`}>
                  <Button variant="default" size="sm" className="mt-2">View Discussion</Button>
                </Link>
              </CardContent>
            </Card>
          ))
        )
      )}
    </div>
  )
}
