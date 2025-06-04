import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TypeIcon as FormIcon, Share2, BarChart3, Sparkles, Zap, Heart } from "lucide-react"
import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full text-sm font-medium text-purple-700 mb-6">
            <Sparkles className="h-4 w-4" />
            The most fun way to build forms
          </div>
          <h2 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Create Amazing Forms
            </span>
            <br />
            <span className="text-gray-800">in Seconds! 🚀</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Build beautiful, interactive forms that your users will love. No coding required - just drag, drop, and
            share!
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <SignedOut>
              <SignUpButton mode="modal">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all"
                >
                  Start Creating Now 🎨
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/create-form">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all"
                >
                  Start Creating Now 🎨
                </Button>
              </Link>
            </SignedIn>
            <Link href="/demo">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 border-2 border-purple-200 hover:bg-purple-50"
              >
                Try Demo Forms 👀
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Why Everyone Loves FormCraft
            </span>
          </h3>
          <p className="text-gray-600 text-lg">Join thousands of creators building amazing forms every day!</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-purple-50 to-purple-100 hover:scale-105">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-purple-800">Lightning Fast Builder</CardTitle>
              <CardDescription className="text-purple-600">
                Create stunning forms in minutes with our super intuitive drag-and-drop interface
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-pink-50 to-pink-100 hover:scale-105">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Share2 className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-pink-800">Share Anywhere</CardTitle>
              <CardDescription className="text-pink-600">
                One click sharing! Send your forms to anyone, anywhere - no signup required for respondents
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-orange-50 to-orange-100 hover:scale-105">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-orange-800">Smart Analytics</CardTitle>
              <CardDescription className="text-orange-600">
                Get instant insights with beautiful charts and real-time response tracking
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative">
            <Heart className="h-16 w-16 mx-auto mb-6 animate-pulse" />
            <h3 className="text-4xl font-bold mb-4">Ready to Fall in Love with Forms?</h3>
            <p className="text-xl mb-8 opacity-90">
              Join 50,000+ creators who've already discovered the joy of FormCraft
            </p>
            <SignedOut>
              <SignUpButton mode="modal">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 font-semibold">
                  Start Your Journey 💫
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 font-semibold">
                  Go to Dashboard 💫
                </Button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-purple-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <FormIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">FormCraft</span>
          </div>
          <p className="text-gray-300">Made with ❤️ for creators everywhere</p>
          <p className="text-gray-400 text-sm mt-2">© 2024 FormCraft. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
