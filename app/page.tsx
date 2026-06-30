'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import {
  ArrowRight, Receipt, ShieldCheck, Zap, Store, BarChart3,
  CheckCircle2, Star, Quote, Github, Instagram, Lock, Unlock, Crown, ChevronDown, Mail, X, Search, XCircle, CheckCircle, CreditCard, Calendar, ShoppingBag
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

const faqs = [
  {
    question: "How do my customers verify the QR code?",
    answer: "Every receipt generated on Receipta includes a unique, secure QR code. Your customers or security personnel can simply point their smartphone camera at the code to be redirected to our public verification portal, instantly confirming the receipt's authenticity."
  },
  {
    question: "Can I send these directly to WhatsApp?",
    answer: "Yes! Once you generate a receipt, you can download it as a high-definition image with one click. From there, you can easily share it directly to your customer's WhatsApp, email, or any other messaging platform."
  },
  {
    question: "What happens if I exceed my Basic plan limit?",
    answer: "If you hit your 20 receipts per month limit on the Basic plan, you won't be able to generate new ones until the next billing cycle. We recommend upgrading to the Premium Yearly Plan for completely unlimited receipt generation."
  },
  {
    question: "Do my customers need to download the app to view receipts?",
    answer: "Not at all. Customers receive the receipt as a standard image file. They only interact with our website if they choose to scan the QR code to verify the transaction."
  }
]

