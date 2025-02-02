'use client'

import Link from 'next/link'
import { Facebook, Twitter, Linkedin, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white shadow-md mt-12">
      <div className="container mx-auto px-6 py-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Branding */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-blue-600">MediStack</h2>
            <p className="text-gray-600 text-sm">Empowering Health with Knowledge</p>
          </div>

          {/* Quick Links */}
          <div className="flex space-x-6 text-sm">
            <Link href="/about" className="text-gray-600 hover:text-blue-600">About</Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
            <Link href="/terms" className="text-gray-600 hover:text-blue-600">Terms</Link>
            <Link href="/privacy" className="text-gray-600 hover:text-blue-600">Privacy</Link>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <Link href="https://twitter.com" target="_blank">
              <Twitter className="w-5 h-5 text-gray-600 hover:text-blue-600" />
            </Link>
            <Link href="https://linkedin.com" target="_blank">
              <Linkedin className="w-5 h-5 text-gray-600 hover:text-blue-600" />
            </Link>
            <Link href="https://facebook.com" target="_blank">
              <Facebook className="w-5 h-5 text-gray-600 hover:text-blue-600" />
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} MediStack. All rights reserved.</p>
          <p>
            Made with <Heart className="inline w-4 h-4 text-red-500" /> for better healthcare.
          </p>
        </div>
      </div>
    </footer>
  )
}
