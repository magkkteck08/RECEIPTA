'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Lock } from 'lucide-react'

export default function UpdatePasswordPage() {
  const supabase = createClient()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) return toast.error("Password must be at least 6 characters")
    
    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Password updated successfully! 🎉")
      router.push('/dashboard') // Send them straight to the app!
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0F1117] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#10B981] rounded-full blur-[200px] opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#1C1E28] border border-[#252733] p-8 md:p-10 rounded-3xl shadow-2xl text-center">
          <div className="w-16 h-16 bg-[#10B981]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#10B981]/20">
            <Lock className="w-8 h-8 text-[#10B981]" />
          </div>
          
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">New Password</h1>
          <p className="text-[#737490] text-sm mb-8">
            Please enter your new secure password below.
          </p>

          <form onSubmit={handleUpdate} className="space-y-6 text-left">
            <div>
              <label className="text-[11px] font-bold text-[#EEEEF5] uppercase tracking-wider mb-2 block">New Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 bg-[#15171F] border border-[#252733] rounded-xl px-4 text-white focus:outline-none focus:border-[#10B981] transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 bg-[#10B981] text-white font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}