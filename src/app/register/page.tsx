'use client'; 

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    // Add registration logic here
    setIsLoading(false)
    router.push('/')
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Full Name"
            required
          />
          <Input
            type="email"
            placeholder="Email"
            required
          />
          <Input
            type="password"
            placeholder="Password"
            required
          />
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="isDoctor" className="rounded" />
            <label htmlFor="isDoctor">I am a medical professional</label>
          </div>
          <Button 
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Register'}
          </Button>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
