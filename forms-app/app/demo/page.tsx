import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TypeIcon as FormIcon, ArrowLeft, Sparkles, Zap, Heart } from "lucide-react"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <header className="bg-white/70 backdrop-blur-md border-b border-purple-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="hover:bg-purple-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Demo Forms
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Try Our Demo Forms
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the magic of FormCraft! These demo forms showcase different field types and layouts. See how easy
            and fun form building can be! ✨
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-purple-50 to-purple-100 hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl text-purple-800">Customer Feedback ✨</CardTitle>
              <CardDescription className="text-purple-600">
                A comprehensive feedback form with various field types and emoji options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/form/demo-1">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0">
                  Try This Form 🚀
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-pink-50 to-pink-100 hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl text-pink-800">Event Registration 🎉</CardTitle>
              <CardDescription className="text-pink-600">
                Simple and elegant registration form for events and conferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/form/demo-2">
                <Button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white border-0">
                  Try This Form ✨
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-orange-50 to-orange-100 hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                <FormIcon className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl text-orange-800">Contact Form 📧</CardTitle>
              <CardDescription className="text-orange-600">
                Basic contact form perfect for websites and businesses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/form/demo-3">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0">
                  Try This Form 💫
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <Sparkles className="h-16 w-16 mx-auto mb-6 animate-pulse" />
              <h3 className="text-4xl font-bold mb-4">Ready to Create Your Own?</h3>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of creators who've discovered the joy of building beautiful forms!
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 font-semibold"
                  >
                    Start Creating Free 🎨
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-4 font-semibold"
                  >
                    Sign In 👋
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
