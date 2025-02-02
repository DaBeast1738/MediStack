'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ThumbsUp, MessageCircle } from 'lucide-react'
import Link from 'next/link'

interface Response {
  id: number
  doctor: string
  response: string
  votes: number
  isVerified: boolean
}

interface Post {
  id: number
  title: string
  description: string
  votes: number
  responses: Response[]
}

interface PostListProps {
  posts?: Post[]
}

export default function PostList({ posts = [] }: PostListProps) {
  const [postVotes, setPostVotes] = useState<{ [key: number]: number }>(
    Object.fromEntries(posts.map(post => [post.id, post.votes]))
  )

  const handleUpvote = (postId: number) => {
    setPostVotes(prev => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1
    }))
  }

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <p className="text-gray-500 text-center">No posts available.</p>
      ) : (
        posts.map(post => (
          <Card key={post.id} className="w-full">
            <CardHeader>
              <CardTitle className="text-xl hover:text-blue-600 transition">
                <Link href={`/posts/${post.id}`}>{post.title}</Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{post.description}</p>
              <div className="flex items-center space-x-4 mb-6">
                {/* Upvote Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpvote(post.id)}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  {postVotes[post.id]}
                </Button>

                {/* Response Count */}
                <span className="text-sm text-gray-500">
                  <MessageCircle className="w-4 h-4 inline mr-1" />
                  {post.responses.length} responses
                </span>
              </div>

              {/* View Discussion Button */}
              <Link href={`/posts/${post.id}`}>
                <Button variant="default" size="sm">View Discussion</Button>
              </Link>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
