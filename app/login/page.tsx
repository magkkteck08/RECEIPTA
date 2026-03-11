import Image from 'next/image'
import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

export default async function LoginPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ message: string }> 
}) {
  // Await the searchParams (Required for Next.js 15+)
  const params = await searchParams;

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
              {params?.message && (
                <div className="p-3 bg-[#FB7185]/10 border border-[#FB7185]/30 rounded-lg text-center mt-4">
                  <p className="text-[#FB7185] text-xs font-bold">{params.message}</p>
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