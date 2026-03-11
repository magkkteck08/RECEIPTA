'use client'

import { CheckCircle2, Crown, ShieldCheck, Zap, ArrowRight, MessageCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function UpgradePage() {
  // Replace this with your actual WhatsApp number (include country code, no +)
  const whatsappNumber = "2348000000000" 
  const whatsappMessage = "Hello Receipta! I just paid ₦12,000 for the Premium Yearly Plan. Here is my payment receipt to upgrade my account:"
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <div className="min-h-full bg-[#0F1117] rounded-3xl border border-[#252733] shadow-2xl relative overflow-hidden pb-10 flex flex-col items-center justify-center p-6">
      
      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FF6B4A] rounded-full blur-[200px] opacity-10 pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl w-full space-y-8 text-center mt-8">
        
        {/* Header */}
        <div>
          <div className="inline-flex items-center justify-center p-3 bg-[#F4C542]/10 rounded-2xl mb-4 border border-[#F4C542]/20 shadow-lg">
            <Crown className="w-8 h-8 text-[#F4C542]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Level Up Your Business
          </h1>
          <p className="text-[#737490] text-base md:text-lg max-w-xl mx-auto">
            Remove all limits, unlock the smart CRM, and show your customers you mean business.
          </p>
        </div>

        {/* Pricing Card */}
        <Card className="bg-[#1C1E28] border-[#FF6B4A]/50 shadow-[0_0_50px_rgba(255,107,74,0.1)] overflow-hidden text-left relative">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-[#FF6B4A] to-[#E05535] py-2 px-6 text-center">
            <span className="text-white text-xs font-black tracking-widest uppercase">Premium Yearly Plan</span>
          </div>

          <CardContent className="p-8 md:p-10 flex flex-col md:flex-row gap-10 items-center">
            
            {/* Left Side: Price & Features */}
            <div className="flex-1 space-y-6 w-full">
              <div>
                <span className="text-5xl font-black text-white">₦12,000</span>
                <span className="text-[#737490] font-medium ml-2">/ year</span>
                <p className="text-xs text-[#FF6B4A] font-bold mt-2 bg-[#FF6B4A]/10 w-fit px-3 py-1 rounded-full border border-[#FF6B4A]/20">
                  Just ₦1,000 per month!
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#252733]">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#34D399] shrink-0 mt-0.5" />
                  <p className="text-[#EEEEF5] text-sm"><b>Unlimited Receipts:</b> Never worry about monthly limits again.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#34D399] shrink-0 mt-0.5" />
                  <p className="text-[#EEEEF5] text-sm"><b>Smart CRM Directory:</b> Auto-save and track every customer.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#34D399] shrink-0 mt-0.5" />
                  <p className="text-[#EEEEF5] text-sm"><b>Gadget Mode Unlocked:</b> Full access to IMEI & Serial tracking.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#34D399] shrink-0 mt-0.5" />
                  <p className="text-[#EEEEF5] text-sm"><b>Priority Support:</b> Direct line to the Receipta admin team.</p>
                </div>
              </div>
            </div>

            {/* Right Side: Payment Instructions */}
            <div className="flex-1 w-full bg-[#15171F] p-6 rounded-2xl border border-[#252733] text-center">
              <ShieldCheck className="w-8 h-8 text-[#737490] mx-auto mb-3" />
              <h3 className="text-white font-bold mb-2">How to Upgrade</h3>
              
              {/* Bank Details */}
              <div className="bg-[#0F1117] p-4 rounded-xl border border-[#252733] mb-4 text-left">
                <p className="text-xs text-[#737490] uppercase tracking-wider mb-1">Pay To:</p>
                <p className="text-white font-bold text-lg tracking-widest">9073754047</p>
                <p className="text-[#EEEEF5] text-sm mt-1">Receipta Technologies</p>
                <p className="text-[#737490] text-xs mt-0.5">PayCom</p>
              </div>

              <p className="text-[11px] text-[#737490] mb-4 leading-relaxed">
                Make your ₦12,000 transfer to the account above, then click the button below to send your proof of payment on WhatsApp for instant activation.
              </p>

              <a href={waLink} target="_blank" rel="noopener noreferrer" className="block w-full">
                <Button className="w-full h-12 bg-[#25D366] hover:bg-[#1DA851] text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  I'VE PAID - ACTIVATE ME
                </Button>
              </a>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  )
}