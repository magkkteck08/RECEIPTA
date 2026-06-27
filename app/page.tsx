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
  const [verifyResult, setVerifyResult] = useState<any>(null) // null = not searched, false = invalid, object = valid data

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
    <div className="min-h-screen bg-[#07090F] text-[#EAF1EE] font-sans selection:bg-[#00C896] selection:text-[#07090F] overflow-hidden relative">

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

          {/* ACTION AREA */}
          <div className="fade-up w-full max-w-md mb-12" style={{ animationDelay: '0.15s' }}>
            <div className="flex flex-col gap-3 mb-4">
              <Link href="/login" className="w-full px-8 py-4 bg-[#00C896] text-[#07090F] text-base font-black rounded-2xl shadow-[0_0_30px_rgba(0,200,150,0.3)] hover:shadow-[0_0_40px_rgba(0,200,150,0.5)] transition-all flex items-center justify-center hover:-translate-y-1">
                CREATE FREE ACCOUNT
              </Link>
              
              <button className="w-full px-8 py-4 bg-[#11141B] border border-[#232838] text-white text-base font-bold rounded-2xl hover:bg-[#161B24] hover:border-[#5C6478] transition-all flex items-center justify-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"/>
                  <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"/>
                  <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"/>
                  <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"/>
                </svg>
                Continue with Google
              </button>
            </div>

            {/* OPEN MODAL BUTTON */}
            <button 
              onClick={() => setIsVerifyOpen(true)}
              className="w-full px-8 py-4 bg-transparent border border-[#232838] text-[#8B92A6] text-sm font-bold rounded-2xl hover:bg-[#11141B] hover:text-white transition-all flex items-center justify-center"
            >
              <ShieldCheck className="w-4 h-4 mr-2 text-[#00C896]" /> Verify a Receipt Securely
            </button>
          </div>

          <div className="fade-up flex flex-wrap items-center gap-6 text-[#8B92A6] text-sm font-bold" style={{ animationDelay: '0.2s' }}>
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-[#00C896]" /> Free forever plan</span>
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-[#00C896]" /> Anti-fraud QR codes</span>
          </div>
        </div>

        {/* Right: floating receipt cluster */}
        <div className="relative w-full max-w-sm mx-auto h-[440px] lg:h-[480px]">
          <div className="float-ghost absolute top-6 left-4 right-4 bottom-10 bg-[#161B24] border border-[#1E2430] rounded-3xl shadow-2xl" />
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
          <div className="stamp-pop absolute -top-4 -right-3 bg-[#00C896] text-[#07090F] text-[10px] font-black px-3 py-1.5 rounded-full shadow-[0_10px_30px_-5px_rgba(0,200,150,0.6)] flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> VERIFIED
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

      {/* PRICING SECTION */}
      <section className="relative z-10 border-t border-[#1E2430]/60 bg-[#07090F] pt-24 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00C896]/10 border border-[#00C896]/30 mb-6">
              <Crown className="w-4 h-4 text-[#00C896]" />
              <span className="text-xs font-bold tracking-[2px] text-[#00C896] uppercase">Level Up Your Business</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Simple, transparent pricing.</h2>
            <p className="text-[#A8AFC0]">Remove all limits and show your customers you mean business.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <div className="bg-[#11141B] border border-[#232838] p-8 rounded-3xl flex flex-col">
              <h3 className="text-xl font-black text-white mb-2">Free</h3>
              <p className="text-[#8B92A6] text-sm mb-6">Perfect for getting started.</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-white">₦0</span>
                <span className="text-[#8B92A6]"> / forever</span>
              </div>
              <div className="space-y-4 mb-8 flex-1">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00C896] shrink-0 mt-0.5" />
                  <p className="text-[#A8AFC0] text-sm">Up to <strong className="text-white">5 receipts</strong> per month.</p>
                </div>
                <div className="flex items-start gap-3 opacity-60">
                  <Lock className="w-5 h-5 text-[#5C6478] shrink-0 mt-0.5" />
                  <p className="text-[#8B92A6] text-sm">Dashboard access locked.</p>
                </div>
              </div>
              <Link href="/login" className="w-full py-4 bg-[#161B24] border border-[#232838] text-white text-sm font-bold rounded-xl hover:bg-[#1E2430] transition-colors text-center">
                Start Free
              </Link>
            </div>

            {/* Basic Tier */}
            <div className="bg-[#11141B] border border-[#232838] p-8 rounded-3xl flex flex-col">
              <h3 className="text-xl font-black text-white mb-2">Basic</h3>
              <p className="text-[#8B92A6] text-sm mb-6">For growing daily vendors.</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-white">₦1,000</span>
                <span className="text-[#8B92A6]"> / month</span>
              </div>
              <div className="space-y-4 mb-8 flex-1">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00C896] shrink-0 mt-0.5" />
                  <p className="text-[#A8AFC0] text-sm">Up to <strong className="text-white">20 receipts</strong> per month.</p>
                </div>
                <div className="flex items-start gap-3">
                  <Unlock className="w-5 h-5 text-[#00C896] shrink-0 mt-0.5" />
                  <p className="text-[#A8AFC0] text-sm"><strong className="text-white">Unlocked Dashboard:</strong> Access to basic stats and history.</p>
                </div>
              </div>
              <Link href="/login" className="w-full py-4 bg-[#161B24] border border-[#232838] text-white text-sm font-bold rounded-xl hover:bg-[#1E2430] transition-colors text-center">
                Choose Basic
              </Link>
            </div>

            {/* Premium Tier */}
            <div className="bg-gradient-to-b from-[#00C896]/10 to-[#11141B] border border-[#00C896]/50 p-8 rounded-3xl flex flex-col relative shadow-[0_0_40px_-10px_rgba(0,200,150,0.2)] transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00C896] text-[#07090F] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                Recommended
              </div>
              <h3 className="text-xl font-black text-white mb-2">Premium</h3>
              <p className="text-[#8B92A6] text-sm mb-6">Unlimited power for power users.</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-white">₦12,000</span>
                <span className="text-[#8B92A6]"> / year</span>
              </div>
              <div className="space-y-4 mb-8 flex-1">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00C896] shrink-0 mt-0.5" />
                  <p className="text-[#A8AFC0] text-sm"><strong className="text-white">Unlimited receipts</strong> generator.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00C896] shrink-0 mt-0.5" />
                  <p className="text-[#A8AFC0] text-sm"><strong className="text-white">Full App Access:</strong> Unlock Analytics, Items, Clients, and Spend tracking.</p>
                </div>
              </div>
              <Link href="/login" className="w-full py-4 bg-[#00C896] text-[#07090F] text-sm font-black rounded-xl hover:bg-[#5EEAD4] transition-colors text-center shadow-[0_10px_20px_-5px_rgba(0,200,150,0.3)]">
                Upgrade to Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1E2430] bg-[#07090F] pt-16 pb-8 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="border-t border-[#1E2430] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#5C6478] text-xs font-bold uppercase tracking-widest">
              &copy; {new Date().getFullYear()} Receipta. All rights reserved.
            </p>
            <p className="text-[#5C6478] text-xs font-bold tracking-widest flex items-center">
              BUILT BY <span className="text-[#00C896] ml-1">VELO AGENCY</span>
            </p>
          </div>
        </div>
      </footer>


      {/* ======================================================== */}
      {/* 🛡️ VERIFICATION MODAL OVERLAY */}
      {/* ======================================================== */}
      {isVerifyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07090F]/90 backdrop-blur-sm transition-all">
          
          <div className="bg-[#11141B] border border-[#232838] w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#232838]">
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
                className="text-[#8B92A6] hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              
              {/* Search Form */}
              <form onSubmit={handleVerifySubmit} className="flex gap-2 mb-8">
                <input 
                  type="text" 
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="Enter Receipt ID (e.g. RCP-12345)" 
                  className="w-full bg-[#161B24] border border-[#232838] text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#00C896] transition-colors placeholder:text-[#5C6478]"
                  required
                />
                <button 
                  type="submit" 
                  disabled={verifyLoading}
                  className="bg-[#00C896] text-[#07090F] px-5 rounded-xl font-bold hover:bg-[#5EEAD4] transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  {verifyLoading ? <div className="w-5 h-5 border-2 border-[#07090F] border-t-transparent rounded-full animate-spin"></div> : <Search className="w-5 h-5" />}
                </button>
              </form>

              {/* STATES */}
              {verifyLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <ShieldCheck className="w-12 h-12 text-[#00C896] animate-pulse mb-4" />
                  <p className="text-[#8B92A6] font-bold tracking-widest text-xs uppercase animate-pulse">Scanning Database...</p>
                </div>
              )}

              {/* Invalid Result */}
              {verifyResult === false && !verifyLoading && (
                <div className="bg-[#FB7185]/10 border border-[#FB7185]/30 rounded-2xl p-6 text-center">
                  <XCircle className="w-10 h-10 text-[#FB7185] mx-auto mb-3" />
                  <h4 className="text-white font-bold mb-2">Invalid Record</h4>
                  <p className="text-[#8B92A6] text-sm leading-relaxed">
                    This verification code does not exist in our system. The receipt may be fraudulent or digitally altered.
                  </p>
                </div>
              )}

              {/* Valid Result */}
              {verifyResult && typeof verifyResult === 'object' && !verifyLoading && (
                <div className="animate-fadeUp">
                  
                  <div className="flex flex-col items-center mb-6">
                    <div className="bg-[#00C896]/10 border border-[#00C896]/30 text-[#00C896] px-4 py-2 rounded-full flex items-center mb-2">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="font-black text-xs tracking-widest uppercase">Verified Authentic</span>
                    </div>
                  </div>

                  <div className="bg-[#161B24] border border-[#232838] rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#1E2430]/50 border-b border-[#232838] p-5 text-center">
                       {verifyResult.businesses?.logo_url ? (
                         <img src={verifyResult.businesses.logo_url} alt="Logo" className="w-12 h-12 object-cover rounded-xl mx-auto mb-2 border border-[#232838]" />
                       ) : (
                         <div className="w-12 h-12 bg-gradient-to-br from-[#00C896] to-[#047857] rounded-xl flex items-center justify-center mx-auto mb-2">
                           <Store className="w-6 h-6 text-white" />
                         </div>
                       )}
                       <h2 className="text-lg font-black text-white">{verifyResult.businesses?.business_name}</h2>
                    </div>

                    {/* Core Details */}
                    <div className="p-5 space-y-3">
                      <div className="bg-[#11141B] border border-[#232838] p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center text-[#A8AFC0]">
                          <CreditCard className="w-4 h-4 mr-2 text-[#00C896]" />
                          <span className="text-xs font-bold uppercase tracking-wider">Total Paid</span>
                        </div>
                        <span className="text-lg font-black text-white">
                          {verifyResult.businesses?.currency || '₦'}{Number(verifyResult.grand_total).toLocaleString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#11141B] border border-[#232838] p-3 rounded-xl">
                          <p className="text-[#5C6478] text-[9px] uppercase font-bold tracking-widest mb-1 flex items-center"><Calendar className="w-3 h-3 mr-1"/> Date</p>
                          <p className="text-white text-xs font-bold">{getFormattedDate(verifyResult.created_at)}</p>
                        </div>
                        <div className="bg-[#11141B] border border-[#232838] p-3 rounded-xl">
                          <p className="text-[#5C6478] text-[9px] uppercase font-bold tracking-widest mb-1 flex items-center"><Receipt className="w-3 h-3 mr-1"/> Receipt No.</p>
                          <p className="text-white text-xs font-mono font-bold truncate">{verifyResult.receipt_number}</p>
                        </div>
                      </div>

                      <div className="bg-[#11141B] border border-[#232838] p-4 rounded-xl">
                        <p className="text-[#5C6478] text-[9px] uppercase font-bold tracking-widest mb-3 flex items-center"><ShoppingBag className="w-3 h-3 mr-1"/> Items</p>
                        <div className="space-y-2">
                          {verifyResult.receipt_items?.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-start border-b border-[#232838]/50 pb-2 last:border-0 last:pb-0">
                              <div>
                                <p className="text-white text-xs font-bold">{item.item_name}</p>
                                <p className="text-[#8B92A6] text-[10px] mt-0.5">Qty: {item.quantity}</p>
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
