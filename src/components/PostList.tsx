// src/components/PostList.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ThumbsUp, MessageCircle } from 'lucide-react'
import Link from 'next/link'

const posts = [
  {
    id: 1,
    title: "Persistent Headache and Dizziness",
    description: "I've been experiencing severe headaches for the past week...",
    votes: 5,
    responses: [
      {
        id: 1,
        doctor: "Dr. Smith",
        response: "Based on the symptoms, this could be migraine...",
        votes: 12,
        isVerified: true
      }
    ]
  }
]

export default function PostList() {
  return (
    <div className="space-y-4">
      {posts.map(post => (
        <Card key={post.id} className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{post.description}</p>
            <div className="flex items-center space-x-4 mb-6">
              <Button variant="outline" size="sm">
                <ThumbsUp className="w-4 h-4 mr-2" />
                {post.votes}
              </Button>
              <span className="text-sm text-gray-500">
                <MessageCircle className="w-4 h-4 inline mr-1" />
                {post.responses.length} responses
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}