'use client'

import { useState } from 'react'
import { Activity, Users, FileText, Wallet, ShieldAlert, LogOut, Mail, Send, Megaphone, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'react-hot-toast'
import { handleLogout, sendVendorEmail, sendBroadcastEmail } from './actions'

type Vendor = {
  id: string
  business_name: string
  real_email: string
  phone: string
  subscription_tier: string
  created_at: string
}

export default function ClientDashboard({ metrics, vendors }: { metrics: any, vendors: Vendor[] }) {
  // Modal States
  const [singleModal, setSingleModal] = useState<{open: boolean, email: string, name: string}>({ open: false, email: '', name: '' })
  const [broadcastModal, setBroadcastModal] = useState(false)
  
  // Form States
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [segment, setSegment] = useState('all')
  const [loading, setLoading] = useState(false)

  const handleSendSingle = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await sendVendorEmail(singleModal.email, subject, message)
    if (res.error) toast.error(res.error)
    else {
      toast.success('Message sent successfully!')
      setSingleModal({ open: false, email: '', name: '' })
      setSubject(''); setMessage('')
    }
    setLoading(false)
  }

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // 🚀 FIXED: Aggressive filtering to catch all edge cases and ensure delivery
    const targetEmails = vendors
      .filter(v => {
        if (segment === 'all') return true;
        // Normalize the database tier just in case it has spaces or uppercase letters
        const tier = (v.subscription_tier || 'free').trim().toLowerCase();
        return tier === segment;
      })
      .map(v => v.real_email?.trim())
      // Validate that it is an actual email address to prevent Resend from choking
      .filter(email => email && email !== 'N/A' && email.includes('@'))

    if (targetEmails.length === 0) {
      toast.error('No valid emails found for this segment.')
      setLoading(false); return;
    }

    const res = await sendBroadcastEmail(targetEmails, subject, message)
    if (res.error) toast.error(res.error)
    else {
      toast.success(`Broadcast successfully queued to ${targetEmails.length} vendors!`)
      setBroadcastModal(false)
      setSubject(''); setMessage(''); setSegment('all')
    }
    setLoading(false)
  }

  const inputTheme = "w-full bg-[#161B24] border border-[#232838] rounded-xl px-4 text-white focus:outline-none focus:border-[#00C896] transition-colors"

  return (
    <div className="min-h-screen bg-[#07090F] p-4 md:p-10 font-sans">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between border-b border-[#232838] pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-[#00C896]" /> Command Center
          </h1>
          <p className="text-[#8B92A6] text-sm mt-1">Platform CRM and global metrics.</p>
        </div>
        <div className="flex items-center gap-4 self-start md:self-auto">
          {/* 🚀 NEW BROADCAST BUTTON */}
          <button onClick={() => setBroadcastModal(true)} className="bg-[#4A90E2]/10 text-[#4A90E2] hover:bg-[#4A90E2] hover:text-black px-4 py-2 rounded-xl border border-[#4A90E2]/20 font-bold text-xs uppercase tracking-widest flex items-center transition-all">
            <Megaphone className="w-4 h-4 mr-2" /> Broadcast
          </button>
          
          <div className="bg-[#00C896]/10 text-[#00C896] px-4 py-2 rounded-xl border border-[#00C896]/20 font-bold text-xs uppercase tracking-widest">
            God Mode
          </div>
          <form action={handleLogout}>
            <button type="submit" className="flex items-center justify-center p-2 rounded-xl bg-[#161B24] border border-[#232838] text-[#FB7185] hover:bg-[#FB7185]/10 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        <Card className="bg-[#11141B] border-[#232838]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[#8B92A6] text-[10px] md:text-xs font-bold uppercase tracking-wider">Total Revenue (MRR)</CardTitle>
            <Activity className="w-4 h-4 text-[#00C896]" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-black text-white">₦{metrics.calculatedMRR.toLocaleString()}</div>
            <p className="text-[#5C6478] text-xs mt-1">{metrics.paidUsersCount} Active paid subscriptions</p>
          </CardContent>
        </Card>

        <Card className="bg-[#11141B] border-[#232838]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[#8B92A6] text-[10px] md:text-xs font-bold uppercase tracking-wider">Registered Vendors</CardTitle>
            <Users className="w-4 h-4 text-[#FF6B4A]" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-black text-white">{metrics.totalUsers}</div>
            <p className="text-[#5C6478] text-xs mt-1">Total platform accounts</p>
          </CardContent>
        </Card>

        <Card className="bg-[#11141B] border-[#232838]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[#8B92A6] text-[10px] md:text-xs font-bold uppercase tracking-wider">Platform Volume</CardTitle>
            <Wallet className="w-4 h-4 text-[#4A90E2]" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-black text-white">₦{metrics.totalVolume.toLocaleString()}</div>
            <p className="text-[#5C6478] text-xs mt-1">Total value of all receipts</p>
          </CardContent>
        </Card>

        <Card className="bg-[#11141B] border-[#232838]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[#8B92A6] text-[10px] md:text-xs font-bold uppercase tracking-wider">Receipts Generated</CardTitle>
            <FileText className="w-4 h-4 text-[#FBBC05]" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-black text-white">{metrics.totalReceipts}</div>
            <p className="text-[#5C6478] text-xs mt-1">Invoices processed</p>
          </CardContent>
        </Card>
      </div>

      {/* CRM Table */}
      <h2 className="text-xl font-bold text-white mb-6">Vendor CRM Database</h2>
      <div className="bg-[#11141B] border border-[#232838] rounded-2xl w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#8B92A6] whitespace-nowrap">
            <thead className="bg-[#161B24] border-b border-[#232838] text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4 text-white">Business Name</th>
                <th className="px-6 py-4 text-white">Verified Contact</th>
                <th className="px-6 py-4 text-white">Plan</th>
                <th className="px-6 py-4 text-white">Date Joined</th>
                <th className="px-6 py-4 text-center text-white">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232838]">
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-[#161B24]/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{vendor.business_name}</td>
                  <td className="px-6 py-4">{vendor.real_email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      vendor.subscription_tier === 'premium' ? 'bg-[#FF6B4A]/10 text-[#FF6B4A] border-[#FF6B4A]/20' : 
                      vendor.subscription_tier === 'basic' ? 'bg-[#4A90E2]/10 text-[#4A90E2] border-[#4A90E2]/20' : 
                      'bg-[#5C6478]/10 text-[#8B92A6] border-[#5C6478]/20'
                    }`}>
                      {vendor.subscription_tier}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(vendor.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-center">
                    {/* 🚀 INDIVIDUAL MESSAGE BUTTON */}
                    <button 
                      onClick={() => setSingleModal({ open: true, email: vendor.real_email, name: vendor.business_name })}
                      disabled={vendor.real_email === 'N/A'}
                      className="inline-flex items-center justify-center p-2 rounded-lg bg-[#00C896]/10 text-[#00C896] hover:bg-[#00C896] hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Send Message"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================== */}
      {/* 📩 SINGLE EMAIL MODAL OVERLAY */}
      {/* ============================== */}
      {singleModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07090F]/90 backdrop-blur-sm">
          <div className="bg-[#11141B] border border-[#232838] w-full max-w-lg rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-white font-bold text-lg">Direct Message</h3>
                <p className="text-[#8B92A6] text-xs">To: {singleModal.name} ({singleModal.email})</p>
              </div>
              <button onClick={() => setSingleModal({ open: false, email: '', name: '' })} className="text-[#5C6478] hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSendSingle} className="space-y-4">
              <input 
                type="text" placeholder="Subject" required value={subject} onChange={(e) => setSubject(e.target.value)}
                className={`${inputTheme} h-12`}
              />
              <textarea 
                placeholder="Type your message..." required rows={5} value={message} onChange={(e) => setMessage(e.target.value)}
                className={`${inputTheme} py-3 resize-none`}
              />
              <button type="submit" disabled={loading} className="w-full h-12 bg-[#00C896] text-[#07090F] font-black rounded-xl hover:bg-[#5EEAD4] transition-all flex items-center justify-center disabled:opacity-50">
                {loading ? 'SENDING...' : <><Send className="w-4 h-4 mr-2" /> SEND SECURE EMAIL</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================== */}
      {/* 📢 BROADCAST EMAIL MODAL OVERLAY */}
      {/* ============================== */}
      {broadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07090F]/90 backdrop-blur-sm">
          <div className="bg-[#11141B] border border-[#232838] w-full max-w-lg rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-white font-bold text-lg flex items-center"><Megaphone className="w-5 h-5 mr-2 text-[#4A90E2]"/> Broadcast Message</h3>
                <p className="text-[#8B92A6] text-xs">Send a mass email to a specific segment.</p>
              </div>
              <button onClick={() => setBroadcastModal(false)} className="text-[#5C6478] hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <select 
                value={segment} onChange={(e) => setSegment(e.target.value)}
                className={`${inputTheme} h-12 appearance-none cursor-pointer`}
              >
                <option value="all">Target: All Platform Vendors</option>
                <option value="free">Target: Free Tier Only (Upgrade Hook)</option>
                <option value="basic">Target: Basic Plan Only</option>
                <option value="premium">Target: Premium Plan Only</option>
              </select>
              <input 
                type="text" placeholder="Subject" required value={subject} onChange={(e) => setSubject(e.target.value)}
                className={`${inputTheme} h-12`}
              />
              <textarea 
                placeholder="Type your broadcast message..." required rows={5} value={message} onChange={(e) => setMessage(e.target.value)}
                className={`${inputTheme} py-3 resize-none`}
              />
              <button type="submit" disabled={loading} className="w-full h-12 bg-[#4A90E2] text-white font-black rounded-xl hover:bg-[#357ABD] transition-all flex items-center justify-center disabled:opacity-50">
                {loading ? 'BROADCASTING...' : <><Megaphone className="w-4 h-4 mr-2" /> SEND BROADCAST</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}