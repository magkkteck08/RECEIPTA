'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'react-hot-toast'
import { Store, MapPin, Phone, Globe, ArrowRight, TicketPercent, ShieldCheck } from 'lucide-react'

export default function SetupPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    business_name: '',
    street_address: '',
    city: '',
    business_phone: '',
    currency: '₦',
    promo_code: '' 
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    // 🚀 THE FIX: Changed 'business_phone' to 'phone' to match your database!
    const { error } = await supabase
      .from('businesses')
      .insert([
        { 
          business_name: formData.business_name,
          full_name: formData.business_name, 
          street_address: formData.street_address,
          city: formData.city,
          phone: formData.business_phone, // <-- FIXED HERE
          currency: formData.currency,
          user_id: user.id,
          subscription_tier: 'free'
        }
      ])

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Welcome to Receipta! 🚀")
      router.refresh()
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0F1117] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Premium Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF6B4A] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-[#1C1E28] border border-[#252733] rounded-3xl p-8 shadow-2xl shadow-black/50">
          
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-40 h-16 mb-6">
                
  {/* We use standard img here for a quick drop-in, or you can import Image from next/image */}
  <img 
    src="/logo.png" 
    alt="Receipta Logo" 
    className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,107,74,0.3)]" 
  />
</div>
<h1 className="text-xl font-black text-white tracking-tight text-center uppercase">Initialize Business</h1>
            <p className="text-[#737490] text-sm mt-1 text-center font-medium">Create your professional profile to start issuing verified receipts.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Business Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#EEEEF5] uppercase tracking-widest ml-1 opacity-70">Business Name</label>
              <div className="relative">
                <Store className="absolute left-4 top-3.5 w-5 h-5 text-[#737490]" />
                <input 
                  required
                  className="w-full h-12 bg-[#15171F] border border-[#252733] rounded-xl pl-12 pr-4 text-white focus:outline-none focus:border-[#FF6B4A] transition-all font-bold placeholder:text-[#3A3C4D] placeholder:font-normal"
                  placeholder="e.g. Gadget Bobo Tech"
                  onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#EEEEF5] uppercase tracking-widest ml-1 opacity-70">Support Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 w-5 h-5 text-[#737490]" />
                <input 
                  required
                  className="w-full h-12 bg-[#15171F] border border-[#252733] rounded-xl pl-12 pr-4 text-white focus:outline-none focus:border-[#FF6B4A] transition-all font-bold placeholder:text-[#3A3C4D] placeholder:font-normal"
                  placeholder="+234 801 234 5678"
                  onChange={(e) => setFormData({...formData, business_phone: e.target.value})}
                />
              </div>
            </div>

            {/* City & Currency Row */}
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#EEEEF5] uppercase tracking-widest ml-1 opacity-70">City</label>
                  <input 
                    required
                    className="w-full h-12 bg-[#15171F] border border-[#252733] rounded-xl px-4 text-white focus:outline-none focus:border-[#FF6B4A] transition-all font-bold placeholder:text-[#3A3C4D]"
                    placeholder="Ikeja"
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#EEEEF5] uppercase tracking-widest ml-1 opacity-70">Currency</label>
                  <input 
                    required
                    className="w-full h-12 bg-[#15171F] border border-[#252733] rounded-xl px-4 text-white focus:outline-none focus:border-[#FF6B4A] transition-all font-black text-center"
                    placeholder="₦"
                    defaultValue="₦"
                    maxLength={1}
                    onChange={(e) => setFormData({...formData, currency: e.target.value})}
                  />
               </div>
            </div>

            {/* ✨ PROMO CODE / REFERRAL FIELD */}
            <div className="pt-2">
              <div className="bg-[#15171F] border border-dashed border-[#252733] rounded-2xl p-4">
                <label className="flex items-center text-[10px] font-black text-[#F4C542] uppercase tracking-widest mb-2">
                  <TicketPercent className="w-3.5 h-3.5 mr-1.5" /> Have a Promo Code?
                </label>
                <input 
                  className="w-full h-10 bg-transparent border-b border-[#252733] text-white focus:outline-none focus:border-[#F4C542] transition-all text-xs font-mono uppercase"
                  placeholder="Optional (BETA-REWARD)"
                  onChange={(e) => setFormData({...formData, promo_code: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 bg-gradient-to-r from-[#FF6B4A] to-[#E05535] text-white font-black rounded-xl mt-6 hover:opacity-90 transition-all flex items-center justify-center group shadow-lg shadow-[#FF6B4A]/20"
            >
              {loading ? 'INITIALIZING...' : 'FINISH SETUP'}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-[#737490] uppercase tracking-widest pt-4 opacity-50">
              <ShieldCheck className="w-4 h-4" /> Secure Business Onboarding
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}