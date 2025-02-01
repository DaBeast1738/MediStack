// src/app/page.tsx
import NavBar from '@/components/NavBar'
import PostList from '@/components/PostList'
import { Suspense } from 'react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading posts...</div>}>
          <PostList />
        </Suspense>
      </main>
    </div>
  )
}