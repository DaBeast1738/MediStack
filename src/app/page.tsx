'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
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

  function handleLogout() {
    signOut(auth)
      .then(() => router.push('/login'))
      .catch((error) => console.error("Logout failed:", error))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-white shadow-md py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-700">MediStack</Link>
          <div>
            {user ? (
              <div className="flex space-x-4 items-center">
                <span className="text-gray-600">{user.displayName || user.email}</span>
                <Button variant="outline" onClick={handleLogout}>Logout</Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="default">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-12 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-4">Welcome to MediStack</h1>
          <p className="text-lg text-blue-200">A community-driven platform for medical discussions and AI-powered health insights.</p>
          {user ? (
            <div className="mt-6 flex justify-center space-x-4">
              <Link href="/create-post">
                <Button variant="default" size="lg">Create a Post</Button>
              </Link>
              <Link href="/ai-diagnosis">
              <Button className="bg-green-600 text-white hover:bg-green-700 transition-all duration-300" size="lg">
                 Get AI Diagnosis
                </Button>
              </Link>
            </div>
          ) : (
            <p className="mt-6 text-blue-100">
              <Link href="/login" className="underline">Log in</Link> to participate in discussions.
            </p>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Discussions</h2>
        {loading ? (
          <p className="text-gray-500">Loading posts...</p>
        ) : (
          posts.length > 0 ? (
            <PostList posts={posts} />
          ) : (
            <p className="text-gray-600 text-center">No posts available. Be the first to start a discussion!</p>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6 text-center text-gray-600">
        <p>© {new Date().getFullYear()} MediStack. All rights reserved.</p>
      </footer>
    </div>
  )
}
