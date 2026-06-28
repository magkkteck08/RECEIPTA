export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { Activity, Users, FileText, Wallet, ShieldAlert, LogOut, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

// ==========================================
// 1. SERVER ACTIONS (Moved outside for stability)
// ==========================================
async function handleLogin(formData: FormData) {
  'use server'
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  // Grab Vercel's email, or default to telling us it is missing
  const founderEmail = process.env.FOUNDER_EMAIL?.toLowerCase() || 'MISSING_IN_VERCEL'

  const supabase = await createServerClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect('/super-admin?error=Invalid admin credentials')
  }
  
  // 🚨 THE DEBUG FIX: This will now print both emails to the screen
  if (email.toLowerCase() !== founderEmail) {
    await supabase.auth.signOut() 
    redirect(`/super-admin?error=Mismatch! You typed: [${email}] but Vercel has: [${founderEmail}]`)
  }

  // Success
  redirect('/super-admin')
}


async function handleLogout() {
  'use server'
  const supabase = await createServerClient()
  await supabase.auth.signOut()
  redirect('/super-admin')
}

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default async function SuperAdminDashboard({ 
  searchParams 
}: { 
  searchParams: Promise<{ error?: string }> 
}) {
  // Await searchParams for error messages
  const params = await searchParams;

  // Check who is currently logged in
  const supabaseAuth = await createServerClient()
  const { data: { user } } = await supabaseAuth.auth.getUser()

  const FOUNDER_EMAIL = process.env.FOUNDER_EMAIL?.toLowerCase()

  // ==========================================
  // VIEW 1: THE LOGIN SCREEN (UNAUTHORIZED)
  // ==========================================
  if (!user || user.email?.toLowerCase() !== FOUNDER_EMAIL) {
    return (
      <div className="min-h-screen bg-[#07090F] flex flex-col items-center justify-center p-4 relative font-sans">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00C896] rounded-full blur-[200px] opacity-[0.08] pointer-events-none"></div>

        <div className="w-full max-w-sm relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#00C896]/10 rounded-2xl flex items-center justify-center mb-4 border border-[#00C896]/20">
              <ShieldAlert className="w-8 h-8 text-[#00C896]" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">System Override</h1>
            <p className="text-[#8B92A6] text-xs font-bold uppercase tracking-widest mt-2">Authorized Personnel Only</p>
          </div>

          <form action={handleLogin} className="bg-[#11141B] border border-[#232838] p-8 rounded-[2rem] shadow-2xl space-y-5">
            
            {/* 🚨 THE ERROR MESSAGE BOX */}
            {params?.error && (
              <div className="p-3 bg-[#FB7185]/10 border border-[#FB7185]/30 rounded-lg text-center">
                <p className="text-[#FB7185] text-xs font-bold">{params.error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#8B92A6] uppercase tracking-wider">Admin Email</label>
              <input 
                type="email" 
                name="email"
                required
                className="w-full h-12 bg-[#161B24] border border-[#232838] rounded-xl px-4 text-white focus:outline-none focus:border-[#00C896] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#8B92A6] uppercase tracking-wider">Master Password</label>
              <input 
                type="password" 
                name="password"
                required
                className="w-full h-12 bg-[#161B24] border border-[#232838] rounded-xl px-4 text-white focus:outline-none focus:border-[#00C896] transition-colors"
              />
            </div>

            <button 
              type="submit" 
              className="w-full h-12 bg-[#00C896] text-[#07090F] font-black rounded-xl hover:bg-[#5EEAD4] transition-all flex items-center justify-center mt-4"
            >
              INITIALIZE OVERRIDE
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/" className="inline-flex items-center justify-center text-[#5C6478] text-xs font-bold hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3 mr-2" /> Return to Public Site
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // VIEW 2: THE DASHBOARD SCREEN (AUTHORIZED)
  // ==========================================
  
  // ADMIN CLIENT: Use the Service Role Key to bypass RLS
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const [
    { data: allBusinesses },
    { count: totalReceipts },
    { data: receiptsData },
    { data: recentBusinesses }
  ] = await Promise.all([
    supabaseAdmin.from('businesses').select('id, subscription'),
    supabaseAdmin.from('receipts').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('receipts').select('grand_total'),
    supabaseAdmin.from('businesses').select('*').order('created_at', { ascending: false }).limit(10)
  ])

  const totalVolume = receiptsData?.reduce((sum, receipt) => {
    return sum + (Number(receipt.grand_total) || 0)
  }, 0) || 0

  const BASIC_PLAN_PRICE = 5000;   
  const PREMIUM_PLAN_PRICE = 15000; 

  let calculatedMRR = 0;
  let paidUsersCount = 0;
  const totalUsers = allBusinesses?.length || 0;

  allBusinesses?.forEach((biz) => {
    const subType = (biz.subscription || 'free').toLowerCase(); 
    if (subType === 'basic') {
      calculatedMRR += BASIC_PLAN_PRICE;
      paidUsersCount++;
    } else if (subType === 'premium') {
      calculatedMRR += PREMIUM_PLAN_PRICE;
      paidUsersCount++;
    }
  });

  return (
    <div className="min-h-screen bg-[#07090F] p-4 md:p-10 font-sans">
      
      {/* Header with Logout Button */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between border-b border-[#232838] pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-[#00C896]" />
            Command Center
          </h1>
          <p className="text-[#8B92A6] text-sm mt-1">Platform overview and global metrics.</p>
        </div>
        <div className="flex items-center gap-4 self-start md:self-auto">
          <div className="bg-[#00C896]/10 text-[#00C896] px-4 py-2 rounded-xl border border-[#00C896]/20 font-bold text-xs uppercase tracking-widest">
            God Mode Active
          </div>
          <form action={handleLogout}>
            <button type="submit" className="flex items-center justify-center p-2 rounded-xl bg-[#161B24] border border-[#232838] text-[#FB7185] hover:bg-[#FB7185]/10 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        <Card className="bg-[#11141B] border-[#232838]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[#8B92A6] text-[10px] md:text-xs font-bold uppercase tracking-wider">Total Revenue (MRR)</CardTitle>
            <Activity className="w-4 h-4 text-[#00C896]" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-black text-white">₦{calculatedMRR.toLocaleString()}</div>
            <p className="text-[#5C6478] text-xs mt-1">{paidUsersCount} Active paid subscriptions</p>
          </CardContent>
        </Card>

        <Card className="bg-[#11141B] border-[#232838]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[#8B92A6] text-[10px] md:text-xs font-bold uppercase tracking-wider">Registered Vendors</CardTitle>
            <Users className="w-4 h-4 text-[#FF6B4A]" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-black text-white">{totalUsers}</div>
            <p className="text-[#5C6478] text-xs mt-1">Total platform accounts</p>
          </CardContent>
        </Card>

        <Card className="bg-[#11141B] border-[#232838]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[#8B92A6] text-[10px] md:text-xs font-bold uppercase tracking-wider">Platform Volume</CardTitle>
            <Wallet className="w-4 h-4 text-[#4A90E2]" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-black text-white">₦{totalVolume.toLocaleString()}</div>
            <p className="text-[#5C6478] text-xs mt-1">Total value of all receipts</p>
          </CardContent>
        </Card>

        <Card className="bg-[#11141B] border-[#232838]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[#8B92A6] text-[10px] md:text-xs font-bold uppercase tracking-wider">Receipts Generated</CardTitle>
            <FileText className="w-4 h-4 text-[#FBBC05]" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-black text-white">{totalReceipts || 0}</div>
            <p className="text-[#5C6478] text-xs mt-1">Invoices processed</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users Matrix */}
      <h2 className="text-xl font-bold text-white mb-6">Latest Vendor Signups</h2>
      <div className="bg-[#11141B] border border-[#232838] rounded-2xl w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#8B92A6] whitespace-nowrap">
            <thead className="bg-[#161B24] border-b border-[#232838] text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4 text-white">Business Name</th>
                <th className="px-6 py-4 text-white">Contact</th>
                <th className="px-6 py-4 text-white">Plan</th>
                <th className="px-6 py-4 text-white">Date Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232838]">
              {recentBusinesses?.map((business) => (
                <tr key={business.id} className="hover:bg-[#161B24]/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{business.business_name || business.full_name || 'Unnamed Business'}</td>
                  <td className="px-6 py-4">{business.business_email || business.business_phone || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      (business.subscription || 'free').toLowerCase() === 'premium' ? 'bg-[#FF6B4A]/10 text-[#FF6B4A] border-[#FF6B4A]/20' : 
                      (business.subscription || 'free').toLowerCase() === 'basic' ? 'bg-[#4A90E2]/10 text-[#4A90E2] border-[#4A90E2]/20' : 
                      'bg-[#5C6478]/10 text-[#8B92A6] border-[#5C6478]/20'
                    }`}>
                      {business.subscription || 'Free'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(business.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {!recentBusinesses?.length && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[#5C6478]">No vendors registered yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
