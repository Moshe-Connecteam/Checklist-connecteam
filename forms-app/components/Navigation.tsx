'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Menu, X, Plus, LayoutDashboard } from 'lucide-react'

export default function Navigation() {
  const { user, isLoaded } = useUser()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                FormCraft
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isLoaded && user && (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/create-form"
                  className="flex items-center space-x-1 bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Form</span>
                </Link>
              </>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoaded ? (
              user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    Hey, {user.firstName || user.emailAddresses[0]?.emailAddress?.split('@')[0]}!
                  </span>
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8"
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <SignInButton mode="modal">
                    <button className="text-gray-700 hover:text-purple-600 transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              )
            ) : (
              <div className="animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-purple-600 focus:outline-none focus:text-purple-600"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isLoaded && user && (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 block px-3 py-2 text-base font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/create-form"
                    className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 block px-3 py-2 text-base font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Form</span>
                  </Link>
                  <hr className="my-2" />
                </>
              )}
              
              {/* Mobile Auth */}
              <div className="px-3 py-2">
                {isLoaded ? (
                  user ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <UserButton 
                          afterSignOutUrl="/"
                          appearance={{
                            elements: {
                              avatarBox: "w-8 h-8"
                            }
                          }}
                        />
                        <span className="text-sm text-gray-600">
                          {user.firstName || user.emailAddresses[0]?.emailAddress?.split('@')[0]}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <SignInButton mode="modal">
                        <button 
                          className="w-full text-left text-gray-700 hover:text-purple-600 block py-2 text-base font-medium transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Sign In
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button 
                          className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors text-center"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Sign Up
                        </button>
                      </SignUpButton>
                    </div>
                  )
                ) : (
                  <div className="animate-pulse">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 