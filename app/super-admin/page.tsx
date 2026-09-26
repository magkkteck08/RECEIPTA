export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { handleLogin } from './actions'
import ClientDashboard from './ClientDashboard'

export default async function SuperAdminDashboard({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;

  const supabaseAuth = await createServerClient()
  const { data: { user } } = await supabaseAuth.auth.getUser()
  const FOUNDER_EMAIL = process.env.NEXT_PUBLIC_FOUNDER_EMAIL?.toLowerCase()

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
            {params?.error && (
              <div className="p-3 bg-[#FB7185]/10 border border-[#FB7185]/30 rounded-lg text-center">
                <p className="text-[#FB7185] text-xs font-bold">{params.error}</p>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#8B92A6] uppercase tracking-wider">Admin Email</label>
              <input type="email" name="email" required className="w-full h-12 bg-[#161B24] border border-[#232838] rounded-xl px-4 text-white focus:outline-none focus:border-[#00C896] transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#8B92A6] uppercase tracking-wider">Master Password</label>
              <input type="password" name="password" required className="w-full h-12 bg-[#161B24] border border-[#232838] rounded-xl px-4 text-white focus:outline-none focus:border-[#00C896] transition-colors" />
            </div>
            <button type="submit" className="w-full h-12 bg-[#00C896] text-[#07090F] font-black rounded-xl hover:bg-[#5EEAD4] transition-all flex items-center justify-center mt-4">
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
  // VIEW 2: DATA FETCHING FOR AUTHORIZED USER
  // ==========================================
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 🚀 Fetch Everything including the raw Auth Users to fix the "N/A" issue
  const [
    { data: allBusinesses },
    { count: totalReceipts },
    { data: receiptsData },
    { data: { users } } 
  ] = await Promise.all([
    supabaseAdmin.from('businesses').select('*').order('created_at', { ascending: false }),
    supabaseAdmin.from('receipts').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('receipts').select('grand_total'),
    supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
  ])

  // Create a fast map of User_ID -> Auth Email
  const userEmailMap = new Map();
  users?.forEach(u => userEmailMap.set(u.id, u.email));

  const totalVolume = receiptsData?.reduce((sum, receipt) => sum + (Number(receipt.grand_total) || 0), 0) || 0

  const BASIC_PLAN_PRICE = 5000;   
  const PREMIUM_PLAN_PRICE = 15000; 

  let calculatedMRR = 0;
  let paidUsersCount = 0;
  const totalUsers = allBusinesses?.length || 0;

  // 🚀 Clean the vendor list and append the raw Auth Email
  const enrichedVendors = allBusinesses?.map((biz) => {
    const subType = (biz.subscription_tier || 'free').toLowerCase(); 
    if (subType === 'basic') { calculatedMRR += BASIC_PLAN_PRICE; paidUsersCount++; } 
    else if (subType === 'premium') { calculatedMRR += PREMIUM_PLAN_PRICE; paidUsersCount++; }

    return {
      id: biz.id,
      business_name: biz.business_name || biz.full_name || 'Unnamed Business',
      // THE N/A FIX: Check business_email first, fallback to Auth Email
      real_email: biz.business_email || userEmailMap.get(biz.user_id) || 'N/A',
      phone: biz.business_phone || 'N/A',
      subscription_tier: subType,
      created_at: biz.created_at
    }
  }) || [];

  const metrics = { calculatedMRR, paidUsersCount, totalUsers, totalVolume, totalReceipts: totalReceipts || 0 }

  return <ClientDashboard metrics={metrics} vendors={enrichedVendors} />
}