export default function LandingPage() {
  // --- VERIFICATION MODAL STATE ---
  const [isVerifyOpen, setIsVerifyOpen] = useState(false)
  const [verifyCode, setVerifyCode] = useState('')
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [verifyResult, setVerifyResult] = useState<any>(null)

  // --- SUPABASE VERIFY FUNCTION ---
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!verifyCode.trim()) return

    setVerifyLoading(true)
    setVerifyResult(null)

    const supabase = createClient()
    const { data, error } = await supabase
      .from('receipts')
      .select('*, businesses(*), receipt_items(*)')
      .eq('verification_code', verifyCode.trim())
      .single()

    if (data && !error) {
      setVerifyResult(data)
    } else {
      setVerifyResult(false)
    }
    
    setVerifyLoading(false)
  }

  // Helper to format date if receipt is valid
  const getFormattedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-[#0F1117] text-[#EEEEF5] font-sans selection:bg-[#00C896] selection:text-[#0F1117] overflow-hidden relative">

      {/* Animations & Custom Styles */}
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
        
        details > summary { list-style: none; }
        details > summary::-webkit-details-marker { display: none; }
        
        @media (prefers-reduced-motion: reduce) {
          .float-main, .float-ghost, .float-toast, .stamp-pop, .fade-up { animation: none !important; }
        }
      `}</style>

      {/* Background Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#00C896] rounded-full blur-[250px] opacity-[0.12] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[-10%] w-[500px] h-[500px] bg-[#047857] rounded-full blur-[250px] opacity-[0.14] pointer-events-none" />

      {/* NAVBAR */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto border-b border-[#252733]/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00C896] to-[#047857] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,200,150,0.35)]">
            <Store className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-white tracking-tight">Receipta</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-[#737490] hover:text-white transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link href="/login" className="px-5 py-2.5 bg-[#1C1E28] border border-[#252733] text-white text-sm font-bold rounded-xl hover:border-[#00C896]/50 transition-all flex items-center group">
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

          <p className="fade-up text-[#737490] text-lg max-w-xl mb-10 leading-relaxed" style={{ animationDelay: '0.1s' }}>
            Create, send, and verify beautiful digital receipts in seconds. Stop losing disputes and start looking like the premium business you are.
          </p>

          {/* ACTION AREA */}
          <div className="fade-up w-full max-w-md mb-12" style={{ animationDelay: '0.15s' }}>
            <div className="flex flex-col gap-3 mb-4">
              <Link href="/login" className="w-full px-8 py-4 bg-[#00C896] text-[#0F1117] text-base font-black rounded-2xl shadow-[0_0_30px_rgba(0,200,150,0.3)] hover:shadow-[0_0_40px_rgba(0,200,150,0.5)] transition-all flex items-center justify-center hover:-translate-y-1">
                CREATE FREE ACCOUNT
              </Link>
              
              <Link href="/login" className="w-full px-8 py-4 bg-[#1C1E28] border border-[#252733] text-white text-base font-bold rounded-2xl hover:bg-[#15171F] hover:border-[#737490] transition-all flex items-center justify-center gap-3">
                Login
              </Link>
            </div>

            {/* OPEN MODAL BUTTON */}
            <button 
              onClick={() => setIsVerifyOpen(true)}
              className="w-full px-8 py-4 bg-transparent border border-[#252733] text-[#737490] text-sm font-bold rounded-2xl hover:bg-[#1C1E28] hover:text-white transition-all flex items-center justify-center"
            >
              <ShieldCheck className="w-4 h-4 mr-2 text-[#00C896]" /> Verify a Receipt Securely
            </button>
          </div>

          <div className="fade-up flex flex-wrap items-center gap-6 text-[#737490] text-sm font-bold" style={{ animationDelay: '0.2s' }}>
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-[#00C896]" /> Free forever plan</span>
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-[#00C896]" /> Anti-fraud QR codes</span>
          </div>
        </div>

        {/* Right: floating receipt cluster */}
        <div className="relative w-full max-w-sm mx-auto h-[440px] lg:h-[480px]">
          <div className="float-ghost absolute top-6 left-4 right-4 bottom-10 bg-[#15171F] border border-[#252733] rounded-3xl shadow-2xl" />
          <div className="float-main absolute inset-0 bg-[#1C1E28] border border-[#252733] rounded-3xl p-6 shadow-[0_30px_60px_-15px_rgba(0,200,150,0.25)]">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gradient-to-br from-[#00C896] to-[#047857] rounded-lg flex items-center justify-center">
                  <Receipt className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-black text-white tracking-wide">RECEIPTA</span>
              </div>
              <span className="text-[10px] text-[#737490] font-mono">#RCP-2049</span>
            </div>
            <p className="text-[10px] text-[#737490] mb-4 font-mono">Lagos Tech Hub · Jun 23, 2026</p>
            <div className="space-y-2.5 mb-4">
              {lineItems.map(([item, price]) => (
                <div key={item} className="flex items-center justify-between text-xs">
                  <span className="text-[#EEEEF5]">{item}</span>
                  <span className="text-white font-bold">{price}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#252733] pt-3 flex items-center justify-between mb-5">
              <span className="text-xs font-bold text-[#737490] uppercase tracking-wider">Total</span>
              <span className="text-lg font-black text-[#5EEAD4]">₦32,500</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="grid grid-cols-5 gap-[2px]">
                {qrPattern.map((on, i) => (
                  <span key={i} className={`w-1.5 h-1.5 rounded-[1px] ${on ? 'bg-[#00C896]' : 'bg-[#252733]'}`} />
                ))}
              </div>
              <span className="text-[9px] text-[#737490] font-mono">Scan to verify</span>
            </div>
          </div>
          <div className="stamp-pop absolute -top-4 -right-3 bg-[#00C896] text-[#0F1117] text-[10px] font-black px-3 py-1.5 rounded-full shadow-[0_10px_30px_-5px_rgba(0,200,150,0.6)] flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> VERIFIED
          </div>
        </div>
      </main>

      {/* FEATURES GRID */}
      <section className="relative z-10 border-t border-[#252733]/60 bg-[#0F1117] pt-24 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">Everything you need to scale safely.</h2>
            <p className="text-[#737490]">Powerful tools designed specifically for modern African businesses.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1C1E28] border border-[#252733] p-8 rounded-3xl hover:border-[#00C896]/50 transition-colors group">
              <div className="w-12 h-12 bg-[#00C896]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Receipt className="w-6 h-6 text-[#00C896]" />
              </div>
              <h3 className="text-xl font-black text-white mb-3">Smart Invoicing</h3>
              <p className="text-[#737490] text-sm leading-relaxed">Generate beautiful, branded receipts in seconds. Download as HD images or send directly to customers via WhatsApp.</p>
            </div>
            <div className="bg-[#1C1E28] border border-[#252733] p-8 rounded-3xl hover:border-[#00C896]/50 transition-colors group">
              <div className="w-12 h-12 bg-[#00C896]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-[#00C896]" />
              </div>
              <h3 className="text-xl font-black text-white mb-3">Sales Analytics</h3>
              <p className="text-[#737490] text-sm leading-relaxed">Track your revenue, log your expenses, and instantly see your net profit. Make smarter decisions with visual charts.</p>
            </div>
            <div className="bg-[#1C1E28] border border-[#252733] p-8 rounded-3xl hover:border-[#00C896]/50 transition-colors group">
              <div className="w-12 h-12 bg-[#00C896]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6 text-[#00C896]" />
              </div>
              <h3 className="text-xl font-black text-white mb-3">Anti-Fraud Verification</h3>
              <p className="text-[#737490] text-sm leading-relaxed">Every receipt gets a unique bank-grade QR code. Customers can scan to verify authenticity on our public portal.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="relative z-10 border-t border-[#252733]/60 bg-[#0F1117] pt-24 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00C896]/10 border border-[#00C896]/30 mb-6">
              <Crown className="w-4 h-4 text-[#00C896]" />
              <span className="text-xs font-bold tracking-[2px] text-[#00C896] uppercase">Level Up Your Business</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Simple, transparent pricing.</h2>
            <p className="text-[#737490]">Remove all limits and show your customers you mean business.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <div className="bg-[#1C1E28] border border-[#252733] p-8 rounded-3xl flex flex-col">
              <h3 className="text-xl font-black text-white mb-2">Free</h3>
              <p className="text-[#737490] text-sm mb-6">Perfect for getting started.</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-white">₦0</span>
                <span className="text-[#737490]"> / forever</span>
              </div>
              <div className="space-y-4 mb-8 flex-1">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00C896] shrink-0 mt-0.5" />
                  <p className="text-[#EEEEF5] text-sm">Up to <strong className="text-white">5 receipts</strong> per month.</p>
                </div>
                <div className="flex items-start gap-3 opacity-60">
                  <Lock className="w-5 h-5 text-[#737490] shrink-0 mt-0.5" />
                  <p className="text-[#737490] text-sm">Dashboard access locked.</p>
                </div>
              </div>
              <Link href="/login" className="w-full py-4 bg-[#15171F] border border-[#252733] text-white text-sm font-bold rounded-xl hover:bg-[#252733] transition-colors text-center">
                Start Free
              </Link>
            </div>

            {/* Basic Tier */}
            <div className="bg-[#1C1E28] border border-[#252733] p-8 rounded-3xl flex flex-col">
              <h3 className="text-xl font-black text-white mb-2">Basic</h3>
              <p className="text-[#737490] text-sm mb-6">For growing daily vendors.</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-white">₦17,000</span>
                <span className="text-[#737490]"> / year</span>
              </div>
              <div className="space-y-4 mb-8 flex-1">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00C896] shrink-0 mt-0.5" />
                  <p className="text-[#EEEEF5] text-sm">Up to <strong className="text-white">20 receipts</strong> per month.</p>
                </div>
                <div className="flex items-start gap-3">
                  <Unlock className="w-5 h-5 text-[#00C896] shrink-0 mt-0.5" />
                  <p className="text-[#EEEEF5] text-sm"><strong className="text-white">Unlocked Dashboard:</strong> Access to basic stats and history.</p>
                </div>
              </div>
              <Link href="/login" className="w-full py-4 bg-[#15171F] border border-[#252733] text-white text-sm font-bold rounded-xl hover:bg-[#252733] transition-colors text-center">
                Choose Basic
              </Link>
            </div>

            {/* Premium Tier */}
            <div className="bg-gradient-to-b from-[#00C896]/10 to-[#1C1E28] border border-[#00C896]/50 p-8 rounded-3xl flex flex-col relative shadow-[0_0_40px_-10px_rgba(0,200,150,0.2)] transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00C896] text-[#0F1117] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                Recommended
              </div>
              <h3 className="text-xl font-black text-white mb-2">Premium</h3>
              <p className="text-[#737490] text-sm mb-6">Unlimited power for power users.</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-white">#25,000</span>
                <span className="text-[#737490]"> / year</span>
              </div>
              <div className="space-y-4 mb-8 flex-1">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00C896] shrink-0 mt-0.5" />
                  <p className="text-[#EEEEF5] text-sm"><strong className="text-white">Unlimited receipts</strong> generator.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00C896] shrink-0 mt-0.5" />
                  <p className="text-[#EEEEF5] text-sm"><strong className="text-white">Full App Access:</strong> Unlock Analytics, Items, Clients, and Spend tracking.</p>
                </div>
              </div>
              <Link href="/login" className="w-full py-4 bg-[#00C896] text-[#0F1117] text-sm font-black rounded-xl hover:bg-[#5EEAD4] transition-colors text-center shadow-[0_10px_20px_-5px_rgba(0,200,150,0.3)]">
                Upgrade to Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="relative z-10 py-24 px-6 bg-[#0F1117]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#1C1E28] to-[#0F1117] border border-[#252733] p-10 md:p-14 rounded-[40px] relative overflow-hidden">
            <Quote className="absolute top-8 right-8 w-24 h-24 text-[#252733] opacity-50" />
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
                <p className="text-[#737490] text-sm">Instagram Gadget Vendor</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="relative z-10 border-t border-[#252733]/60 bg-[#0F1117] py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-[#737490]">Everything you need to know about how Receipta works.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group bg-[#1C1E28] border border-[#252733] rounded-2xl open:bg-[#15171F] transition-colors">
                <summary className="flex items-center justify-between p-6 font-bold text-white cursor-pointer select-none">
                  {faq.question}
                  <ChevronDown className="w-5 h-5 text-[#737490] group-open:-rotate-180 transition-transform duration-300" />
                </summary>
                <div className="px-6 pb-6 text-[#737490] text-sm leading-relaxed border-t border-[#252733]/50 pt-4">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER SPACE */}
      <section className="relative z-10 border-t border-[#00C896]/15 bg-gradient-to-b from-[#047857]/5 to-[#0F1117] py-24 px-6">
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

          <div className="bg-[#1C1E28]/80 backdrop-blur-sm border border-[#00C896]/20 rounded-[32px] p-8 md:p-12 shadow-[0_0_60px_-15px_rgba(0,200,150,0.15)] grid md:grid-cols-[auto_1fr] gap-10 items-start">
            <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-5 md:w-44 shrink-0">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-[#00C896] to-[#047857] flex items-center justify-center text-white text-2xl font-black shadow-[0_10px_30px_-5px_rgba(0,200,150,0.4)] shrink-0">
                IM
              </div>
              <div>
                <p className="text-white font-black">IdanMagkk</p>
                <p className="text-[#737490] text-xs font-bold">MAGKK.TECK</p>
                <p className="text-[#00C896] text-xs font-bold mt-1">Founder, VELO</p>
              </div>
            </div>
            <div className="space-y-5">
              <p className="text-[#EEEEF5] leading-relaxed">
                I built Receipta because I saw too many hardworking vendors losing deals and facing disputes simply because their receipts looked unprofessional or couldn't be verified.
              </p>
              <p className="text-[#EEEEF5] leading-relaxed">
                My goal is simple: give every Nigerian vendor — whether you sell gadgets, fashion, food, or run an Instagram business — a tool that makes you look bigger, builds instant customer trust, and helps you run your business with clarity.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a href="https://x.com/IdanMagkk" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-[#15171F] border border-[#252733] flex items-center justify-center text-[#737490] font-black text-sm hover:bg-[#00C896] hover:text-[#0F1117] hover:border-[#00C896] transition-all">X</a>
                <a href="https://instagram.com/magkk_tigrr8" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-[#15171F] border border-[#252733] flex items-center justify-center text-[#737490] hover:bg-[#00C896] hover:text-[#0F1117] hover:border-[#00C896] transition-all"><Instagram className="w-4 h-4" /></a>
                <a href="https://github.com/magkkteck08" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-[#15171F] border border-[#252733] flex items-center justify-center text-[#737490] hover:bg-[#00C896] hover:text-[#0F1117] hover:border-[#00C896] transition-all"><Github className="w-4 h-4" /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="relative z-10 px-6 py-10 pb-20">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#00C896] to-[#047857] rounded-[40px] p-10 md:p-16 text-center relative overflow-hidden shadow-[0_0_60px_-15px_rgba(0,200,150,0.3)]">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-[#0F1117] mb-6 tracking-tight">Ready to look more professional?</h2>
            <p className="text-[#0F1117]/80 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10">
              Join the vendors using Receipta to build trust and eliminate payment disputes today.
            </p>
            <Link href="/login" className="inline-flex items-center px-8 py-4 bg-[#0F1117] text-white text-base font-black rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
              CREATE FREE ACCOUNT <ArrowRight className="w-5 h-5 ml-2 text-[#00C896]" />
            </Link>
          </div>
        </div>
      </section>

      {/* EXPANDED FOOTER */}
      <footer className="border-t border-[#252733] bg-[#0F1117] pt-16 pb-8 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00C896] to-[#047857] rounded-xl flex items-center justify-center">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black text-white tracking-tight">Receipta</span>
              </div>
              <p className="text-[#737490] text-sm leading-relaxed mb-6">
                The professional digital receipt generator built specifically to help modern vendors scale safely.
              </p>
              <a href="mailto:support@receipta.com" className="inline-flex items-center text-[#737490] hover:text-[#00C896] transition-colors text-sm font-bold">
                <Mail className="w-4 h-4 mr-2" /> support@receipta.com
              </a>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-xs">Product</h4>
              <ul className="space-y-4">
                <li><Link href="/login" className="text-[#737490] hover:text-[#00C896] transition-colors text-sm">Pricing</Link></li>
                <li><button onClick={() => setIsVerifyOpen(true)} className="text-[#737490] hover:text-[#00C896] transition-colors text-sm">Verify a Receipt</button></li>
                <li><Link href="/login" className="text-[#737490] hover:text-[#00C896] transition-colors text-sm">Create Account</Link></li>
                <li><Link href="/login" className="text-[#737490] hover:text-[#00C896] transition-colors text-sm">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-xs">Legal</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-[#737490] hover:text-white transition-colors text-sm">Terms of Service</Link></li>
                <li><Link href="#" className="text-[#737490] hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
                <li><Link href="#" className="text-[#737490] hover:text-white transition-colors text-sm">Refund Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-xs">Connect</h4>
              <ul className="space-y-4">
                <li><a href="https://x.com/IdanMagkk" target="_blank" rel="noopener noreferrer" className="text-[#737490] hover:text-[#00C896] transition-colors text-sm">Twitter (X)</a></li>
                <li><a href="https://instagram.com/magkk_tigrr8" target="_blank" rel="noopener noreferrer" className="text-[#737490] hover:text-[#00C896] transition-colors text-sm">Instagram</a></li>
                <li><a href="https://github.com/magkkteck08" target="_blank" rel="noopener noreferrer" className="text-[#737490] hover:text-[#00C896] transition-colors text-sm">Developer Github</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#252733] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#737490] text-xs font-bold uppercase tracking-widest">
              &copy; {new Date().getFullYear()} Receipta. All rights reserved.
            </p>
            <p className="text-[#737490] text-xs font-bold tracking-widest flex items-center">
              BUILT BY <span className="text-[#00C896] ml-1">VELO AGENCY</span>
            </p>
          </div>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* 🛡️ VERIFICATION MODAL OVERLAY */}
      {/* ======================================================== */}
      {isVerifyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1117]/90 backdrop-blur-sm transition-all">
          <div className="bg-[#1C1E28] border border-[#252733] w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-[#252733]">
              <div className="flex items-center gap-2 text-white">
                <ShieldCheck className="w-5 h-5 text-[#00C896]" />
                <h3 className="font-bold">Verification Portal</h3>
              </div>
              <button 
                onClick={() => {
                  setIsVerifyOpen(false);
                  setVerifyResult(null);
                  setVerifyCode('');
                }}
                className="text-[#737490] hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form onSubmit={handleVerifySubmit} className="flex gap-2 mb-8">
                <input 
                  type="text" 
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="Enter Receipt ID (e.g. RCP-12345)" 
                  className="w-full bg-[#15171F] border border-[#252733] text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#00C896] transition-colors placeholder:text-[#737490]"
                  required
                />
                <button 
                  type="submit" 
                  disabled={verifyLoading}
                  className="bg-[#00C896] text-[#0F1117] px-5 rounded-xl font-bold hover:bg-[#5EEAD4] transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  {verifyLoading ? <div className="w-5 h-5 border-2 border-[#0F1117] border-t-transparent rounded-full animate-spin"></div> : <Search className="w-5 h-5" />}
                </button>
              </form>

              {verifyLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <ShieldCheck className="w-12 h-12 text-[#00C896] animate-pulse mb-4" />
                  <p className="text-[#737490] font-bold tracking-widest text-xs uppercase animate-pulse">Scanning Database...</p>
                </div>
              )}

              {verifyResult === false && !verifyLoading && (
                <div className="bg-[#FB7185]/10 border border-[#FB7185]/30 rounded-2xl p-6 text-center">
                  <XCircle className="w-10 h-10 text-[#FB7185] mx-auto mb-3" />
                  <h4 className="text-white font-bold mb-2">Invalid Record</h4>
                  <p className="text-[#737490] text-sm leading-relaxed">
                    This verification code does not exist in our system. The receipt may be fraudulent or digitally altered.
                  </p>
                </div>
              )}

              {verifyResult && typeof verifyResult === 'object' && !verifyLoading && (
                <div className="animate-fadeUp">
                  <div className="flex flex-col items-center mb-6">
                    <div className="bg-[#00C896]/10 border border-[#00C896]/30 text-[#00C896] px-4 py-2 rounded-full flex items-center mb-2">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="font-black text-xs tracking-widest uppercase">Verified Authentic</span>
                    </div>
                  </div>

                  <div className="bg-[#15171F] border border-[#252733] rounded-2xl overflow-hidden">
                    <div className="bg-[#1C1E28]/50 border-b border-[#252733] p-5 text-center">
                       {verifyResult.businesses?.logo_url ? (
                         <img src={verifyResult.businesses.logo_url} alt="Logo" className="w-12 h-12 object-cover rounded-xl mx-auto mb-2 border border-[#252733]" />
                       ) : (
                         <div className="w-12 h-12 bg-gradient-to-br from-[#00C896] to-[#047857] rounded-xl flex items-center justify-center mx-auto mb-2">
                           <Store className="w-6 h-6 text-white" />
                         </div>
                       )}
                       <h2 className="text-lg font-black text-white">{verifyResult.businesses?.business_name}</h2>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="bg-[#1C1E28] border border-[#252733] p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center text-[#EEEEF5]">
                          <CreditCard className="w-4 h-4 mr-2 text-[#00C896]" />
                          <span className="text-xs font-bold uppercase tracking-wider">Total Paid</span>
                        </div>
                        <span className="text-lg font-black text-white">
                          {verifyResult.businesses?.currency || '₦'}{Number(verifyResult.grand_total).toLocaleString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#1C1E28] border border-[#252733] p-3 rounded-xl">
                          <p className="text-[#737490] text-[9px] uppercase font-bold tracking-widest mb-1 flex items-center"><Calendar className="w-3 h-3 mr-1"/> Date</p>
                          <p className="text-white text-xs font-bold">{getFormattedDate(verifyResult.created_at)}</p>
                        </div>
                        <div className="bg-[#1C1E28] border border-[#252733] p-3 rounded-xl">
                          <p className="text-[#737490] text-[9px] uppercase font-bold tracking-widest mb-1 flex items-center"><Receipt className="w-3 h-3 mr-1"/> Receipt No.</p>
                          <p className="text-white text-xs font-mono font-bold truncate">{verifyResult.receipt_number}</p>
                        </div>
                      </div>

                      <div className="bg-[#1C1E28] border border-[#252733] p-4 rounded-xl">
                        <p className="text-[#737490] text-[9px] uppercase font-bold tracking-widest mb-3 flex items-center"><ShoppingBag className="w-3 h-3 mr-1"/> Items</p>
                        <div className="space-y-2">
                          {verifyResult.receipt_items?.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-start border-b border-[#252733]/50 pb-2 last:border-0 last:pb-0">
                              <div>
                                <p className="text-white text-xs font-bold">{item.item_name}</p>
                                <p className="text-[#737490] text-[10px] mt-0.5">Qty: {item.quantity}</p>
                              </div>
                              <p className="text-white text-xs font-mono font-bold">
                                {verifyResult.businesses?.currency || '₦'}{Number(item.total_price).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
