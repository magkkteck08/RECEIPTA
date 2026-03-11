'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'react-hot-toast'
import { Save, Store, Receipt, Palette, MessageSquare, MapPin, Crown, Wallet, CheckCircle2, Copy, Tag, MessageCircle } from 'lucide-react'

// Shadcn UI Imports
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [business, setBusiness] = useState<any>(null)

  // Promo Code State
  const [promoCode, setPromoCode] = useState('')
  const [savingPromo, setSavingPromo] = useState(false)

  useEffect(() => {
    async function loadSettings() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('businesses').select('*').eq('user_id', user.id).single()
        if (data) {
          setBusiness(data)
          if (data.promo_code) setPromoCode(data.promo_code)
        }
      }
      setLoading(false)
    }
    loadSettings()
  }, [])

  // Save Promo Code independently from the rest of the form
  async function handleSavePromo() {
    if (!promoCode.trim()) return toast.error("Please enter a valid code")
    setSavingPromo(true)
    
    const cleanCode = promoCode.toLowerCase().trim()

    try {
      const { error } = await supabase
        .from('businesses')
        .update({ promo_code: cleanCode })
        .eq('id', business.id)

      if (error) throw error
      
      toast.success('Promo Code Applied! 🎟️', { style: { background: '#1C1E28', color: '#FF6B4A', border: '1px solid #252733' } })
      setBusiness({ ...business, promo_code: cleanCode }) // Update local state
    } catch (error: any) {
      toast.error("Failed to apply promo code.")
    } finally {
      setSavingPromo(false)
    }
  }

  // Copy Bank Account Number
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Account number copied!', { style: { background: '#1C1E28', color: '#EEEEF5', border: '1px solid #252733' } })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    const formData = new FormData(event.currentTarget)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      let signatureUrl = business?.signature_url
      let logoUrl = business?.logo_url

      // 1. Handle Signature Upload
      const signatureFile = formData.get('signature') as File
      if (signatureFile && signatureFile.size > 0) {
        const fileExt = signatureFile.name.split('.').pop()
        const fileName = `sig-${user.id}-${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage.from('logos').upload(fileName, signatureFile)
        if (uploadError) throw uploadError
        const { data: publicUrlData } = supabase.storage.from('logos').getPublicUrl(fileName)
        signatureUrl = publicUrlData.publicUrl
      }

      // 2. Handle Logo Update Upload
      const logoFile = formData.get('logo') as File
      if (logoFile && logoFile.size > 0) {
        const fileExt = logoFile.name.split('.').pop()
        const fileName = `logo-${user.id}-${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage.from('logos').upload(fileName, logoFile)
        if (uploadError) throw uploadError
        const { data: publicUrlData } = supabase.storage.from('logos').getPublicUrl(fileName)
        logoUrl = publicUrlData.publicUrl
      }

      // 3. The Master Payload
      const updates = {
        business_name: formData.get('business_name'),
        business_category: formData.get('business_category'),
        business_phone: formData.get('business_phone'),
        business_email: formData.get('business_email'),
        cac_reg_no: formData.get('cac_reg_no'),
        logo_url: logoUrl,
        
        street_address: formData.get('street_address'),
        city: formData.get('city'),
        state_region: formData.get('state_region'),
        country: formData.get('country'),
        
        currency: formData.get('currency'),
        receipt_prefix: formData.get('receipt_prefix') || 'RCP',
        receipt_start_number: Number(formData.get('receipt_start_number')) || 1000,
        default_tax: Number(formData.get('default_tax')) || 0,
        default_discount: Number(formData.get('default_discount')) || 0,
        default_warranty_days: Number(formData.get('default_warranty_days')) || 0,
        
        brand_primary_color: formData.get('brand_primary_color'),
        receipt_template: formData.get('receipt_template'),
        font_style: formData.get('font_style'),
        website_social_link: formData.get('website_social_link'),
        signature_url: signatureUrl,
        show_logo: formData.get('show_logo') === 'on',
        show_qr: formData.get('show_qr') === 'on',
        
        footer_message: formData.get('footer_message'),
        warranty_policy: formData.get('warranty_policy'),
        return_policy: formData.get('return_policy'),
        custom_disclaimer: formData.get('custom_disclaimer'),
        whatsapp_number: formData.get('whatsapp_number'),
      }

      const { error } = await supabase.from('businesses').update(updates).eq('user_id', user.id)
      if (error) throw error
      
      toast.success('System parameters locked in! 🔒', { 
        style: { background: '#1C1E28', color: '#FF6B4A', border: '1px solid #252733' } 
      })
      
      setBusiness({ ...business, ...updates })

    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-[#FF6B4A] animate-pulse font-bold tracking-widest text-sm flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-[#FF6B4A] border-t-transparent rounded-full animate-spin mb-4"></div>
        INITIALIZING SECURE TERMINAL...
      </div>
    </div>
  )

  const isPremium = business?.subscription_tier === 'premium'

  const CustomSelect = ({ name, defaultValue, options }: any) => (
    <select name={name} defaultValue={defaultValue} className="flex h-10 w-full rounded-md border border-[#252733] bg-[#15171F] px-3 py-2 text-sm text-[#EEEEF5] ring-offset-background appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B4A] transition-all">
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  )

  const CustomTextarea = ({ name, defaultValue, placeholder }: any) => (
    <textarea name={name} defaultValue={defaultValue} placeholder={placeholder} className="flex min-h-[80px] w-full rounded-md border border-[#252733] bg-[#15171F] px-3 py-2 text-sm text-[#EEEEF5] ring-offset-background placeholder:text-[#737490] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B4A] transition-all" />
  )

  const inputTheme = "bg-[#15171F] border-[#252733] text-[#EEEEF5] placeholder:text-[#737490] focus-visible:ring-[#FF6B4A] focus-visible:border-[#FF6B4A]"
  const labelTheme = "text-[11px] font-bold text-[#EEEEF5] uppercase tracking-wider"

  return (
    <div className="min-h-full bg-[#0F1117] rounded-3xl border border-[#252733] relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF6B4A] rounded-full blur-[150px] opacity-5 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#A78BFA] rounded-full blur-[150px] opacity-5 pointer-events-none"></div>

      <div className="relative z-10 p-4 md:p-8 max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#252733] pb-6">
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#EEEEF5] tracking-tight">System Settings</h1>
            <p className="text-[#737490] mt-1 text-sm">Manage your receipt parameters, billing, and features.</p>
          </div>
        </div>

        {/* 👑 BILLING & PROMO SECTION (Phase 3) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* CURRENT PLAN CARD */}
          <Card className={`border-2 shadow-2xl overflow-hidden ${isPremium ? 'bg-[#15171F] border-[#F4C542]' : 'bg-[#1C1E28] border-[#252733]'}`}>
            <CardHeader className={`${isPremium ? 'bg-[#F4C542]/10' : 'bg-[#15171F]'} border-b border-[#252733] pb-4`}>
              <CardTitle className="flex items-center text-white text-xl">
                {isPremium ? (
                  <><Crown className="w-6 h-6 text-[#F4C542] mr-3" /> Premium Plan Active</>
                ) : (
                  <><Wallet className="w-6 h-6 text-[#FF6B4A] mr-3" /> Free Tier</>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isPremium ? (
                <div className="space-y-4">
                  <p className="text-[#EEEEF5] leading-relaxed">
                    You have full, unlimited access to Receipta. Your customer CRM is unlocked and you can generate unlimited receipts.
                  </p>
                  <div className="flex items-center text-[#34D399] font-bold text-sm bg-[#34D399]/10 p-3 rounded-lg w-fit">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Unlimited Receipts
                  </div>
                  <div className="flex items-center text-[#34D399] font-bold text-sm bg-[#34D399]/10 p-3 rounded-lg w-fit">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Smart CRM Directory Unlocked
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[#737490] text-sm font-bold uppercase tracking-wider mb-1">Upgrade to Premium</p>
                        <p className="text-4xl font-black text-white">₦12,000 <span className="text-lg text-[#737490] font-medium">/ year</span></p>
                     </div>
                  </div>

                  <div className="space-y-3 border-t border-[#252733] pt-6">
                     <p className="text-[#EEEEF5] font-bold mb-4">How to activate your account:</p>
                     
                     <div className="bg-[#15171F] border border-[#252733] rounded-xl p-4 flex justify-between items-center">
                        <div>
                           <p className="text-[#737490] text-xs uppercase tracking-wider font-bold mb-1">Bank Name</p>
                           <p className="text-white font-medium">PayCom </p>
                        </div>
                     </div>

                     <div className="bg-[#15171F] border border-[#252733] rounded-xl p-4 flex justify-between items-center">
                        <div>
                           <p className="text-[#737490] text-xs uppercase tracking-wider font-bold mb-1">Account Number</p>
                           <p className="text-[#FF6B4A] font-black text-xl tracking-widest">9073754047</p>
                           <p className="text-[#EEEEF5] text-sm mt-1">Account Name: Ayolola Muiz</p>
                        </div>
                        <Button type="button" variant="outline" onClick={() => copyToClipboard('9073754047')} className="border-[#252733] text-[#EEEEF5] hover:bg-[#252733]">
                           <Copy className="w-4 h-4" />
                        </Button>
                     </div>

                     <div className="pt-4">
                       <a href="https://wa.me/2349073754047" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-12 bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/30 hover:bg-[#34D399]/20 font-bold rounded-xl transition-all">
                         <MessageCircle className="w-5 h-5 mr-2" />
                         I'VE PAID — SEND RECEIPT ON WHATSAPP
                       </a>
                     </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AMBASSADOR / PROMO CODE CARD */}
          <Card className="bg-[#1C1E28] border-[#252733] shadow-xl overflow-hidden h-fit">
            <CardHeader className="bg-[#15171F] border-b border-[#252733] pb-4">
              <CardTitle className="flex items-center text-white text-lg">
                <Tag className="w-5 h-5 text-[#60A5FA] mr-3" />
                Ambassador Promo Code
              </CardTitle>
              <CardDescription className="text-[#737490] mt-2">
                Were you referred by an ambassador? Enter their code here.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold text-[#EEEEF5] uppercase tracking-wider block">Promo Code</Label>
                  <Input 
                    placeholder="e.g. gadget-bobo or idan-magkk" 
                    className={inputTheme} 
                    value={promoCode} 
                    onChange={(e) => setPromoCode(e.target.value)} 
                    disabled={!!business?.promo_code && business.promo_code.length > 0} 
                  />
                </div>
                
                {!business?.promo_code ? (
                  // IMPORTANT: type="button" prevents it from submitting the main settings form!
                  <Button type="button" onClick={handleSavePromo} disabled={savingPromo || !promoCode} className="w-full h-11 bg-gradient-to-r from-[#FF6B4A] to-[#E05535] text-white hover:opacity-90 font-bold rounded-xl transition-all">
                    {savingPromo ? 'APPLYING...' : 'APPLY CODE'}
                  </Button>
                ) : (
                  <div className="flex items-center text-[#34D399] font-bold text-sm bg-[#34D399]/10 p-3 rounded-lg border border-[#34D399]/20">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Code Applied: {business.promo_code.toUpperCase()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 🛠️ MAIN SETTINGS FORM */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="flex justify-end pb-4 border-b border-[#252733]">
            <Button type="submit" disabled={saving} className="bg-gradient-to-r from-[#FF6B4A] to-[#E05535] text-[#0F1117] hover:from-[#E05535] hover:to-[#10B981] font-bold shadow-[0_0_20px_rgba(255,107,74,0.2)] hover:shadow-[0_0_25px_rgba(255,107,74,0.4)] transition-all px-8 rounded-xl h-11">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'SYNCING...' : 'SAVE CONFIGURATION'}
            </Button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* LEFT COLUMN */}
            <div className="space-y-8">
              
              {/* Business Profile */}
              <Card className="bg-[#1C1E28] border-[#252733] shadow-xl overflow-hidden backdrop-blur-sm">
                <CardHeader className="bg-[#15171F] border-b border-[#252733] pb-4">
                  <CardTitle className="flex items-center text-white text-lg"><div className="p-2 bg-[#60A5FA]/10 rounded-lg mr-3"><Store className="w-5 h-5 text-[#60A5FA]" /></div> Business Profile</CardTitle>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2 flex items-center gap-4 pb-4 border-b border-[#252733]">
                    {business?.logo_url ? (
                      <img src={business.logo_url} className="w-16 h-16 rounded-xl border border-[#252733] object-cover bg-[#15171F]" alt="Logo" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl border border-[#252733] bg-[#15171F] flex items-center justify-center text-xs text-[#737490]">No Logo</div>
                    )}
                    <div className="flex-1 space-y-2">
                      <Label className={labelTheme}>Update Business Logo</Label>
                      <Input name="logo" type="file" accept="image/*" className={`${inputTheme} pt-2.5 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[#60A5FA] file:text-[#0F1117] hover:file:bg-[#3B82F6] cursor-pointer h-11`} />
                    </div>
                  </div>

                  <div className="sm:col-span-2 space-y-2"><Label className={labelTheme}>Business Name *</Label><Input name="business_name" defaultValue={business?.business_name} required className={inputTheme} /></div>
                  <div className="space-y-2"><Label className={labelTheme}>Category</Label><CustomSelect name="business_category" defaultValue={business?.business_category || 'General'} options={['Electronics', 'Fashion', 'Food', 'Gadgets', 'Cosmetics', 'Services', 'General']} /></div>
                  <div className="space-y-2"><Label className={labelTheme}>CAC / Reg Number</Label><Input name="cac_reg_no" defaultValue={business?.cac_reg_no} placeholder="RC-1234567" className={inputTheme} /></div>
                  <div className="space-y-2"><Label className={labelTheme}>Business Phone *</Label><Input name="business_phone" defaultValue={business?.business_phone} required className={inputTheme} /></div>
                  <div className="space-y-2"><Label className={labelTheme}>Business Email</Label><Input name="business_email" type="email" defaultValue={business?.business_email} className={inputTheme} /></div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="bg-[#1C1E28] border-[#252733] shadow-xl overflow-hidden backdrop-blur-sm">
                <CardHeader className="bg-[#15171F] border-b border-[#252733] pb-4">
                  <CardTitle className="flex items-center text-white text-lg"><div className="p-2 bg-[#FB7185]/10 rounded-lg mr-3"><MapPin className="w-5 h-5 text-[#FB7185]" /></div> Location Details</CardTitle>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2 space-y-2"><Label className={labelTheme}>Street Address</Label><Input name="street_address" defaultValue={business?.street_address} placeholder="12 Allen Avenue" className={inputTheme} /></div>
                  <div className="space-y-2"><Label className={labelTheme}>City</Label><Input name="city" defaultValue={business?.city} placeholder="Ikeja" className={inputTheme} /></div>
                  <div className="space-y-2"><Label className={labelTheme}>State / Region</Label><Input name="state_region" defaultValue={business?.state_region} placeholder="Lagos" className={inputTheme} /></div>
                  <div className="sm:col-span-2 space-y-2"><Label className={labelTheme}>Country</Label><CustomSelect name="country" defaultValue={business?.country || 'Nigeria'} options={['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'United States', 'United Kingdom']} /></div>
                </CardContent>
              </Card>

              {/* Policies */}
              <Card className="bg-[#1C1E28] border-[#252733] shadow-xl overflow-hidden backdrop-blur-sm">
                <CardHeader className="bg-[#15171F] border-b border-[#252733] pb-4">
                  <CardTitle className="flex items-center text-white text-lg"><div className="p-2 bg-[#E05535]/10 rounded-lg mr-3"><MessageSquare className="w-5 h-5 text-[#E05535]" /></div> Policies & Disclaimers</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  <div className="space-y-2"><Label className={labelTheme}>WhatsApp Number</Label><Input name="whatsapp_number" defaultValue={business?.whatsapp_number} placeholder="+234..." className={inputTheme} /></div>
                  <div className="space-y-2"><Label className={labelTheme}>Footer Message</Label><Input name="footer_message" defaultValue={business?.footer_message || 'Thank you for shopping with us! 🙏'} className={inputTheme} /></div>
                  <div className="space-y-2"><Label className={labelTheme}>Warranty Policy</Label><CustomTextarea name="warranty_policy" defaultValue={business?.warranty_policy} placeholder="Warranty covers manufacturing defects only..." /></div>
                  <div className="space-y-2"><Label className={labelTheme}>Return / Refund Policy</Label><CustomTextarea name="return_policy" defaultValue={business?.return_policy} placeholder="No returns after 48 hours..." /></div>
                  <div className="space-y-2"><Label className={labelTheme}>Custom Disclaimer</Label><CustomTextarea name="custom_disclaimer" defaultValue={business?.custom_disclaimer} placeholder="All sales are final. Prices subject to change." /></div>
                </CardContent>
              </Card>

            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-8">
              
              {/* Engine Defaults */}
              <Card className="bg-[#1C1E28] border-[#252733] shadow-xl overflow-hidden backdrop-blur-sm">
                <CardHeader className="bg-[#15171F] border-b border-[#252733] pb-4">
                  <CardTitle className="flex items-center text-white text-lg"><div className="p-2 bg-[#F4C542]/10 rounded-lg mr-3"><Receipt className="w-5 h-5 text-[#F4C542]" /></div> Engine Defaults</CardTitle>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2"><Label className={labelTheme}>Currency</Label><CustomSelect name="currency" defaultValue={business?.currency || '₦'} options={['₦', '$', '£', '€', 'GH₵']} /></div>
                  <div className="space-y-2"><Label className={labelTheme}>Prefix (e.g. RCP)</Label><Input name="receipt_prefix" defaultValue={business?.receipt_prefix || 'RCP'} className={inputTheme} /></div>
                  <div className="space-y-2"><Label className={labelTheme}>Starting Number</Label><Input name="receipt_start_number" type="number" defaultValue={business?.receipt_start_number || 1000} className={inputTheme} /></div>
                  <div className="space-y-2"><Label className={labelTheme}>Warranty (Days)</Label><Input name="default_warranty_days" type="number" defaultValue={business?.default_warranty_days || 0} className={inputTheme} /></div>
                  <div className="space-y-2"><Label className={labelTheme}>Default Tax (%)</Label><Input name="default_tax" type="number" step="0.1" defaultValue={business?.default_tax || 0} className={inputTheme} /></div>
                  <div className="space-y-2"><Label className={labelTheme}>Default Discount (%)</Label><Input name="default_discount" type="number" step="0.1" defaultValue={business?.default_discount || 0} className={inputTheme} /></div>
                </CardContent>
              </Card>

              {/* Branding & Visuals */}
              <Card className="bg-[#1C1E28] border-[#252733] shadow-xl overflow-hidden backdrop-blur-sm">
                <CardHeader className="bg-[#15171F] border-b border-[#252733] pb-4">
                  <CardTitle className="flex items-center text-white text-lg"><div className="p-2 bg-[#A78BFA]/10 rounded-lg mr-3"><Palette className="w-5 h-5 text-[#A78BFA]" /></div> Visual Identity</CardTitle>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* Toggles */}
                  <div className="sm:col-span-2 flex gap-6 pb-4 border-b border-[#252733]">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" name="show_logo" defaultChecked={business?.show_logo ?? true} className="w-4 h-4 rounded border-[#252733] bg-[#15171F] text-[#A78BFA] focus:ring-[#A78BFA] focus:ring-offset-0" />
                      <span className="text-sm text-[#EEEEF5] group-hover:text-white transition-colors">Show Logo on Receipt</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" name="show_qr" defaultChecked={business?.show_qr ?? true} className="w-4 h-4 rounded border-[#252733] bg-[#15171F] text-[#A78BFA] focus:ring-[#A78BFA] focus:ring-offset-0" />
                      <span className="text-sm text-[#EEEEF5] group-hover:text-white transition-colors">Show Verification QR</span>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <Label className={labelTheme}>Brand Primary Color</Label>
                    <div className="flex gap-3 items-center">
                      <input name="brand_primary_color" type="color" defaultValue={business?.brand_primary_color || '#FF6B4A'} className="w-10 h-10 rounded cursor-pointer border-0 p-0 bg-transparent" />
                      <Input value={business?.brand_primary_color || '#FF6B4A'} readOnly className={`${inputTheme} font-mono`} />
                    </div>
                  </div>
                  
                  <div className="space-y-2"><Label className={labelTheme}>Website / Social URL</Label><Input name="website_social_link" defaultValue={business?.website_social_link} placeholder="instagram.com/magkk" className={inputTheme} /></div>
                  <div className="space-y-2"><Label className={labelTheme}>Receipt Template</Label><CustomSelect name="receipt_template" defaultValue={business?.receipt_template || 'Classic'} options={['Classic', 'Modern', 'Minimal', 'Bold']} /></div>
                  <div className="space-y-2"><Label className={labelTheme}>Font Style</Label><CustomSelect name="font_style" defaultValue={business?.font_style || 'Default'} options={['Default', 'Elegant', 'Compact', 'Mono']} /></div>
                  
                  {/* Signature Upload */}
                  <div className="sm:col-span-2 space-y-2 border-t border-[#252733] pt-5 mt-2">
                    <Label className={labelTheme}>Digital Signature / Stamp Upload</Label>
                    <Input name="signature" type="file" accept="image/*" className={`${inputTheme} h-12 pt-2.5 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[#A78BFA] file:text-[#0F1117] hover:file:bg-[#C4B5FD] cursor-pointer`} />
                    {business?.signature_url && (
                      <div className="mt-3 flex items-center text-xs text-[#A78BFA] bg-[#A78BFA]/10 w-fit px-3 py-1.5 rounded-full border border-[#A78BFA]/20">
                        <span className="w-2 h-2 rounded-full bg-[#A78BFA] mr-2 animate-pulse"></span>
                        Signature Currently Active
                      </div>
                    )}
                  </div>

                </CardContent>
              </Card>
              
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}