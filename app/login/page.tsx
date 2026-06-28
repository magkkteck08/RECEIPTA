'use client'

import { Suspense } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

function LoginContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  return (
    <div className="min-h-screen bg-[#0F1117] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Glow - Updated to Emerald Green */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00C896] rounded-full blur-[250px] opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* 🚀 OFFICIAL BRAND LOGO SECTION */}
        <div className="flex flex-col items-center mb-8">
          {/* Logo Drop Shadow - Updated to Emerald Green RGBA */}
          <div className="relative w-64 h-24 drop-shadow-[0_0_20px_rgba(0,200,150,0.15)]">
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
                  className="h-12 bg-[#15171F] border-[#252733] rounded-xl px-4 text-white placeholder:text-[#737490] focus-visible:ring-[#00C896] focus-visible:border-[#00C896]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-[11px] font-bold text-[#EEEEF5] uppercase tracking-wider">Password</Label>
                  
                  {/* 🔑 THE FORGOT PASSWORD LINK - Updated to Emerald Green */}
                  <Link href="/forgot-password" className="text-[11px] font-bold text-[#00C896] hover:text-[#00A67C] transition-colors underline-offset-2 hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="••••••••"
                  required 
                  className="h-12 bg-[#15171F] border-[#252733] rounded-xl px-4 text-white focus-visible:ring-[#00C896] focus-visible:border-[#00C896]"
                />
              </div>
              
              {/* Show error messages if they fail to login/signup */}
              {message && (
                <div className="p-3 bg-[#FB7185]/10 border border-[#FB7185]/30 rounded-lg text-center mt-4">
                  <p className="text-[#FB7185] text-xs font-bold">{message}</p>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-4">
                {/* Login Button - Updated to Emerald Green Gradient and Shadow */}
                <Button formAction={login} className="w-full h-14 bg-gradient-to-r from-[#00C896] to-[#00A67C] text-white font-bold rounded-xl shadow-[0_0_20px_rgba(0,200,150,0.3)] hover:shadow-[0_0_30px_rgba(0,200,150,0.5)] transition-all text-base border-0">
                  SECURE LOGIN
                </Button>
                
                <Button formAction={signup} variant="outline" className="w-full h-14 bg-[#15171F] border border-[#252733] text-[#EEEEF5] hover:text-white hover:bg-[#252733] font-bold rounded-xl transition-all text-base">
                  CREATE ACCOUNT
                </Button>
              </div>

            </form>
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
        {/* Loading Spinner - Updated to Emerald Green */}
        <ShieldCheck className="w-12 h-12 text-[#00C896] animate-pulse" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
