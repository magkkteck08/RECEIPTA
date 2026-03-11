'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'react-hot-toast'
import { Users, Mail, Phone, Plus, Search, UserPlus, Star, Lock, Crown, Download } from 'lucide-react'

// Shadcn UI Imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function CustomersPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [business, setBusiness] = useState<any>(null)
  const [customers, setCustomers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '' })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: biz } = await supabase.from('businesses').select('*').eq('user_id', user.id).single()
    if (biz) {
      setBusiness(biz)
      
      // ONLY fetch customers if they are Premium!
      if (biz.subscription_tier !== 'free') {
        const { data: custData } = await supabase
          .from('customers')
          .select('*')
          .eq('business_id', biz.id)
          .order('created_at', { ascending: false })
        
        if (custData) setCustomers(custData)
      }
    }
    setLoading(false)
  }

  async function handleAddCustomer(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const { data, error } = await supabase.from('customers').insert({
        business_id: business.id,
        customer_name: newCustomer.name,
        customer_phone: newCustomer.phone,
        customer_email: newCustomer.email
      }).select().single()

      if (error) throw error

      toast.success('Client added to directory! 🤝', { 
        style: { background: '#1C1E28', color: '#FF6B4A', border: '1px solid #252733' } 
      })
      
      setCustomers([data, ...customers])
      setNewCustomer({ name: '', phone: '', email: '' })
    } catch (error: any) {
      toast.error(error.message || "Failed to add customer")
    } finally {
      setSaving(false)
    }
  }

  // 📥 EXPORT TO CSV ENGINE (Premium Feature)
  const exportToCSV = () => {
    if (customers.length === 0) {
      toast.error("No customers to export.")
      return
    }

    // 1. Create Headers
    const headers = ['Name', 'Phone', 'Email', 'Date Added']
    
    // 2. Map Data
    const csvRows = customers.map(c => [
      `"${c.customer_name || 'Walk-in'}"`,
      `"${c.customer_phone || 'N/A'}"`,
      `"${c.customer_email || ''}"`,
      `"${new Date(c.created_at).toLocaleDateString('en-US')}"`
    ])

    // 3. Combine into a CSV string
    const csvContent = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n')
    
    // 4. Trigger Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `receipta_customers_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    
    toast.success("Client list exported successfully!", {
      style: { background: '#1C1E28', color: '#FF6B4A', border: '1px solid #252733' }
    })
  }

  const filteredCustomers = customers.filter(c => 
    c.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.customer_phone?.includes(searchQuery)
  )

  const inputTheme = "bg-[#15171F] border-[#252733] text-[#EEEEF5] placeholder:text-[#737490] focus-visible:ring-[#FF6B4A] focus-visible:border-[#FF6B4A] h-11"
  const labelTheme = "text-[11px] font-bold text-[#EEEEF5] uppercase tracking-wider mb-1.5 block"

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh] text-[#FF6B4A] animate-pulse font-bold tracking-widest text-sm">
      LOADING CRM...
    </div>
  )

  // 🛑 THE PAYWALL UI FOR FREE USERS
  if (business?.subscription_tier === 'free') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#0F1117] rounded-3xl border border-[#252733] shadow-2xl relative overflow-hidden p-6 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF6B4A] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
        
        <div className="w-20 h-20 bg-[#1C1E28] border border-[#252733] rounded-2xl flex items-center justify-center mb-6 shadow-xl relative">
          <Lock className="w-10 h-10 text-[#737490]" />
          <div className="absolute -bottom-2 -right-2 bg-[#F4C542] p-1.5 rounded-full shadow-lg">
            <Crown className="w-4 h-4 text-black" />
          </div>
        </div>

        <h2 className="text-3xl font-black text-white mb-3 tracking-tight">Premium CRM Locked</h2>
        <p className="text-[#737490] max-w-md mb-8 text-sm leading-relaxed">
          Free users do not have access to the Smart Client Directory. Upgrade to Premium for <b>₦12,000/year</b> to automatically save customer details, track purchase history, and manage your relationships.
        </p>

        <Link href="/dashboard/upgrade">
          <Button className="h-14 px-8 bg-gradient-to-r from-[#FF6B4A] to-[#E05535] text-white hover:opacity-90 font-bold text-base rounded-xl shadow-[0_0_20px_rgba(255,107,74,0.3)] transition-all flex items-center">
            <Crown className="w-5 h-5 mr-2" />
            UPGRADE TO PREMIUM NOW
          </Button>
        </Link>
      </div>
    )
  }

  // ✅ FULL CRM UI FOR PREMIUM USERS
  return (
    <div className="min-h-full bg-[#0F1117] rounded-3xl border border-[#252733] shadow-2xl relative overflow-hidden pb-10">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF6B4A] rounded-full blur-[150px] opacity-5 pointer-events-none"></div>

      <div className="relative z-10 p-4 md:p-8 space-y-8">
        <div className="border-b border-[#252733] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Client Directory</h1>
            <p className="text-[#737490] mt-1 text-sm font-medium">Manage your customer relationships and contact info.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* ✨ NEW EXPORT BUTTON ✨ */}
            <Button onClick={exportToCSV} variant="outline" className="h-10 border-[#FF6B4A]/30 text-[#FF6B4A] hover:bg-[#FF6B4A]/10 hover:text-[#FF6B4A] transition-all flex items-center bg-[#1C1E28]">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>

            <div className="flex items-center gap-2 bg-[#1C1E28] border border-[#252733] px-4 py-2 rounded-xl h-10">
              <Users className="w-4 h-4 text-[#FF6B4A]" />
              <span className="text-white font-bold">{customers.length} <span className="text-[#737490] font-medium text-sm">Total</span></span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Add New Client Form */}
          <div className="xl:col-span-1">
            <Card className="bg-[#1C1E28] border-[#252733] shadow-xl overflow-hidden sticky top-8">
              <CardHeader className="bg-[#15171F] border-b border-[#252733] pb-4">
                <CardTitle className="flex items-center text-white text-lg">
                  <div className="p-2 bg-[#FF6B4A]/10 rounded-lg mr-3"><UserPlus className="w-5 h-5 text-[#FF6B4A]" /></div>
                  Add New Client
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleAddCustomer} className="space-y-5">
                  <div>
                    <Label className={labelTheme}>Full Name <span className="text-[#FB7185]">*</span></Label>
                    <Input required placeholder="e.g. Adewale Bello" className={inputTheme} value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
                  </div>
                  <div>
                    <Label className={labelTheme}>Phone Number <span className="text-[#FB7185]">*</span></Label>
                    <Input required placeholder="090..." className={inputTheme} value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
                  </div>
                  <div>
                    <Label className={labelTheme}>Email Address (Optional)</Label>
                    <Input type="email" placeholder="client@email.com" className={inputTheme} value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} />
                  </div>
                  
                  <Button type="submit" disabled={saving} className="w-full h-12 mt-2 bg-[#FF6B4A] hover:bg-[#E05535] text-white font-bold rounded-xl shadow-[0_0_15px_rgba(255,107,74,0.2)] transition-all">
                    <Plus className="w-4 h-4 mr-2" />
                    {saving ? 'SAVING...' : 'SAVE CLIENT'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Database List */}
          <div className="xl:col-span-2 space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#737490]" />
              <Input 
                placeholder="Search clients by name or phone..." 
                className="w-full h-12 pl-12 bg-[#1C1E28] border-[#252733] text-white placeholder:text-[#737490] focus-visible:ring-[#FF6B4A] focus-visible:border-[#FF6B4A] rounded-xl shadow-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="bg-[#1C1E28] border border-[#252733] rounded-2xl overflow-hidden shadow-xl">
              {filteredCustomers.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center bg-[#15171F]">
                  <Users className="w-12 h-12 text-[#737490] mb-4 opacity-20" />
                  <h3 className="text-white font-bold text-lg">No clients found</h3>
                  <p className="text-[#737490] text-sm mt-1">Your client directory is currently empty.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#252733]">
                  {filteredCustomers.map((customer) => (
                    <div key={customer.id} className="p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#15171F]/50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B4A]/20 to-[#FF6B4A]/5 border border-[#FF6B4A]/20 flex items-center justify-center text-[#FF6B4A] font-black text-lg">
                          {customer.customer_name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-base flex items-center">
                            {customer.customer_name}
                            <Star className="w-3 h-3 ml-2 text-[#F4C542] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h4>
                          <div className="text-[11px] font-bold text-[#737490] uppercase tracking-wider mt-1 flex flex-wrap items-center gap-3">
                            <span className="flex items-center"><Phone className="w-3 h-3 mr-1" /> {customer.customer_phone}</span>
                            {customer.customer_email && <span className="flex items-center"><Mail className="w-3 h-3 mr-1" /> {customer.customer_email}</span>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-left sm:text-right shrink-0">
                        <p className="text-[10px] text-[#737490] uppercase tracking-widest">Added</p>
                        <p className="text-sm text-[#EEEEF5] font-medium mt-0.5">
                          {new Date(customer.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}