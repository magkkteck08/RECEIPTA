import Link from 'next/link'
import { MailCheck, ArrowLeft, ShieldAlert } from 'lucide-react'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-[#0F1117] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Premium Green Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#10B981] rounded-full blur-[200px] opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 text-center">
        <div className="bg-[#1C1E28] border border-[#252733] p-8 md:p-10 rounded-3xl shadow-2xl">
          
          <div className="w-20 h-20 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#10B981]/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <MailCheck className="w-10 h-10 text-[#10B981]" />
          </div>

          <h1 className="text-3xl font-black text-white mb-4 tracking-tight">Check your inbox</h1>
          <p className="text-[#737490] text-sm mb-8 leading-relaxed">
            We just sent a secure confirmation link to your email. Click the link inside to activate your Receipta business account.
          </p>

          <div className="p-4 bg-[#15171F] border border-[#252733] rounded-xl mb-8 text-left flex gap-3 items-start">
            <ShieldAlert className="w-5 h-5 text-[#F4C542] shrink-0 mt-0.5" />
            <p className="text-xs text-[#EEEEF5] font-medium leading-relaxed">
              <span className="text-[#F4C542] font-bold uppercase tracking-wider block mb-1">Pro tip</span> 
              If you don't see the email within 2 minutes, be sure to check your <span className="text-white font-bold">spam or promotions</span> folder.
            </p>
          </div>

          <Link href="/login" className="inline-flex items-center text-sm font-bold text-[#737490] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
          </Link>

        </div>
      </div>
    </div>
  )
}