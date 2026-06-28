import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { Activity, Users, FileText, Wallet, ShieldAlert } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function SuperAdminDashboard() {
  // 1. STANDARD CLIENT: Check who is currently logged in
  const supabaseAuth = await createServerClient()
  const { data: { user } } = await supabaseAuth.auth.getUser()

  // 🔒 THE CTO LOCK: Securely using your environment variables
  const FOUNDER_EMAIL = process.env.FOUNDER_EMAIL 

  if (!user || user.email !== FOUNDER_EMAIL) {
    redirect('/login') 
  }

  // 2. ADMIN CLIENT: Use the Service Role Key to bypass RLS
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 3. FETCH GLOBAL METRICS IN PARALLEL
  const [
    { data: allBusinesses },
    { count: totalReceipts },
    { data: receiptsData },
    { data: recentBusinesses }
  ] = await Promise.all([
    // We now fetch the subscription column to calculate MRR
    supabaseAdmin.from('businesses').select('id, subscription'),
    supabaseAdmin.from('receipts').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('receipts').select('grand_total'),
    supabaseAdmin.from('businesses').select('*').order('created_at', { ascending: false }).limit(10)
  ])

  // 💰 Calculate Total Platform Volume
  const totalVolume = receiptsData?.reduce((sum, receipt) => {
    return sum + (Number(receipt.grand_total) || 0)
  }, 0) || 0

  // 📈 THE REAL MRR CALCULATION ENGINE
  const BASIC_PLAN_PRICE = 5000;   // Set your actual Basic price here
  const PREMIUM_PLAN_PRICE = 15000; // Set your actual Premium price here

  let calculatedMRR = 0;
  let paidUsersCount = 0;
  const totalUsers = allBusinesses?.length || 0;

  allBusinesses?.forEach((biz) => {
    // Make sure we handle potential capitalization differences (e.g., 'Basic' vs 'basic')
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
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between border-b border-[#232838] pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-[#00C896]" />
            Command Center
          </h1>
          <p className="text-[#8B92A6] text-sm mt-1">Platform overview and global metrics.</p>
        </div>
        <div className="bg-[#00C896]/10 text-[#00C896] px-4 py-2 rounded-xl border border-[#00C896]/20 font-bold text-xs uppercase tracking-widest self-start md:self-auto">
          God Mode Active
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

      {/* Recent Users Matrix - Mobile Swipe Enabled! */}
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
