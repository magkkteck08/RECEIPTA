'use client'

import { useState } from 'react'
import { CheckCircle2, Crown, Zap, ShieldCheck } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createSubscriptionCheckout } from '@/app/actions/billing'

export default function UpgradePage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')

  return (
    <div className="min-h-full bg-[#0F1117] rounded-3xl border border-[#252733] shadow-2xl relative overflow-hidden pb-10 flex flex-col items-center p-6 font-sans">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#00C896] rounded-full blur-[250px] opacity-10 pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl w-full space-y-10 text-center mt-8">
        
        {/* Header */}
        <div>
          <div className="inline-flex items-center justify-center p-3 bg-[#00C896]/10 rounded-2xl mb-4 border border-[#00C896]/20 shadow-lg">
            <Crown className="w-8 h-8 text-[#00C896]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Level Up Your Business
          </h1>
          <p className="text-[#737490] text-base md:text-lg max-w-xl mx-auto">
            Remove all limits, unlock the smart CRM, and automate your workflow.
          </p>
        </div>

        {/* Monthly / Yearly Toggle */}
        <div className="flex items-center justify-center gap-4 bg-[#1C1E28] p-1.5 rounded-full w-fit mx-auto border border-[#252733]">
          <button 
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-[#252733] text-white shadow-md' : 'text-[#737490] hover:text-white'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-[#00C896] text-white shadow-[0_0_15px_rgba(0,200,150,0.3)]' : 'text-[#737490] hover:text-white'}`}
          >
            Yearly <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full">SAVE 20%</span>
          </button>
        </div>

        {/* Pricing Cards Container */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          
          {/* BASIC PLAN */}
          <Card className="bg-[#1C1E28] border-[#252733] shadow-xl relative overflow-hidden flex flex-col">
            <CardContent className="p-8 flex flex-col h-full">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Growing Business</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">
                    {billingCycle === 'yearly' ? '₦22,000' : '₦1,800'}
                  </span>
                  <span className="text-[#737490] font-medium">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
                </div>
              </div>

              <div className="space-y-4 flex-grow mb-8 border-t border-[#252733] pt-6">
                <FeatureItem text="Up to 100 Receipts / month" />
                <FeatureItem text="Up to 200 Customers & 100 Items" />
                <FeatureItem text="Upload Custom Logo & Signature" />
                <FeatureItem text="Remove Receipta Watermark" />
                <FeatureItem text="Unlock Expense Tracking" missing />
                <FeatureItem text="Advanced Analytics Dashboard" missing />
              </div>

              <form action={createSubscriptionCheckout} className="w-full mt-auto">
                <input type="hidden" name="plan" value="basic" />
                <input type="hidden" name="cycle" value={billingCycle} />
                <Button type="submit" variant="outline" className="w-full h-12 bg-[#15171F] border border-[#252733] text-white hover:bg-[#252733] font-bold rounded-xl transition-all">
                  START BASIC
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* PREMIUM PLAN */}
          <Card className="bg-[#1C1E28] border-[#00C896]/50 shadow-[0_0_30px_rgba(0,200,150,0.15)] relative overflow-hidden flex flex-col transform md:-translate-y-4">
            <div className="bg-gradient-to-r from-[#00C896] to-[#00A67C] py-1.5 px-6 text-center">
              <span className="text-white text-xs font-black tracking-widest uppercase">Most Popular</span>
            </div>
            
            <CardContent className="p-8 flex flex-col h-full">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-[#00C896] mb-2">Serious Business</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">
                    {billingCycle === 'yearly' ? '₦30,000' : '₦2,500'}
                  </span>
                  <span className="text-[#737490] font-medium">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
                </div>
              </div>

              <div className="space-y-4 flex-grow mb-8 border-t border-[#252733] pt-6">
                <FeatureItem text="Unlimited Digital Receipts" />
                <FeatureItem text="Unlimited Customers & Items" />
                <FeatureItem text="Upload Custom Logo & Signature" />
                <FeatureItem text="Unlock Sidebar App: Expenses" />
                <FeatureItem text="Advanced Analytics Dashboard" />
                <FeatureItem text="Priority WhatsApp Support" />
              </div>

              <form action={createSubscriptionCheckout} className="w-full mt-auto">
                <input type="hidden" name="plan" value="premium" />
                <input type="hidden" name="cycle" value={billingCycle} />
                <Button type="submit" className="w-full h-12 bg-gradient-to-r from-[#00C896] to-[#00A67C] hover:shadow-[0_0_20px_rgba(0,200,150,0.4)] text-white font-bold rounded-xl transition-all border-0 flex items-center justify-center">
                  <Zap className="w-5 h-5 mr-2" />
                  UPGRADE TO PREMIUM
                </Button>
              </form>
            </CardContent>
          </Card>

        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-[#737490] text-xs font-bold uppercase tracking-widest opacity-60">
          <ShieldCheck className="w-4 h-4" /> Secured Automated Billing via Bachs
        </div>

      </div>
    </div>
  )
}

function FeatureItem({ text, missing = false }: { text: string, missing?: boolean }) {
  return (
    <div className={`flex items-start gap-3 ${missing ? 'opacity-40' : ''}`}>
      <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${missing ? 'text-[#737490]' : 'text-[#00C896]'}`} />
      <p className="text-[#EEEEF5] text-sm font-medium">{text}</p>
    </div>
  )
}