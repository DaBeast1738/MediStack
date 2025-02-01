// src/components/NavBar.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LogIn, UserPlus } from 'lucide-react'

export default function NavBar() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            MediStack
          </Link>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="outline">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}