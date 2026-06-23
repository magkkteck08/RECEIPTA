import Link from 'next/link'
import { ArrowRight, Receipt, ShieldCheck, Zap, Store, BarChart3, CheckCircle2 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0F1117] text-[#EEEEF5] font-sans selection:bg-[#FF6B4A] selection:text-white overflow-hidden relative">
      
      {/* Background Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FF6B4A] rounded-full blur-[250px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#10B981] rounded-full blur-[250px] opacity-5 pointer-events-none"></div>

      {/* 🚀 NAVBAR */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto border-b border-[#252733]/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B4A] to-[#E05535] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,107,74,0.3)]">
            <Store className="w-5 h-5 text-[#0F1117]" />
          </div>
          <span className="text-xl font-black text-white tracking-tight">Receipta</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-[#737490] hover:text-white transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link href="/login" className="px-5 py-2.5 bg-[#1C1E28] border border-[#252733] text-white text-sm font-bold rounded-xl hover:bg-[#252733] transition-all flex items-center">
            Get Started <ArrowRight className="w-4 h-4 ml-2 text-[#FF6B4A]" />
          </Link>
        </div>
      </nav>

      {/* 💥 HERO SECTION */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF6B4A]/10 border border-[#FF6B4A]/20 text-[#FF6B4A] text-[10px] font-black uppercase tracking-widest mb-8">
          <Zap className="w-3 h-3" /> V1.0 is now live
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-tight max-w-4xl">
          The Professional <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B4A] to-[#F4C542]">
            Digital Receipt
          </span> Generator.
        </h1>
        
        <p className="text-[#737490] text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-medium">
          Ditch the paper. Create, send, and verify bank-grade digital receipts in seconds. Build trust with your customers and track your sales like a pro.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#FF6B4A] to-[#E05535] text-white text-base font-black rounded-2xl shadow-[0_0_30px_rgba(255,107,74,0.3)] hover:shadow-[0_0_40px_rgba(255,107,74,0.5)] transition-all flex items-center justify-center hover:-translate-y-1">
            CREATE FREE ACCOUNT
          </Link>
          <Link href="/verify" className="w-full sm:w-auto px-8 py-4 bg-[#1C1E28] border border-[#252733] text-white text-base font-bold rounded-2xl hover:bg-[#252733] transition-all flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 mr-2 text-[#10B981]" /> Verify a Receipt
          </Link>
        </div>

        <div className="mt-12 flex items-center gap-6 text-[#737490] text-sm font-bold">
          <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-[#10B981]" /> No credit card required</span>
          <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-[#10B981]" /> Setup in 60 seconds</span>
        </div>
      </main>

      {/* ✨ FEATURES GRID */}
      <section className="relative z-10 border-t border-[#252733]/50 bg-[#15171F]/50 pt-24 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">Everything you need to run your business.</h2>
            <p className="text-[#737490]">Powerful tools designed specifically for modern vendors and creators.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-[#1C1E28] border border-[#252733] p-8 rounded-3xl hover:border-[#FF6B4A]/50 transition-colors">
              <div className="w-12 h-12 bg-[#FF6B4A]/10 rounded-xl flex items-center justify-center mb-6">
                <Receipt className="w-6 h-6 text-[#FF6B4A]" />
              </div>
              <h3 className="text-xl font-black text-white mb-3">Smart Invoicing</h3>
              <p className="text-[#737490] text-sm leading-relaxed">Generate beautiful, branded receipts in seconds. Download as HD images, print, or send directly to customers via WhatsApp.</p>
            </div>

            <div className="bg-[#1C1E28] border border-[#252733] p-8 rounded-3xl hover:border-[#F4C542]/50 transition-colors">
              <div className="w-12 h-12 bg-[#F4C542]/10 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-[#F4C542]" />
              </div>
              <h3 className="text-xl font-black text-white mb-3">Sales Analytics</h3>
              <p className="text-[#737490] text-sm leading-relaxed">Track your revenue, log your expenses, and instantly see your net profit. Make smarter business decisions with visual charts.</p>
            </div>

            <div className="bg-[#1C1E28] border border-[#252733] p-8 rounded-3xl hover:border-[#10B981]/50 transition-colors">
              <div className="w-12 h-12 bg-[#10B981]/10 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-[#10B981]" />
              </div>
              <h3 className="text-xl font-black text-white mb-3">Anti-Fraud Verification</h3>
              <p className="text-[#737490] text-sm leading-relaxed">Every receipt gets a unique bank-grade QR code. Customers and security can scan to verify authenticity on our public portal.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ========== FOUNDER STORY (NEW) ========== */}
      <section className="relative z-10 border-t border-[#252733]/50 py-20 px-6 bg-[#0F1117]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1E28] border border-[#252733] mb-6">
            <div className="w-2 h-2 bg-[#FF6B4A] rounded-full animate-pulse"></div>
            <span className="text-xs font-bold tracking-[2px] text-[#FF6B4A] uppercase">Built in Nigeria</span>
          </div>

          <h2 className="text-4xl font-black tracking-tight text-white mb-6">
            Built by a developer who understands Nigerian vendors
          </h2>
          
          <p className="text-[#A1A1B5] text-lg max-w-2xl mx-auto mb-8">
            Hi, I’m <span className="font-semibold text-white">IdanMagkk (MAGKK.TECK)</span>, a full-stack developer and founder of <span className="font-semibold text-white">VELO Agency</span> based in Ibadan, Nigeria.
          </p>

          <div className="max-w-2xl mx-auto text-left space-y-4 text-[#C5C5D5] text-[15px]">
            <p>I built Receipta because I saw too many hardworking vendors losing deals and facing disputes simply because their receipts looked unprofessional or couldn’t be verified.</p>
            <p>My goal is simple: give every Nigerian vendor — whether you sell gadgets, fashion, food, or run an Instagram business — a tool that makes you look bigger, builds instant customer trust, and helps you run your business with clarity.</p>
          </div>

          <div className="mt-8">
            <a 
              href="https://x.com/IdanMAGKK" 
              target="_blank" 
              className="inline-flex items-center gap-2 text-[#FF6B4A] hover:text-white font-bold transition-colors"
            >
              Connect with me on X →
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER (Improved) */}
      <footer className="border-t border-[#252733] py-10 text-center bg-[#0F1117] relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-[#737490] text-xs font-bold uppercase tracking-widest mb-4">
            &copy; {new Date().getFullYear()} Receipta — Built by VELO Agency in Ibadan, Nigeria
          </p>
          <div className="flex justify-center gap-6 text-sm text-[#737490]">
            <Link href="https://x.com/IdanMAGKK" className="hover:text-white transition-colors">Follow on X</Link>
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <Link href="https://velo-pulse.cv" className="hover:text-white transition-colors">VELO Pulse</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
