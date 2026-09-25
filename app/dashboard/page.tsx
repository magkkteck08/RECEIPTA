import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Receipt, TrendingUp, Users, Wallet, ArrowRight, ExternalLink, Lock } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardHome() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: business } = await supabase
    .from('businesses')
    .select('id, business_name, currency, subscription_tier') 
    .eq('user_id', user?.id)
    .single()

  const userTier = (business?.subscription_tier || 'free').toLowerCase()
  const canSeeAdvancedDashboard = userTier === 'basic' || userTier === 'premium'

  const { data: receipts } = await supabase
    .from('receipts')
    .select('id, receipt_number, grand_total, amount_paid, document_type, created_at, payment_method, customer_id')
    .eq('business_id', business?.id)
    .order('created_at', { ascending: false }) 

  const { data: expenses } = await supabase
    .from('expenses')
    .select('amount')
    .eq('business_id', business?.id)

  const safeReceipts = receipts || []
  const safeExpenses = expenses || []
  
  const totalRevenue = safeReceipts.reduce((sum, r) => sum + Number(r.amount_paid || 0), 0)
  const totalExpenses = safeExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0)
  const netBalance = totalRevenue - totalExpenses
  
  const receiptsIssued = safeReceipts.length
  const paidReceiptsCount = safeReceipts.filter(r => r.amount_paid > 0).length
  const avgTicket = paidReceiptsCount > 0 ? (totalRevenue / paidReceiptsCount) : 0
  const totalCustomers = receiptsIssued 
  const recentReceipts = safeReceipts.slice(0, 5)

  const formatCurrency = (amount: number) => {
    return `${business?.currency || '₦'}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-10">
      <div className="border-b border-[#252733] pb-10 pt-4 flex flex-col items-center justify-center gap-6 text-center">
        <div>
          <p className="text-sm font-bold text-[#9CA3AF] tracking-widest uppercase mb-3">
            Welcome back
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <h1 className="text-4xl md:text-6xl font-black leading-none tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C896] to-[#00A67C]">
                {business?.business_name || 'Vendor'}
              </span>
            </h1>
            
            {/* 🏷️ DYNAMIC PLAN TAG */}
            <div className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest border backdrop-blur-sm ${
              userTier === 'premium' ? 'bg-[#F4C542]/10 border-[#F4C542]/30 text-[#F4C542] shadow-[0_0_15px_rgba(244,197,66,0.1)]' :
              userTier === 'basic' ? 'bg-[#60A5FA]/10 border-[#60A5FA]/30 text-[#60A5FA] shadow-[0_0_15px_rgba(96,165,250,0.1)]' :
              'bg-[#737490]/10 border-[#737490]/30 text-[#737490]'
            }`}>
              {userTier} Plan
            </div>
          </div>

          <div className="mt-5 text-sm md:text-base text-[#C8CDD8] leading-relaxed flex flex-col items-center justify-center font-medium">
            <span>Your business command center—receipts, customers,</span>
            <span>inventory, expenses, and financial insights in one place.</span>
          </div>
        </div>

        <Link
          href="/dashboard/receipts/new"
          className="mt-2 inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00C896] to-[#00A67C] text-[#0F1117] font-bold text-sm shadow-[0_0_20px_rgba(0,200,150,0.2)] hover:shadow-[0_0_30px_rgba(0,200,150,0.4)] hover:-translate-y-0.5 transition-all"
        >
          <Receipt className="w-5 h-5 mr-2" />
          New Document
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Net Balance Card */}
        <Card className="bg-[#1C1E28] border-[#252733] shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00C896] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-xs font-bold text-[#EEEEF5] uppercase tracking-wider">Net Balance</CardTitle>
            <div className="p-2 bg-[#00C896]/10 rounded-lg"><Wallet className="h-4 w-4 text-[#00C896]" /></div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className={!canSeeAdvancedDashboard ? "blur-[6px] opacity-40 select-none transition-all" : ""}>
              <div className="text-2xl font-black text-white">{formatCurrency(netBalance)}</div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#252733]/50 text-[10px] uppercase font-bold tracking-wider">
                <span className="text-[#00C896]">In: {formatCurrency(totalRevenue)}</span>
                <span className="text-[#FB7185]">Out: {formatCurrency(totalExpenses)}</span>
              </div>
            </div>
            {!canSeeAdvancedDashboard && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0F1117]/30 backdrop-blur-[1px] z-20 rounded-b-xl">
                <Lock className="w-6 h-6 text-[#F4C542] mb-2" />
                <Link href="/dashboard/upgrade" className="text-[9px] font-bold tracking-widest bg-[#F4C542] text-black px-3 py-1.5 rounded-md uppercase hover:bg-[#d4a935] transition-colors shadow-lg">
                  Unlock Insights
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documents Issued Card */}
        <Card className="bg-[#1C1E28] border-[#252733] shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#60A5FA] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-[#EEEEF5] uppercase tracking-wider">Documents Issued</CardTitle>
            <div className="p-2 bg-[#60A5FA]/10 rounded-lg"><Receipt className="h-4 w-4 text-[#60A5FA]" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white">{receiptsIssued}</div>
            <p className="text-xs text-[#737490] mt-1 font-medium">Successfully generated</p>
          </CardContent>
        </Card>

        {/* Total Customers Card */}
        <Card className="bg-[#1C1E28] border-[#252733] shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#A78BFA] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-[#EEEEF5] uppercase tracking-wider">Total Customers</CardTitle>
            <div className="p-2 bg-[#A78BFA]/10 rounded-lg"><Users className="h-4 w-4 text-[#A78BFA]" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white">{totalCustomers}</div>
            <p className="text-xs text-[#737490] mt-1 font-medium">Unique transactions</p>
          </CardContent>
        </Card>

        {/* Avg Ticket Size Card */}
        <Card className="bg-[#1C1E28] border-[#252733] shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#F4C542] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-xs font-bold text-[#EEEEF5] uppercase tracking-wider">Avg. Ticket Size</CardTitle>
            <div className="p-2 bg-[#F4C542]/10 rounded-lg"><TrendingUp className="h-4 w-4 text-[#F4C542]" /></div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className={!canSeeAdvancedDashboard ? "blur-[6px] opacity-40 select-none transition-all" : ""}>
              <div className="text-2xl font-black text-white">{formatCurrency(avgTicket)}</div>
              <p className="text-xs text-[#737490] mt-1 font-medium">Per paid receipt</p>
            </div>
            {!canSeeAdvancedDashboard && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0F1117]/30 backdrop-blur-[1px] z-20 rounded-b-xl">
                <Lock className="w-6 h-6 text-[#F4C542] mb-2" />
                <Link href="/dashboard/upgrade" className="text-[9px] font-bold tracking-widest bg-[#F4C542] text-black px-3 py-1.5 rounded-md uppercase hover:bg-[#d4a935] transition-colors shadow-lg">
                  Unlock Insights
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
          {receiptsIssued > 0 && (
            <Link href="/dashboard/receipts" className="text-[#00C896] text-sm font-bold hover:text-[#00A67C] flex items-center transition-colors">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          )}
        </div>

        {receiptsIssued === 0 ? (
          <div className="w-full h-48 rounded-2xl border border-dashed border-[#252733] flex flex-col items-center justify-center bg-[#15171F]">
            <div className="w-12 h-12 bg-[#1C1E28] rounded-full flex items-center justify-center mb-3 border border-[#252733]">
              <Receipt className="w-6 h-6 text-[#737490]" />
            </div>
            <p className="text-[#EEEEF5] text-sm font-medium">No documents generated yet.</p>
            <Link href="/dashboard/receipts/new" className="mt-3 text-[#00C896] text-sm font-bold hover:underline">
              Create your first document →
            </Link>
          </div>
        ) : (
          <div className="bg-[#1C1E28] border border-[#252733] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#15171F] border-b border-[#252733]">
                    <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-[#737490]">Doc No.</th>
                    <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-[#737490]">Date</th>
                    <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-[#737490]">Type</th>
                    <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-[#737490] text-right">Value</th>
                    <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-[#737490] text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#252733]">
                  {recentReceipts.map((receipt) => (
                    <tr key={receipt.id} className="hover:bg-[#15171F]/50 transition-colors">
                      <td className="py-4 px-6 text-sm font-bold text-white">{receipt.receipt_number}</td>
                      <td className="py-4 px-6 text-sm text-[#EEEEF5]">
                        {new Date(receipt.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          receipt.document_type === 'Quotation' ? 'bg-[#F4C542]/20 text-[#F4C542]' :
                          receipt.document_type === 'Invoice' ? 'bg-[#60A5FA]/20 text-[#60A5FA]' :
                          'bg-[#00C896]/20 text-[#00C896]'
                        }`}>
                          {receipt.document_type || 'Receipt'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm font-black text-right">
                        <span className={receipt.amount_paid > 0 ? "text-[#00C896]" : "text-[#737490]"}>
                          {formatCurrency(Number(receipt.grand_total))}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <Link href={`/dashboard/receipts/${receipt.id}`} className="inline-flex items-center text-[#EEEEF5] hover:text-white transition-colors p-2 hover:bg-[#252733] rounded-lg">
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}