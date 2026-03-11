import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Receipt, TrendingUp, Users, Wallet, ArrowRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardHome() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 1. Get the Business Profile & Currency
  const { data: business } = await supabase
    .from('businesses')
    .select('id, business_name, currency')
    .eq('user_id', user?.id)
    .single()

  // 2. Fetch ALL Receipts for this specific business
  const { data: receipts } = await supabase
    .from('receipts')
    .select('id, receipt_number, grand_total, created_at, payment_method, customer_id')
    .eq('business_id', business?.id)
    .order('created_at', { ascending: false }) // Newest first

  // 3. The Math Engine (Calculates live data!)
  const safeReceipts = receipts || []
  const totalRevenue = safeReceipts.reduce((sum, r) => sum + Number(r.grand_total), 0)
  const receiptsIssued = safeReceipts.length
  const avgTicket = receiptsIssued > 0 ? (totalRevenue / receiptsIssued) : 0
  
  // For now, we estimate customers by the number of receipts issued
  const totalCustomers = receiptsIssued 

  // Grab just the 5 most recent receipts for the table
  const recentReceipts = safeReceipts.slice(0, 5)

  // Formatting helper
  const formatCurrency = (amount: number) => {
    return `${business?.currency || '₦'}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Welcome Header */}
      <div className="border-b border-[#252733] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B4A] to-[#E05535]">{business?.business_name || 'Vendor'}</span>
          </h1>
          <p className="text-[#EEEEF5] mt-2 text-sm font-medium">Here is your Receipta financial overview.</p>
        </div>
        <Link href="/dashboard/receipts/new" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF6B4A] to-[#E05535] text-[#0F1117] font-bold text-sm shadow-[0_0_15px_rgba(110,231,183,0.3)] hover:shadow-[0_0_25px_rgba(110,231,183,0.5)] transition-all">
          <Receipt className="w-4 h-4 mr-2" /> New Receipt
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Revenue */}
        <Card className="bg-[#1C1E28] border-[#252733] shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF6B4A] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-[#EEEEF5] uppercase tracking-wider">Total Revenue</CardTitle>
            <div className="p-2 bg-[#FF6B4A]/10 rounded-lg"><Wallet className="h-4 w-4 text-[#FF6B4A]" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-[#FF6B4A] mt-1 flex items-center font-medium">Lifetime earnings</p>
          </CardContent>
        </Card>

        {/* Receipts Issued */}
        <Card className="bg-[#1C1E28] border-[#252733] shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#60A5FA] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-[#EEEEF5] uppercase tracking-wider">Receipts Issued</CardTitle>
            <div className="p-2 bg-[#60A5FA]/10 rounded-lg"><Receipt className="h-4 w-4 text-[#60A5FA]" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white">{receiptsIssued}</div>
            <p className="text-xs text-[#737490] mt-1 font-medium">Successfully generated</p>
          </CardContent>
        </Card>

        {/* Total Customers */}
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

        {/* Avg Ticket Size */}
        <Card className="bg-[#1C1E28] border-[#252733] shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#F4C542] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-[#EEEEF5] uppercase tracking-wider">Avg. Ticket Size</CardTitle>
            <div className="p-2 bg-[#F4C542]/10 rounded-lg"><TrendingUp className="h-4 w-4 text-[#F4C542]" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white">{formatCurrency(avgTicket)}</div>
            <p className="text-xs text-[#737490] mt-1 font-medium">Per receipt average</p>
          </CardContent>
        </Card>

      </div>

      {/* Recent Activity Table */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
          {receiptsIssued > 0 && (
            <Link href="/dashboard/receipts" className="text-[#FF6B4A] text-sm font-bold hover:text-[#E05535] flex items-center transition-colors">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          )}
        </div>

        {receiptsIssued === 0 ? (
          <div className="w-full h-48 rounded-2xl border border-dashed border-[#252733] flex flex-col items-center justify-center bg-[#15171F]">
            <div className="w-12 h-12 bg-[#1C1E28] rounded-full flex items-center justify-center mb-3 border border-[#252733]">
              <Receipt className="w-6 h-6 text-[#737490]" />
            </div>
            <p className="text-[#EEEEF5] text-sm font-medium">No receipts generated yet.</p>
            <Link href="/dashboard/receipts/new" className="mt-3 text-[#FF6B4A] text-sm font-bold hover:underline">
              Create your first receipt →
            </Link>
          </div>
        ) : (
          <div className="bg-[#1C1E28] border border-[#252733] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#15171F] border-b border-[#252733]">
                    <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-[#737490]">Receipt No.</th>
                    <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-[#737490]">Date</th>
                    <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-[#737490]">Payment</th>
                    <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-[#737490] text-right">Amount</th>
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
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#252733] text-[#EEEEF5]">
                          {receipt.payment_method}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm font-black text-[#FF6B4A] text-right">
                        {formatCurrency(Number(receipt.grand_total))}
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