'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star, ChevronDown, Instagram, Github, ArrowRight, Mail,
  ShieldCheck, X, Search, XCircle, CheckCircle, Store,
  CreditCard, Calendar, Receipt, ShoppingBag, Quote, Check,
  BarChart3, Zap
} from 'lucide-react';

export default function LandingPage() {
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyLoading(true);
    setTimeout(() => {
      setVerifyLoading(false);
      if (verifyCode.trim().toUpperCase() === 'RCP-12345') {
        setVerifyResult({
          receipt_number: 'RCP-12345',
          created_at: new Date().toISOString(),
          grand_total: 125000,
          businesses: { business_name: 'Premium Gadgets Hub', currency: '₦', logo_url: '' },
          receipt_items: [
            { id: 1, item_name: 'Wireless Noise-Cancelling Headphones', quantity: 1, total_price: 125000 }
          ]
        });
      } else {
        setVerifyResult(false);
      }
    }, 1500);
  };

  const getFormattedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const faqs = [
    {
      question: "How does Receipta make me look more professional?",
      answer: "Receipta generates sleek, branded digital receipts that look infinitely better than handwritten notes or WhatsApp messages. It gives your customers confidence that they are dealing with a legitimate, structured business."
    },
    {
      question: "How does the verification portal work?",
      answer: "Every receipt generated on our platform comes with a unique ID. Customers can enter this ID on our public verification portal to confirm the receipt wasn't forged or altered, completely eliminating payment disputes."
    },
    {
      question: "Can I use my own logo?",
      answer: "Yes! You can upload your brand logo, set your business colors, and customize the receipt templates to match your brand identity perfectly."
    },
    {
      question: "Is Receipta free to use?",
      answer: "We offer a generous free tier for new businesses. As you scale, you can upgrade to our Premium plan for unlimited receipts, expense tracking, and advanced analytics."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F1117] font-sans selection:bg-[#00C896]/30 selection:text-white">
      {/* Custom Keyframes for the Floating Receipt */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}} />

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F1117]/80 backdrop-blur-md border-b border-[#252733]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.png" alt="Receipta Logo" width={128} height={32} className="object-contain w-auto h-8" priority />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#pricing" className="text-sm font-bold text-[#737490] hover:text-white transition-colors">Pricing</Link>
            <button onClick={() => setIsVerifyOpen(true)} className="text-sm font-bold text-[#737490] hover:text-white transition-colors">Verify Receipt</button>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-sm font-bold text-[#737490] hover:text-white transition-colors">Sign In</Link>
            <Link href="/login" className="text-[#00C896] text-sm font-bold px-4 py-2 hover:text-[#5EEAD4] transition-colors flex items-center gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION (Split Layout) */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#00C896]/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left Text Area */}
          <div className="text-center lg:text-left pt-10 lg:pt-0">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00C896]/10 border border-[#00C896]/20 mb-8">
              <Zap className="w-4 h-4 text-[#00C896]" />
              <span className="text-xs font-bold text-[#00C896] tracking-widest uppercase">The New Standard for Vendors</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-[1.1]">
              Build Instant Trust With <span className="text-[#00C896]">Bank-Grade Receipts.</span>
            </h1>
            
            <p className="text-lg text-[#737490] mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Create, send, and verify beautiful digital receipts in seconds. Stop losing disputes and start looking like the premium business you are.
            </p>
            
            <div className="flex flex-col items-center lg:items-start gap-4">
              <Link href="/login" className="w-full sm:w-auto flex items-center justify-center px-10 py-4 bg-[#00C896] text-[#0F1117] text-sm md:text-base font-black rounded-xl hover:bg-[#5EEAD4] transition-all shadow-[0_0_30px_-5px_rgba(0,200,150,0.4)]">
                CREATE FREE ACCOUNT
              </Link>
              <Link href="/login" className="text-white font-bold text-sm hover:text-[#00C896] transition-colors mt-2">
                Login
              </Link>
            </div>
          </div>

          {/* Right Floating Receipt Mockup */}
          <div className="relative w-full max-w-md mx-auto lg:ml-auto lg:mr-0 mt-12 lg:mt-0">
            {/* The Floating Container */}
            <div className="animate-float relative z-10">
              <div className="bg-[#15171F] border border-[#252733] rounded-[2rem] p-8 shadow-2xl relative">
                
                {/* Verified Badge */}
                <div className="absolute -top-4 -right-4 bg-[#00C896] text-[#0F1117] text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg border border-[#00C896]/50">
                  <ShieldCheck className="w-4 h-4" /> Verified
                </div>
                
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-[#00C896]/10 rounded-xl flex items-center justify-center border border-[#00C896]/20">
                    <Store className="w-5 h-5 text-[#00C896]" />
                  </div>
                  <div>
                    <h3 className="text-white font-black tracking-widest text-sm">RECEIPTA</h3>
                    <p className="text-[#737490] text-[10px]">#RCP-2049</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-[#737490] text-[10px] uppercase font-bold tracking-widest mb-1">Lagos Tech Hub · Jun 23, 2026</p>
                </div>

                <div className="space-y-4 mb-6 border-y border-[#252733] py-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#EEEEF5] font-medium">Wireless Earbuds Pro</span>
                    <span className="text-white font-bold font-mono">₦24,500</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#EEEEF5] font-medium">Charging Cable (2m)</span>
                    <span className="text-white font-bold font-mono">₦3,200</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#EEEEF5] font-medium">Phone Case — Clear</span>
                    <span className="text-white font-bold font-mono">₦4,800</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-[#737490] text-xs font-black tracking-widest uppercase">Total</span>
                  <span className="text-[#00C896] text-2xl font-black font-mono">₦32,500</span>
                </div>

                <div className="flex justify-between items-end">
                  {/* Fake QR Grid */}
                  <div className="grid grid-cols-3 gap-1 opacity-50">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className={`w-2 h-2 ${i % 2 === 0 ? 'bg-[#00C896]' : 'bg-[#252733]'} rounded-sm`} />
                    ))}
                  </div>
                  <p className="text-[#737490] text-[9px] font-medium">Scan to verify</p>
                </div>
              </div>
            </div>
            
            {/* Soft Shadow below floating element */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-10 bg-black/50 blur-2xl rounded-full" />
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="relative z-10 py-24 px-6 bg-[#0F1117]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Everything you need to scale safely.</h2>
            <p className="text-[#737490] text-lg">Powerful tools designed specifically for modern African businesses.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#15171F] border border-[#252733] p-8 rounded-3xl hover:border-[#00C896]/50 transition-all group">
              <div className="w-12 h-12 bg-[#00C896]/10 border border-[#00C896]/20 rounded-xl flex items-center justify-center mb-6">
                <Receipt className="w-6 h-6 text-[#00C896]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Smart Invoicing</h3>
              <p className="text-[#737490] leading-relaxed text-sm">
                Generate beautiful, branded receipts in seconds. Download as HD images or send directly to customers via WhatsApp.
              </p>
            </div>
            
            <div className="bg-[#15171F] border border-[#252733] p-8 rounded-3xl hover:border-[#00C896]/50 transition-all group">
              <div className="w-12 h-12 bg-[#00C896]/10 border border-[#00C896]/20 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-[#00C896]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Sales Analytics</h3>
              <p className="text-[#737490] leading-relaxed text-sm">
                Track your revenue, log your expenses, and instantly see your net profit. Make smarter decisions with visual charts.
              </p>
            </div>
            
            <div className="bg-[#15171F] border border-[#252733] p-8 rounded-3xl hover:border-[#00C896]/50 transition-all group">
              <div className="w-12 h-12 bg-[#00C896]/10 border border-[#00C896]/20 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-[#00C896]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Anti-Fraud Verification</h3>
              <p className="text-[#737490] leading-relaxed text-sm">
                Every receipt gets a unique bank-grade ID. Customers can scan to verify authenticity on our public portal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING GRID */}
      <section id="pricing" className="relative z-10 py-24 px-6 bg-[#0F1117] border-t border-[#252733]/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Simple, transparent pricing.</h2>
            <p className="text-[#737490] text-lg">Remove all limits and show your customers you mean business.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
            
            {/* Free Tier */}
            <div className="bg-[#15171F] border border-[#252733] p-8 rounded-[2rem] flex flex-col h-full">
              <h3 className="text-xl font-bold text-white mb-2">Free</h3>
              <p className="text-[#737490] text-sm mb-6">Perfect for getting started.</p>
              <div className="text-4xl font-black text-white mb-8">₦0 <span className="text-sm text-[#737490] font-normal tracking-widest">/ forever</span></div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-center text-sm text-[#EEEEF5]"><CheckCircle className="w-4 h-4 text-[#00C896] mr-3 shrink-0" /> Up to 15 receipts total</li>
                <li className="flex items-center text-sm text-[#737490] opacity-50"><ShieldCheck className="w-4 h-4 mr-3 shrink-0" /> Dashboard access locked</li>
                <li className="flex items-center text-sm text-[#737490] opacity-50"><ShieldCheck className="w-4 h-4 mr-3 shrink-0" /> No Custom Branding</li>
              </ul>
              <Link href="/login" className="block w-full py-3.5 text-sm text-center bg-[#1C1E28] text-white font-bold rounded-xl border border-[#252733] hover:bg-[#252733] transition-colors">Start Free</Link>
            </div>

            {/* Basic Tier */}
            <div className="bg-[#15171F] border border-[#252733] p-8 rounded-[2rem] flex flex-col h-full">
              <h3 className="text-xl font-bold text-white mb-2">Basic</h3>
              <p className="text-[#737490] text-sm mb-6">For growing daily vendors.</p>
              <div className="text-4xl font-black text-white mb-8">₦1,800 <span className="text-sm text-[#737490] font-normal tracking-widest">/ mo</span></div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-center text-sm text-[#EEEEF5]"><CheckCircle className="w-4 h-4 text-[#00C896] mr-3 shrink-0" /> Up to 100 receipts per month</li>
                <li className="flex items-start text-sm text-[#EEEEF5]"><CheckCircle className="w-4 h-4 text-[#00C896] mr-3 shrink-0 mt-0.5" /> <span>Unlocked Dashboard: Access to basic stats and history.</span></li>
                <li className="flex items-center text-sm text-[#EEEEF5]"><CheckCircle className="w-4 h-4 text-[#00C896] mr-3 shrink-0" /> Custom Logo & Branding</li>
              </ul>
              <Link href="/login" className="block w-full py-3.5 text-sm text-center bg-[#1C1E28] text-white font-bold rounded-xl border border-[#252733] hover:bg-[#252733] transition-colors">Choose Basic</Link>
            </div>

            {/* Premium Tier */}
            <div className="bg-[#15171F] border border-[#00C896] p-8 rounded-[2rem] flex flex-col h-full relative shadow-[0_0_30px_rgba(0,200,150,0.1)] md:-translate-y-4">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00C896] text-[#0F1117] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Recommended</div>
              <h3 className="text-xl font-bold text-white mb-2">Premium</h3>
              <p className="text-[#737490] text-sm mb-6">Unlimited power for power users.</p>
              <div className="text-4xl font-black text-white mb-8">₦2,500 <span className="text-sm text-[#737490] font-normal tracking-widest">/ mo</span></div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-center text-sm text-[#EEEEF5]"><CheckCircle className="w-4 h-4 text-[#00C896] mr-3 shrink-0" /> Unlimited receipts generator.</li>
                <li className="flex items-start text-sm text-[#EEEEF5]"><CheckCircle className="w-4 h-4 text-[#00C896] mr-3 shrink-0 mt-0.5" /> <span>Full App Access: Unlock Analytics, Items, Clients, and Spend tracking.</span></li>
                <li className="flex items-center text-sm text-[#EEEEF5]"><CheckCircle className="w-4 h-4 text-[#00C896] mr-3 shrink-0" /> Priority WhatsApp Support</li>
              </ul>
              <Link href="/login" className="block w-full py-3.5 text-sm text-center bg-[#00C896] text-[#0F1117] font-black rounded-xl hover:bg-[#5EEAD4] transition-colors shadow-lg">Upgrade to Premium</Link>
            </div>

          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="relative z-10 py-24 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1C1E28]/50 border border-[#252733] rounded-[40px] p-10 md:p-16 relative">
            <Quote className="absolute top-8 right-10 w-20 h-20 text-[#252733] opacity-50 pointer-events-none" />
            
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
              <details key={index} className="group bg-[#15171F] border border-[#252733] rounded-2xl open:bg-[#1C1E28] transition-colors">
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
      <section className="relative z-10 border-t border-[#252733]/50 bg-gradient-to-b from-[#047857]/5 to-[#0F1117] py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00C896]/10 border border-[#00C896]/30 mb-6">
              <div className="w-2 h-2 bg-[#00C896] rounded-full animate-pulse" />
              <span className="text-xs font-bold tracking-[2px] text-[#00C896] uppercase">Founder Space</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-10">
              Built by a developer who understands <span className="text-[#00C896]">Nigerian vendors.</span>
            </h2>
          </div>

          <div className="bg-[#15171F] border border-[#252733] rounded-[32px] p-8 md:p-12 grid md:grid-cols-[auto_1fr] gap-10 items-start">
            <div className="flex flex-col items-center md:items-start gap-4 shrink-0">
              {/* Profile Box matching screenshot */}
              <div className="w-24 h-24 bg-[#00C896] rounded-3xl flex items-center justify-center shadow-[0_10px_30px_-5px_rgba(0,200,150,0.4)]">
                <span className="text-white text-3xl font-black tracking-widest">IM</span>
              </div>
              <div className="text-center md:text-left">
                <p className="text-white font-black">IdanMagkk</p>
                <p className="text-[#737490] text-xs font-bold tracking-widest uppercase mt-1">MAGKK.TECK</p>
                <p className="text-[#00C896] text-xs font-bold mt-1">Founder, VELO</p>
              </div>
            </div>
            <div className="space-y-6">
              <p className="text-[#EEEEF5] leading-relaxed text-sm md:text-base">
                I built Receipta because I saw too many hardworking vendors losing deals and facing disputes simply because their receipts looked unprofessional or couldn't be verified.
              </p>
              <p className="text-[#EEEEF5] leading-relaxed text-sm md:text-base">
                My goal is simple: give every Nigerian vendor — whether you sell gadgets, fashion, food, or run an Instagram business — a tool that makes you look bigger, builds instant customer trust, and helps you run your business with clarity.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a href="https://x.com/IdanMagkk" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-[#1C1E28] border border-[#252733] flex items-center justify-center text-[#737490] font-black text-sm hover:bg-[#00C896] hover:text-[#0F1117] hover:border-[#00C896] transition-all">X</a>
                <a href="https://instagram.com/magkk_tigrr8" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-[#1C1E28] border border-[#252733] flex items-center justify-center text-[#737490] hover:bg-[#00C896] hover:text-[#0F1117] hover:border-[#00C896] transition-all"><Instagram className="w-4 h-4" /></a>
                <a href="https://github.com/magkkteck08" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-[#1C1E28] border border-[#252733] flex items-center justify-center text-[#737490] hover:bg-[#00C896] hover:text-[#0F1117] hover:border-[#00C896] transition-all"><Github className="w-4 h-4" /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="relative z-10 px-6 py-10 pb-20">
        <div className="max-w-6xl mx-auto bg-[#00C896] rounded-[2rem] p-10 md:p-16 text-center relative overflow-hidden">
          <div className="relative z-10">
            <Link href="/login" className="inline-flex items-center px-8 py-4 bg-[#0F1117] text-white text-sm font-black rounded-xl hover:-translate-y-1 transition-all">
              CREATE FREE ACCOUNT <ArrowRight className="w-4 h-4 ml-2 text-[#00C896]" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0F1117] pt-16 pb-8 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <Link href="/" className="flex items-center">
                  <div className="w-8 h-8 bg-[#00C896] rounded flex items-center justify-center mr-2">
                    <Store className="w-4 h-4 text-[#0F1117]" />
                  </div>
                  <span className="text-white font-black text-xl">Receipta</span>
                </Link>
              </div>
              <p className="text-[#737490] text-sm leading-relaxed mb-6">
                The professional digital receipt generator built specifically to help modern vendors scale safely.
              </p>
              <a href="mailto:support@receipta.com" className="inline-flex items-center text-[#737490] hover:text-[#00C896] transition-colors text-sm font-bold">
                <Mail className="w-4 h-4 mr-2" /> support@magkk.receipta.com
              </a>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-xs">Product</h4>
              <ul className="space-y-4">
                <li><Link href="#pricing" className="text-[#737490] hover:text-[#00C896] transition-colors text-sm">Pricing</Link></li>
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
              &copy; {new Date().getFullYear()} RECEIPTA. ALL RIGHTS RESERVED.
            </p>
            <p className="text-[#00C896] text-xs font-black tracking-widest uppercase">
              BUILT BY VELO AGENCY
            </p>
          </div>
        </div>
      </footer>

      {/* VERIFICATION MODAL OVERLAY */}
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
  );
}