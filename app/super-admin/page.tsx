
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { Activity, Users, FileText, Wallet, ShieldAlert } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function SuperAdminDashboard() {
  // 1. STANDARD CLIENT: Check who is currently logged in
  const supabaseAuth = await createServerClient()
  const { data: { user } } = await supabaseAuth.auth.getUser()

  // 🔒 THE CTO LOCK: Replace this with your actual founder email
  const FOUNDER_EMAIL = 'oloyerichieog@gmail.com' 

  if (!user || user.email !== FOUNDER_EMAIL) {
    redirect('/login') 
  }

  // 2. ADMIN CLIENT: Use the Service Role Key to bypass RLS and read ALL data
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 3. FETCH GLOBAL METRICS IN PARALLEL
  const [
    { count: totalUsers },
    { count: totalReceipts },
    { data: receiptsData },
    { data: recentBusinesses }
  ] = await Promise.all([
    supabaseAdmin.from('businesses').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('receipts').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('receipts').select('grand_total'),
    supabaseAdmin.from('businesses').select('*').order('created_at', { ascending: false }).limit(5)
  ])

  // Calculate Total Platform Volume
  const totalVolume = receiptsData?.reduce((sum, receipt) => {
    return sum + (Number(receipt.grand_total) || 0)
  }, 0) || 0

  return (
    <div className="min-h-screen bg-[#07090F] p-6 md:p-10 font-sans">
      
      {/* Header */}
      <div className="mb-10 flex items-center justify-between border-b border-[#232838] pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-[#00C896]" />
            Command Center
          </h1>
          <p className="text-[#8B92A6] text-sm mt-1">Platform overview and global metrics.</p>
        </div>
        <div className="bg-[#00C896]/10 text-[#00C896] px-4 py-2 rounded-xl border border-[#00C896]/20 font-bold text-xs uppercase tracking-widest">
          God Mode Active
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        <Card className="bg-[#11141B] border-[#232838]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[#8B92A6] text-xs font-bold uppercase tracking-wider">Total Revenue (MRR)</CardTitle>
            <Activity className="w-4 h-4 text-[#00C896]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white">₦0.00</div>
            <p className="text-[#5C6478] text-xs mt-1">Pending Subscriptions Table</p>
          </CardContent>
        </Card>

        <Card className="bg-[#11141B] border-[#232838]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[#8B92A6] text-xs font-bold uppercase tracking-wider">Registered Vendors</CardTitle>
            <Users className="w-4 h-4 text-[#FF6B4A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white">{totalUsers || 0}</div>
            <p className="text-[#5C6478] text-xs mt-1">Active businesses</p>
          </CardContent>
        </Card>

        <Card className="bg-[#11141B] border-[#232838]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[#8B92A6] text-xs font-bold uppercase tracking-wider">Platform Volume</CardTitle>
            <Wallet className="w-4 h-4 text-[#4A90E2]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white">₦{totalVolume.toLocaleString()}</div>
            <p className="text-[#5C6478] text-xs mt-1">Total value of all receipts</p>
          </CardContent>
        </Card>

        <Card className="bg-[#11141B] border-[#232838]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[#8B92A6] text-xs font-bold uppercase tracking-wider">Receipts Generated</CardTitle>
            <FileText className="w-4 h-4 text-[#FBBC05]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white">{totalReceipts || 0}</div>
            <p className="text-[#5C6478] text-xs mt-1">Invoices processed</p>
          </CardContent>
        </Card>

      </div>

      {/* Recent Users Matrix */}
      <h2 className="text-xl font-bold text-white mb-6">Latest Vendor Signups</h2>
      <div className="bg-[#11141B] border border-[#232838] rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-[#8B92A6]">
          <thead className="bg-[#161B24] border-b border-[#232838] text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4 text-white">Business Name</th>
              <th className="px-6 py-4 text-white">Contact</th>
              <th className="px-6 py-4 text-white">Date Joined</th>
              <th className="px-6 py-4 text-white text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#232838]">
            {recentBusinesses?.map((business) => (
              <tr key={business.id} className="hover:bg-[#161B24]/50 transition-colors">
                <td className="px-6 py-4 font-bold text-white">{business.business_name || business.full_name || 'Unnamed Business'}</td>
                <td className="px-6 py-4">{business.business_email || business.business_phone || 'N/A'}</td>
                <td className="px-6 py-4">{new Date(business.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <span className="bg-[#00C896]/10 text-[#00C896] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#00C896]/20">
                    Active
                  </span>
                </td>
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
  )
}
