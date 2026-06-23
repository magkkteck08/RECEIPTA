import Link from 'next/link'
import {
  ArrowRight, Receipt, ShieldCheck, Zap, Store, BarChart3,
  CheckCircle2, Star, Quote, Github, Instagram
} from 'lucide-react'

// Decorative QR-style grid for the receipt card — not a functional code, just texture.
const qrPattern = [
  1, 1, 1, 0, 1,
  1, 0, 0, 0, 1,
  1, 1, 0, 1, 0,
  0, 1, 1, 0, 1,
  1, 0, 1, 1, 1,
].map(Boolean)

const lineItems = [
  ['Wireless Earbuds Pro', '₦24,500'],
  ['Charging Cable (2m)', '₦3,200'],
  ['Phone Case — Clear', '₦4,800'],
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#07090F] text-[#EAF1EE] font-sans selection:bg-[#00C896] selection:text-[#07090F] overflow-hidden relative">

      {/* Animations — pure CSS, no JS required */}
      <style>{`
        @keyframes floatMain { 0%,100% { transform: translateY(0) rotate(2deg); } 50% { transform: translateY(-14px) rotate(1deg); } }
        @keyframes floatGhost { 0%,100% { transform: translateY(0) rotate(-8deg); } 50% { transform: translateY(-9px) rotate(-9deg); } }
        @keyframes floatToast { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes stampPop { 0% { transform: scale(0) rotate(-12deg); opacity:0; } 60% { transform: scale(1.15) rotate(-12deg); opacity:1; } 100% { transform: scale(1) rotate(-12deg); opacity:1; } }
        @keyframes fadeUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
        .float-main { animation: floatMain 6s ease-in-out infinite; }
        .float-ghost { animation: floatGhost 7s ease-in-out infinite; }
        .float-toast { animation: floatToast 5s ease-in-out infinite; }
        .stamp-pop { animation: stampPop 0.6s 0.9s cubic-bezier(0.34,1.56,0.64,1) both; }
        .fade-up { animation: fadeUp 0.7s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .float-main, .float-ghost, .float-toast, .stamp-pop, .fade-up { animation: none !important; }
        }
      `}</style>

      {/* Background Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#00C896] rounded-full blur-[250px] opacity-[0.12] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[-10%] w-[500px] h-[500px] bg-[#047857] rounded-full blur-[250px] opacity-[0.14] pointer-events-none" />

      {/* NAVBAR */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto border-b border-[#1E2430]/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00C896] to-[#047857] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,200,150,0.35)]">
            <Store className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-white tracking-tight">Receipta</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-[#8B92A6] hover:text-white transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link href="/login" className="px-5 py-2.5 bg-[#11141B] border border-[#232838] text-white text-sm font-bold rounded-xl hover:border-[#00C896]/50 transition-all flex items-center group">
            Get Started <ArrowRight className="w-4 h-4 ml-2 text-[#00C896] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-28 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left: copy */}
        <div className="flex flex-col items-start text-left">
          <div className="fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00C896]/10 border border-[#00C896]/20 text-[#00C896] text-xs font-bold uppercase tracking-widest mb-8">
            <Zap className="w-4 h-4" /> The New Standard for Vendors
          </div>

          <h1 className="fade-up text-5xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-[1.05]" style={{ animationDelay: '0.05s' }}>
            Build Instant Trust With{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C896] to-[#5EEAD4]">
              Bank-Grade Receipts.
            </span>
          </h1>

          <p className="fade-up text-[#A8AFC0] text-lg max-w-xl mb-10 leading-relaxed" style={{ animationDelay: '0.1s' }}>
            Create, send, and verify beautiful digital receipts in seconds. Stop losing disputes and start looking like the premium business you are.
          </p>

          <div className="fade-up flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-12" style={{ animationDelay: '0.15s' }}>
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-[#00C896] text-[#07090F] text-base font-black rounded-2xl shadow-[0_0_30px_rgba(0,200,150,0.3)] hover:shadow-[0_0_40px_rgba(0,200,150,0.5)] transition-all flex items-center justify-center hover:-translate-y-1">
              CREATE FREE ACCOUNT
            </Link>
            <Link href="/verify" className="w-full sm:w-auto px-8 py-4 bg-[#11141B] border border-[#232838] text-white text-base font-bold rounded-2xl hover:bg-[#161B24] transition-all flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 mr-2 text-[#00C896]" /> Verify a Receipt
            </Link>
          </div>

          <div className="fade-up flex flex-wrap items-center gap-6 text-[#8B92A6] text-sm font-bold" style={{ animationDelay: '0.2s' }}>
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-[#00C896]" /> Free forever plan</span>
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-[#00C896]" /> Anti-fraud QR codes</span>
          </div>
        </div>

        {/* Right: floating receipt cluster — signature element */}
        <div className="relative w-full max-w-sm mx-auto h-[440px] lg:h-[480px]">

          {/* Ghost back card */}
          <div className="float-ghost absolute top-6 left-4 right-4 bottom-10 bg-[#161B24] border border-[#1E2430] rounded-3xl shadow-2xl" />

          {/* Main receipt card */}
          <div className="float-main absolute inset-0 bg-[#11141B] border border-[#232838] rounded-3xl p-6 shadow-[0_30px_60px_-15px_rgba(0,200,150,0.25)]">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gradient-to-br from-[#00C896] to-[#047857] rounded-lg flex items-center justify-center">
                  <Receipt className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-black text-white tracking-wide">RECEIPTA</span>
              </div>
              <span className="text-[10px] text-[#5C6478] font-mono">#RCP-2049</span>
            </div>

            <p className="text-[10px] text-[#5C6478] mb-4 font-mono">Lagos Tech Hub · Jun 23, 2026</p>

            <div className="space-y-2.5 mb-4">
              {lineItems.map(([item, price]) => (
                <div key={item} className="flex items-center justify-between text-xs">
                  <span className="text-[#A8AFC0]">{item}</span>
                  <span className="text-white font-bold">{price}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#232838] pt-3 flex items-center justify-between mb-5">
              <span className="text-xs font-bold text-[#8B92A6] uppercase tracking-wider">Total</span>
              <span className="text-lg font-black text-[#5EEAD4]">₦32,500</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="grid grid-cols-5 gap-[2px]">
                {qrPattern.map((on, i) => (
                  <span key={i} className={`w-1.5 h-1.5 rounded-[1px] ${on ? 'bg-[#00C896]' : 'bg-[#232838]'}`} />
                ))}
              </div>
              <span className="text-[9px] text-[#5C6478] font-mono">Scan to verify</span>
            </div>
          </div>

          {/* Verified stamp */}
          <div className="stamp-pop absolute -top-4 -right-3 bg-[#00C896] text-[#07090F] text-[10px] font-black px-3 py-1.5 rounded-full shadow-[0_10px_30px_-5px_rgba(0,200,150,0.6)] flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> VERIFIED
          </div>

          {/* Floating activity toast */}
          <div className="float-toast absolute -bottom-2 -left-6 bg-[#11141B] border border-[#232838] rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#00C896]/15 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00C896]" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white leading-tight">New sale captured</p>
              <p className="text-[9px] text-[#5C6478]">2 seconds ago</p>
            </div>
          </div>
        </div>
      </main>

      {/* FEATURES GRID */}
      <section className="relative z-10 border-t border-[#1E2430]/60 bg-[#0B0E14]/60 pt-24 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">Everything you need to scale safely.</h2>
            <p className="text-[#A8AFC0]">Powerful tools designed specifically for modern African businesses.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#11141B] border border-[#232838] p-8 rounded-3xl hover:border-[#00C896]/50 transition-colors group">
              <div className="w-12 h-12 bg-[#00C896]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Receipt className="w-6 h-6 text-[#00C896]" />
              </div>
              <h3 className="text-xl font-black text-white mb-3">Smart Invoicing</h3>
              <p className="text-[#A8AFC0] text-sm leading-relaxed">Generate beautiful, branded receipts in seconds. Download as HD images or send directly to customers via WhatsApp.</p>
            </div>

            <div className="bg-[#11141B] border border-[#232838] p-8 rounded-3xl hover:border-[#00C896]/50 transition-colors group">
              <div className="w-12 h-12 bg-[#00C896]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-[#00C896]" />
              </div>
              <h3 className="text-xl font-black text-white mb-3">Sales Analytics</h3>
              <p className="text-[#A8AFC0] text-sm leading-relaxed">Track your revenue, log your expenses, and instantly see your net profit. Make smarter decisions with visual charts.</p>
            </div>

            <div className="bg-[#11141B] border border-[#232838] p-8 rounded-3xl hover:border-[#00C896]/50 transition-colors group">
              <div className="w-12 h-12 bg-[#00C896]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6 text-[#00C896]" />
              </div>
              <h3 className="text-xl font-black text-white mb-3">Anti-Fraud Verification</h3>
              <p className="text-[#A8AFC0] text-sm leading-relaxed">Every receipt gets a unique bank-grade QR code. Customers can scan to verify authenticity on our public portal.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="relative z-10 py-24 px-6 bg-[#07090F]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#11141B] to-[#0B0E14] border border-[#232838] p-10 md:p-14 rounded-[40px] relative overflow-hidden">
            <Quote className="absolute top-8 right-8 w-24 h-24 text-[#232838] opacity-50" />

            <div className="flex gap-1 mb-6 relative z-10">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-[#00C896] text-[#00C896]" />
              ))}
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-relaxed relative z-10">
              "Receipta completely changed how my customers view my business. Sending a verified digital receipt makes me look like a top-tier company. I've had zero payment disputes since I started using it."
            </h3>

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-[#00C896]/20 rounded-full flex items-center justify-center font-bold text-[#00C896]">
                OO
              </div>
              <div>
                <p className="text-white font-bold">Olamide O.</p>
                <p className="text-[#8B92A6] text-sm">Instagram Gadget Vendor</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER SPACE */}
      <section className="relative z-10 border-t border-[#00C896]/15 bg-gradient-to-b from-[#047857]/5 to-[#07090F] py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00C896]/10 border border-[#00C896]/30 mb-6">
              <div className="w-2 h-2 bg-[#00C896] rounded-full animate-pulse" />
              <span className="text-xs font-bold tracking-[2px] text-[#00C896] uppercase">Founder Space</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Built by a developer who understands <span className="text-[#00C896]">Nigerian vendors.</span>
            </h2>
          </div>

          <div className="bg-[#11141B]/80 backdrop-blur-sm border border-[#00C896]/20 rounded-[32px] p-8 md:p-12 shadow-[0_0_60px_-15px_rgba(0,200,150,0.15)] grid md:grid-cols-[auto_1fr] gap-10 items-start">

            {/* Identity column */}
            <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-5 md:w-44 shrink-0">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-[#00C896] to-[#047857] flex items-center justify-center text-white text-2xl font-black shadow-[0_10px_30px_-5px_rgba(0,200,150,0.4)] shrink-0">
                IM
              </div>
              <div>
                <p className="text-white font-black">IdanMagkk</p>
                <p className="text-[#5C6478] text-xs font-bold">MAGKK.TECK</p>
                <p className="text-[#00C896] text-xs font-bold mt-1">Founder, VELO</p>
              </div>
            </div>

            {/* Story column */}
            <div className="space-y-5">
              <p className="text-[#C5C5D5] leading-relaxed">
                I built Receipta because I saw too many hardworking vendors losing deals and facing disputes simply because their receipts looked unprofessional or couldn't be verified.
              </p>
              <p className="text-[#C5C5D5] leading-relaxed">
                My goal is simple: give every Nigerian vendor — whether you sell gadgets, fashion, food, or run an Instagram business — a tool that makes you look bigger, builds instant customer trust, and helps you run your business with clarity.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://x.com/IdanMagkk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#161B24] border border-[#232838] flex items-center justify-center text-[#A8AFC0] font-black text-sm hover:bg-[#00C896] hover:text-[#07090F] hover:border-[#00C896] transition-all"
                  aria-label="IdanMagkk on X"
                >
                  X
                </a>
                <a
                  href="https://instagram.com/magkk_tigrr8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#161B24] border border-[#232838] flex items-center justify-center text-[#A8AFC0] hover:bg-[#00C896] hover:text-[#07090F] hover:border-[#00C896] transition-all"
                  aria-label="IdanMagkk on Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com/magkkteck08"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#161B24] border border-[#232838] flex items-center justify-center text-[#A8AFC0] hover:bg-[#00C896] hover:text-[#07090F] hover:border-[#00C896] transition-all"
                  aria-label="IdanMagkk on GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#232838] py-10 text-center bg-[#07090F] relative z-10 flex flex-col items-center">
        <div className="w-10 h-10 bg-gradient-to-br from-[#00C896] to-[#047857] rounded-xl flex items-center justify-center mb-6 opacity-50">
          <Store className="w-5 h-5 text-white" />
        </div>
        <p className="text-[#8B92A6] text-sm font-bold uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Receipta. All rights reserved.
        </p>
      </footer>

    </div>
  )
}
