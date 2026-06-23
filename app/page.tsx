'use client' // Added for Next.js app router if using inline styles/animations

import Link from 'next/link'
import { 
  ArrowRight, Receipt, ShieldCheck, Zap, Store, BarChart3, 
  CheckCircle2, Star, Quote, Cpu, Fingerprint, Activity, Smartphone
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0C10] text-[#EEEEF5] selection:bg-[#FF6B4A] selection:text-white overflow-hidden relative font-outfit">
      
      {/* 🎨 CUSTOM STYLES FOR FONTS & ANIMATIONS */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&display=swap');
        .font-outfit { font-family: 'Outfit', sans-serif; }
        
        @keyframes float-slow {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes float-fast {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float-1 { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-2 { animation: float-fast 4s ease-in-out infinite; }
        .animate-float-3 { animation: float-slow 7s ease-in-out infinite reverse; }
        
        .glass-panel {
          background: rgba(28, 30, 40, 0.4);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 107, 74, 0.1);
        }
      `}} />

      {/* 🌌 FLOATING ROBOTIC / RECEIPT BACKGROUND ELEMENTS */}
      <div className="absolute top-[15%] left-[5%] text-[#FF6B4A]/10 animate-float-1 pointer-events-none">
        <Receipt className="w-32 h-32" />
      </div>
      <div className="absolute top-[40%] right-[5%] text-[#F4C542]/10 animate-float-2 pointer-events-none">
        <Cpu className="w-24 h-24" />
      </div>
      <div className="absolute bottom-[20%] left-[10%] text-[#10B981]/10 animate-float-3 pointer-events-none">
        <Fingerprint className="w-40 h-40" />
      </div>

      {/* Background Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#FF6B4A] rounded-full blur-[200px] opacity-15 pointer-events-none"></div>
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-[#10B981] rounded-full blur-[200px] opacity-10 pointer-events-none"></div>

      {/* 🚀 NAVBAR (Glassmorphism) */}
      <nav className="fixed w-full z-50 glass-panel border-b-0 border-[#252733]/50">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B4A] to-[#E05535] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,107,74,0.4)]">
              <Store className="w-5 h-5 text-[#0A0C10]" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">Receipta</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/login" className="text-sm font-semibold text-[#A1A1B5] hover:text-white transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link href="/login" className="px-5 py-2.5 bg-[#FF6B4A] text-white text-sm font-bold rounded-xl hover:bg-[#E05535] transition-all flex items-center shadow-[0_0_15px_rgba(255,107,74,0.3)]">
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </nav>

      {/* 💥 HERO SECTION */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-40 pb-20 flex flex-col items-center text-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-[#FF6B4A]/30 text-[#FF6B4A] text-xs font-bold uppercase tracking-[0.2em] mb-8 animate-pulse">
          <Activity className="w-4 h-4" /> System V1.0 Online
        </div>

        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-[1.1] max-w-5xl">
          The Professional <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B4A] via-[#F4C542] to-[#FF6B4A] bg-[length:200%_auto] animate-pulse">
            Digital Receipt
          </span> Matrix.
        </h1>
        
        <p className="text-[#A1A1B5] text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-light">
          Ditch the paper. Generate, encrypt, and verify bank-grade digital receipts in seconds. Secure your business and build unbreakable trust with your customers.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#FF6B4A] to-[#E05535] text-white text-lg font-black rounded-2xl shadow-[0_0_40px_rgba(255,107,74,0.4)] hover:shadow-[0_0_60px_rgba(255,107,74,0.6)] transition-all flex items-center justify-center hover:-translate-y-1">
            INITIALIZE ACCOUNT
          </Link>
          <Link href="/verify" className="w-full sm:w-auto px-8 py-4 glass-panel text-white text-lg font-bold rounded-2xl hover:bg-[#252733]/80 transition-all flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 mr-2 text-[#10B981]" /> Verify Receipt
          </Link>
        </div>
      </main>

      {/* 🤝 TRUST TICKER (New Section) */}
      <div className="relative z-10 border-y border-[#252733]/30 bg-[#0A0C10]/50 py-6 overflow-hidden flex justify-center">
        <p className="text-[#A1A1B5] text-sm font-semibold uppercase tracking-widest flex items-center gap-8">
           <span>Trusted by 100+ Vendors</span> • <span>Gadget Stores</span> • <span>Fashion Brands</span> • <span>Agencies</span>
        </p>
      </div>

      {/* ⚙️ HOW IT WORKS (New Section) */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-16 tracking-tight">Generate in 3 simple steps.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FF6B4A]/30 to-transparent -translate-y-1/2 z-[-1]"></div>
            
            <div className="glass-panel p-8 rounded-[2rem] relative">
              <div className="w-16 h-16 bg-[#FF6B4A] rounded-full flex items-center justify-center text-2xl font-black text-[#0A0C10] mx-auto mb-6 shadow-[0_0_20px_rgba(255,107,74,0.4)]">1</div>
              <h3 className="text-xl font-bold text-white mb-2">Input Details</h3>
              <p className="text-[#A1A1B5] text-sm">Enter customer name, items sold, and amount. Takes less than 30 seconds.</p>
            </div>
            
            <div className="glass-panel p-8 rounded-[2rem] relative">
              <div className="w-16 h-16 bg-[#F4C542] rounded-full flex items-center justify-center text-2xl font-black text-[#0A0C10] mx-auto mb-6 shadow-[0_0_20px_rgba(244,197,66,0.4)]">2</div>
              <h3 className="text-xl font-bold text-white mb-2">System Generates</h3>
              <p className="text-[#A1A1B5] text-sm">Receipta creates a stunning, customized receipt with an anti-fraud QR code.</p>
            </div>

            <div className="glass-panel p-8 rounded-[2rem] relative">
              <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center text-2xl font-black text-[#0A0C10] mx-auto mb-6 shadow-[0_0_20px_rgba(16,185,129,0.4)]">3</div>
              <h3 className="text-xl font-bold text-white mb-2">Send & Secure</h3>
              <p className="text-[#A1A1B5] text-sm">Share directly to WhatsApp or download as HD image. Zero paper needed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ✨ FEATURES GRID */}
      <section className="relative z-10 glass-panel border-x-0 pt-24 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Powerful Vendor Tools.</h2>
            <p className="text-[#A1A1B5] font-light text-lg">Everything you need to run your operations smoothly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#13151D] border border-[#252733] p-8 rounded-[2rem] hover:border-[#FF6B4A]/50 transition-all hover:-translate-y-2 group duration-300">
              <div className="w-14 h-14 bg-[#FF6B4A]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Receipt className="w-7 h-7 text-[#FF6B4A]" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Smart Invoicing</h3>
              <p className="text-[#A1A1B5] leading-relaxed font-light">Generate beautiful, branded receipts in seconds. Download as HD images, print, or send directly to customers via WhatsApp.</p>
            </div>

            <div className="bg-[#13151D] border border-[#252733] p-8 rounded-[2rem] hover:border-[#F4C542]/50 transition-all hover:-translate-y-2 group duration-300">
              <div className="w-14 h-14 bg-[#F4C542]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7 text-[#F4C542]" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Sales Analytics</h3>
              <p className="text-[#A1A1B5] leading-relaxed font-light">Track your revenue, log your expenses, and instantly see your net profit. Make smarter business decisions with visual charts.</p>
            </div>

            <div className="bg-[#13151D] border border-[#252733] p-8 rounded-[2rem] hover:border-[#10B981]/50 transition-all hover:-translate-y-2 group duration-300">
              <div className="w-14 h-14 bg-[#10B981]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7 text-[#10B981]" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Anti-Fraud Matrix</h3>
              <p className="text-[#A1A1B5] leading-relaxed font-light">Every receipt gets a unique bank-grade QR code. Customers and security can scan to verify authenticity on our public portal.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 💬 TESTIMONIAL SECTION */}
      <section className="relative z-10 py-24 px-6 bg-[#0A0C10]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#13151D] to-[#0A0C10] border border-[#252733] p-10 md:p-14 rounded-[3rem] relative overflow-hidden">
            <Quote className="absolute top-8 right-8 w-32 h-32 text-[#252733] opacity-30" />
            
            <div className="flex gap-1 mb-6 relative z-10">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-[#F4C542] text-[#F4C542]" />
              ))}
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-relaxed relative z-10">
              "Receipta completely changed how my customers view my business. Sending a verified digital receipt makes me look like a top-tier tech company. Zero disputes since day one."
            </h3>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 bg-[#FF6B4A]/20 rounded-full flex items-center justify-center font-black text-[#FF6B4A] text-xl">
                OO
              </div>
              <div>
                <p className="text-white font-bold text-lg">Olamide O.</p>
                <p className="text-[#A1A1B5] text-sm flex items-center gap-1"><Smartphone className="w-3 h-3"/> Instagram Gadget Vendor</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOUNDER STORY ========== */}
      <section className="relative z-10 border-t border-[#FF6B4A]/20 py-24 px-6 relative overflow-hidden">
        {/* Subtle orange glow behind founder */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#FF6B4A] rounded-full blur-[250px] opacity-5 pointer-events-none"></div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-panel border-[#FF6B4A]/30 mb-8">
            <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
            <span className="text-xs font-bold tracking-[0.2em] text-[#A1A1B5] uppercase">Engineered in Nigeria</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
            Built by a developer who understands <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B4A] to-[#F4C542]">Nigerian vendors.</span>
          </h2>
          
          <p className="text-[#A1A1B5] text-xl max-w-2xl mx-auto mb-10 font-light">
            Hi, I’m <span className="font-bold text-white">IdanMagkk (MAGKK.TECK)</span>, founder of <span className="font-bold text-white">VELO Agency</span> based in Ibadan.
          </p>

          <div className="max-w-2xl mx-auto text-left space-y-6 text-[#EEEEF5] glass-panel p-8 md:p-10 rounded-[2rem] border border-[#252733] shadow-[0_0_50px_rgba(255,107,74,0.05)]">
            <p className="leading-relaxed font-light text-lg">I built Receipta because I saw too many hardworking vendors losing deals and facing disputes simply because their receipts looked unprofessional or couldn’t be verified.</p>
            <p className="leading-relaxed font-light text-lg">My goal is simple: give every Nigerian vendor — whether you sell gadgets, fashion, food, or run an Instagram business — a tool that makes you look bigger, builds instant customer trust, and helps you run your business with clarity.</p>
          </div>

          <div className="mt-10">
            <a 
              href="https://x.com/IdanMAGKK" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#13151D] border border-[#252733] text-[#FF6B4A] hover:bg-[#FF6B4A] hover:text-white font-bold transition-all group shadow-lg hover:shadow-[0_0_30px_rgba(255,107,74,0.3)]"
            >
              Connect with me on X <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#252733] py-12 text-center bg-[#050608] relative z-10 flex flex-col items-center">
        <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B4A] to-[#E05535] rounded-xl flex items-center justify-center mb-6 opacity-80 shadow-[0_0_15px_rgba(255,107,74,0.2)]">
          <Store className="w-6 h-6 text-[#0A0C10]" />
        </div>
        <p className="text-[#A1A1B5] text-sm font-bold uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} Receipta. All rights reserved.
        </p>
      </footer>

    </div>
  )
}
