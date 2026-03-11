'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'react-hot-toast'
import { KeyRound, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  // Notice we removed createClient() from here!
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 🛡️ THE CTO BYPASS: We create the client INSIDE the click handler.
      // Vercel's build compiler ignores this completely during deployment!
      const supabase = createClient()
      const origin = typeof window !== 'undefined' ? window.location.origin : ''

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/update-password`,
      })

      if (error) {
        toast.error(error.message)
      } else {
        setIsSent(true)
        toast.success("Recovery email sent!")
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1117] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF6B4A] rounded-full blur-[200px] opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <Link href="/login" className="inline-flex items-center text-[#737490] hover:text-white transition-colors mb-8 text-sm font-bold">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
        </Link>

        <div className="bg-[#1C1E28] border border-[#252733] p-8 md:p-10 rounded-3xl shadow-2xl">
          <div className="w-16 h-16 bg-[#FF6B4A]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#FF6B4A]/20">
            <KeyRound className="w-8 h-8 text-[#FF6B4A]" />
          </div>
          
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Reset Password</h1>
          <p className="text-[#737490] text-sm mb-8 leading-relaxed">
            Enter the email address associated with your Receipta account, and we'll send you a secure link to reset your password.
          </p>

          {isSent ? (
            <div className="bg-[#10B981]/10 border border-[#10B981]/30 p-4 rounded-xl text-center">
              <p className="text-[#10B981] font-bold text-sm mb-1">Check your inbox!</p>
              <p className="text-[#EEEEF5] text-xs">We sent a recovery link to <b>{email}</b></p>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              <div>
                <label className="text-[11px] font-bold text-[#EEEEF5] uppercase tracking-wider mb-2 block">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 bg-[#15171F] border border-[#252733] rounded-xl px-4 text-white focus:outline-none focus:border-[#FF6B4A] transition-colors"
                  placeholder="vendor@example.com"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-[#FF6B4A] to-[#E05535] text-white font-bold rounded-xl shadow-[0_0_20px_rgba(255,107,74,0.3)] hover:opacity-90 transition-all disabled:opacity-50"
              >
                {loading ? 'SENDING LINK...' : 'SEND RECOVERY LINK'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
