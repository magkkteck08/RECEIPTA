'use client'

import { useState, Suspense } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { login, signup } from './actions'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

function LoginContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
  
  const [loadingGoogle, setLoadingGoogle] = useState(false)

  // --- GOOGLE SIGN-IN FUNCTION ---
  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true)
    const supabase = createClient()
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/dashboard`,
      },
    })
    // Note: We don't need to set loading to false here because the browser will redirect automatically
  }

  return (
    <div className="min-h-screen bg-[#0F1117] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF6B4A] rounded-full blur-[250px] opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* 🚀 OFFICIAL BRAND LOGO SECTION */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-64 h-24 drop-shadow-[0_0_20px_rgba(255,107,74,0.15)]">
            <Image 
              src="/logo.png" 
              alt="Receipta Official Logo" 
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Shadcn Card styled with Premium Dark Theme */}
        <Card className="bg-[#1C1E28] border-[#252733] shadow-2xl text-white">
          <CardContent className="pt-8">
            <form className="space-y-5">
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[11px] font-bold text-[#EEEEF5] uppercase tracking-wider">Email Address</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="vendor@example.com" 
                  required 
                  className="h-12 bg-[#15171F] border-[#252733] rounded-xl px-4 text-white placeholder:text-[#737490] focus-visible:ring-[#FF6B4A] focus-visible:border-[#FF6B4A]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-[11px] font-bold text-[#EEEEF5] uppercase tracking-wider">Password</Label>
                  
                  {/* 🔑 THE FORGOT PASSWORD LINK */}
                  <Link href="/forgot-password" className="text-[11px] font-bold text-[#FF6B4A] hover:text-[#E05535] transition-colors underline-offset-2 hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="••••••••"
                  required 
                  className="h-12 bg-[#15171F] border-[#252733] rounded-xl px-4 text-white focus-visible:ring-[#FF6B4A] focus-visible:border-[#FF6B4A]"
                />
              </div>
              
              {/* Show error messages if they fail to login/signup */}
              {message && (
                <div className="p-3 bg-[#FB7185]/10 border border-[#FB7185]/30 rounded-lg text-center mt-4">
                  <p className="text-[#FB7185] text-xs font-bold">{message}</p>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-4">
                <Button formAction={login} className="w-full h-14 bg-gradient-to-r from-[#FF6B4A] to-[#E05535] text-white font-bold rounded-xl shadow-[0_0_20px_rgba(255,107,74,0.3)] hover:shadow-[0_0_30px_rgba(255,107,74,0.5)] transition-all text-base border-0">
                  SECURE LOGIN
                </Button>
                
                <Button formAction={signup} variant="outline" className="w-full h-14 bg-[#15171F] border border-[#252733] text-[#EEEEF5] hover:text-white hover:bg-[#252733] font-bold rounded-xl transition-all text-base">
                  CREATE ACCOUNT
                </Button>
              </div>

            </form>

            {/* --- GOOGLE OAUTH SECTION --- */}
            <div className="relative flex items-center py-6">
              <div className="flex-grow border-t border-[#252733]"></div>
              <span className="shrink-0 px-4 text-[#737490] text-[10px] font-bold uppercase tracking-widest">Or continue with</span>
              <div className="flex-grow border-t border-[#252733]"></div>
            </div>

            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loadingGoogle}
              className="w-full h-14 bg-[#15171F] border border-[#252733] text-white hover:bg-[#252733] hover:text-white transition-all rounded-xl font-bold text-sm flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"/>
                <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"/>
                <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"/>
                <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"/>
              </svg>
              {loadingGoogle ? 'CONNECTING...' : 'GOOGLE'}
            </Button>

          </CardContent>
        </Card>

        {/* Security Badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[#737490] text-xs font-bold uppercase tracking-widest opacity-60">
          <ShieldCheck className="w-4 h-4" /> Bank-Grade 256-Bit Security
        </div>

      </div>
    </div>
  )
}

// Next.js requires useSearchParams to be wrapped in a Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0F1117] flex items-center justify-center">
        <ShieldCheck className="w-12 h-12 text-[#FF6B4A] animate-pulse" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
