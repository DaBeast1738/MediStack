// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AuthProvider from '@/components/AuthProvider' // Import AuthProvider
import Navbar from '@/components/NavBar' // Import global Navbar
import Footer from '@/components/Footer' // Import global Footer

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MediStack - Medical Q&A Platform',
  description: 'Get medical advice from verified doctors',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} bg-gray-100 text-gray-900`}>
        <AuthProvider> {/* Wrap inside AuthProvider */}
          <Navbar /> {/* Global navigation bar */}
          <main className="container mx-auto px-4 py-6 min-h-screen">
            {children}
          </main>
          <Footer /> {/* Global footer */}
        </AuthProvider>
      </body>
    </html>
  )
}
