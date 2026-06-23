import Link from 'next/link'
import { ArrowRight, Receipt, ShieldCheck, Zap, Store, BarChart3, CheckCircle2, Star, Quote } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0F1117] text-[#EEEEF5] font-sans selection:bg-[#10B981] selection:text-white overflow-hidden relative">
      
      {/* Background Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#10B981] rounded-full blur-[250px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-[#047857] rounded-full blur-[250px] opacity-10 pointer-events-none"></div>

      {/* 🚀 NAVBAR */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto border-b border-[#252733]/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-[#047857] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Store className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-white tracking-tight">Receipta</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-[#737490] hover:text-white transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link href="/login" className="px-5 py-2.5 bg-[#1C1E28] border border-[#252733] text-white text-sm font-bold rounded-xl hover:border-[#10B981]/50 transition-all flex items-center group">
            Get Started <ArrowRight className="w-4 h-4 ml-2 text-[#10B981] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* 💥 HERO SECTION */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center text-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-xs font-bold uppercase tracking-widest mb-8">
          <Zap className="w-4 h-4" /> The New Standard for Vendors
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-tight max-w-4xl">
          Build Instant Trust With <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#34D399]">
            Bank-Grade Receipts.
          </span>
        </h1>
        
        <p className="text-[#A1A1B5] text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Create, send, and verify beautiful digital receipts in seconds. Stop losing disputes and start looking like the premium business you are.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-[#10B981] text-[#0F1117] text-base font-black rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center hover:-translate-y-1">
            CREATE FREE ACCOUNT
          </Link>
          <Link href="/verify" className="w-full sm:w-auto px-8 py-4 bg-[#1C1E28] border border-[#252733] text-white text-base font-bold rounded-2xl hover:bg-[#252733] transition-all flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 mr-2 text-[#10B981]" /> Verify a Receipt
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-[#737490] text-sm font-bold">
          <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-[#10B981]" /> Free forever plan</span>
          <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-[#10B981]" /> Anti-fraud QR codes</span>
          <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-[#10B981]" /> Setup in 60 seconds</span>
        </div>
      </main>

      {/* ✨ FEATURES GRID */}
      <section className="relative z-10 border-t border-[#252733]/50 bg-[#15171F]/50 pt-24 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">Everything you need to scale safely.</h2>
            <p className="text-[#A1A1B5]">Powerful tools designed specifically for modern African businesses.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1C1E28] border border-[#252733] p-8 rounded-3xl hover:border-[#10B981]/50 transition-colors group">
              <div className="w-12 h-12 bg-[#10B981]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Receipt className="w-6 h-6 text-[#10B981]" />
              </div>
              <h3 className="text-xl font-black text-white mb-3">Smart Invoicing</h3>
              <p className="text-[#A1A1B5] text-sm leading-relaxed">Generate beautiful, branded receipts in seconds. Download as HD images or send directly to customers via WhatsApp.</p>
            </div>

            <div className="bg-[#1C1E28] border border-[#252733] p-8 rounded-3xl hover:border-[#10B981]/50 transition-colors group">
              <div className="w-12 h-12 bg-[#10B981]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-[#10B981]" />
              </div>
              <h3 className="text-xl font-black text-white mb-3">Sales Analytics</h3>
              <p className="text-[#A1A1B5] text-sm leading-relaxed">Track your revenue, log your expenses, and instantly see your net profit. Make smarter decisions with visual charts.</p>
            </div>

            <div className="bg-[#1C1E28] border border-[#252733] p-8 rounded-3xl hover:border-[#10B981]/50 transition-colors group">
              <div className="w-12 h-12 bg-[#10B981]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6 text-[#10B981]" />
              </div>
              <h3 className="text-xl font-black text-white mb-3">Anti-Fraud Verification</h3>
              <p className="text-[#A1A1B5] text-sm leading-relaxed">Every receipt gets a unique bank-grade QR code. Customers can scan to verify authenticity on our public portal.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 💬 TESTIMONIAL SECTION */}
      <section className="relative z-10 py-24 px-6 bg-[#0F1117]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#1C1E28] to-[#15171F] border border-[#252733] p-10 md:p-14 rounded-[40px] relative overflow-hidden">
            <Quote className="absolute top-8 right-8 w-24 h-24 text-[#252733] opacity-50" />
            
            <div className="flex gap-1 mb-6 relative z-10">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-[#10B981] text-[#10B981]" />
              ))}
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-relaxed relative z-10">
              "Receipta completely changed how my customers view my business. Sending a verified digital receipt makes me look like a top-tier company. I've had zero payment disputes since I started using it."
            </h3>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-[#10B981]/20 rounded-full flex items-center justify-center font-bold text-[#10B981]">
                OO
              </div>
              <div>
                <p className="text-white font-bold">Olamide O.</p>
                <p className="text-[#737490] text-sm">Instagram Gadget Vendor</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== EMERALD FOUNDER STORY ========== */}
      <section className="relative z-10 border-t border-[#10B981]/20 bg-gradient-to-b from-[#047857]/5 to-[#0F1117] py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 mb-8">
            <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
            <span className="text-xs font-bold tracking-[2px] text-[#10B981] uppercase">Built in Nigeria</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6">
            Built by a developer who understands <span className="text-[#10B981]">Nigerian vendors.</span>
          </h2>
          
          <p className="text-[#A1A1B5] text-lg max-w-2xl mx-auto mb-10">
            Hi, I’m <span className="font-bold text-white">IdanMagkk (MAGKK.TECK)</span>, a full-stack developer and founder of <span className="font-bold text-white">VELO Agency</span> based in Ibadan.
          </p>

          <div className="max-w-2xl mx-auto text-left space-y-6 text-[#C5C5D5] bg-[#1C1E28]/80 backdrop-blur-sm p-8 md:p-10 rounded-3xl border border-[#10B981]/20 shadow-[0_0_50px_rgba(16,185,129,0.05)]">
            <p className="leading-relaxed">I built Receipta because I saw too many hardworking vendors losing deals and facing disputes simply because their receipts looked unprofessional or couldn’t be verified.</p>
            <p className="leading-relaxed">My goal is simple: give every Nigerian vendor — whether you sell gadgets, fashion, food, or run an Instagram business — a tool that makes you look bigger, builds instant customer trust, and helps you run your business with clarity.</p>
          </div>

          <div className="mt-10">
            <a 
              href="https://x.com/IdanMAGKK" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1C1E28] border border-[#252733] text-[#10B981] hover:bg-[#10B981] hover:text-[#0F1117] font-bold transition-all"
            >
              Connect with me on X (Twitter) →
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#252733] py-10 text-center bg-[#0F1117] relative z-10 flex flex-col items-center">
        <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-[#047857] rounded-xl flex items-center justify-center mb-6 opacity-50">
          <Store className="w-5 h-5 text-white" />
        </div>
        <p className="text-[#737490] text-sm font-bold uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Receipta. All rights reserved.
        </p>
      </footer>

    </div>
  )
}
