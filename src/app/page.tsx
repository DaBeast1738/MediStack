'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs } from 'firebase/firestore'
import PostList from '@/components/PostList'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    async function fetchPosts() {
      try {
        const querySnapshot = await getDocs(collection(db, 'posts'))
        const fetchedPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setPosts(fetchedPosts)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to MediStack</h1>

        {/* Create Post Button - Only for Logged-in Users */}
        {user ? (
          <div className="mb-6 flex space-x-4">
            <Link href="/create-post">
              <Button variant="default" size="lg">Create a Post</Button>
            </Link>
            <Link href="/ai-diagnosis">
              <Button variant="outline" size="lg">Get AI Diagnosis</Button>
            </Link>
          </div>
        ) : (
          <p className="text-gray-600 mb-4">
            <Link href="/login" className="text-blue-600 hover:underline">
              Log in
            </Link> to create posts and participate in discussions.
          </p>
        )}

        {/* List of Posts */}
        {loading ? <p>Loading posts...</p> : <PostList posts={posts} />}
      </main>
    </div>
  )
}
