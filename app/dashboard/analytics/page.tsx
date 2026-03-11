'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { BarChart3, TrendingUp, Calendar, Lock, Crown, Activity, CreditCard, Download, TrendingDown, Wallet } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

// Shadcn UI Imports
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AnalyticsPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [business, setBusiness] = useState<any>(null)
  const [receipts, setReceipts] = useState<any[]>([])
  const [expenses, setExpenses] = useState<any[]>([])

  useEffect(() => {
    fetchAnalytics()
  }, [])

  async function fetchAnalytics() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: biz } = await supabase.from('businesses').select('*').eq('user_id', user.id).single()
    
    if (biz) {
      setBusiness(biz)
      
      // ONLY fetch data if they are Premium!
      if (biz.subscription_tier !== 'free') {
        const startOfMonth = new Date()
        startOfMonth.setDate(1)
        startOfMonth.setHours(0, 0, 0, 0)

        // 1. Fetch Receipts (Revenue)
        const { data: receiptData } = await supabase
          .from('receipts')
          .select('grand_total, created_at')
          .eq('business_id', biz.id)
          .gte('created_at', startOfMonth.toISOString())
          .order('created_at', { ascending: true })
        
        if (receiptData) setReceipts(receiptData)

        // 2. Fetch Expenses (Cost)
        const { data: expenseData } = await supabase
          .from('expenses')
          .select('amount, created_at')
          .eq('business_id', biz.id)
          .gte('created_at', startOfMonth.toISOString())
        
        if (expenseData) setExpenses(expenseData)
      }
    }
    setLoading(false)
  }

  // 📥 EXPORT SALES TO CSV ENGINE
  const exportSalesCSV = () => {
    if (receipts.length === 0) {
      toast.error("No sales data to export.")
      return
    }

    const headers = ['Date', 'Time', 'Amount']
    
    const csvRows = receipts.map(r => {
      const dateObj = new Date(r.created_at)
      return [
        `"${dateObj.toLocaleDateString('en-US')}"`,
        `"${dateObj.toLocaleTimeString('en-US')}"`,
        `"${r.grand_total}"`
      ]
    })

    const csvContent = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `receipta_sales_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    
    toast.success("Sales report exported successfully!", {
      style: { background: '#1C1E28', color: '#F4C542', border: '1px solid #252733' }
    })
  }

  if (loading) return <div className="flex items-center justify-center min-h-[50vh] text-[#FF6B4A] animate-pulse font-bold tracking-widest text-sm">CALCULATING ANALYTICS...</div>

  // 🛑 THE PAYWALL UI FOR FREE USERS
  if (business?.subscription_tier === 'free') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#0F1117] rounded-3xl border border-[#252733] shadow-2xl relative overflow-hidden p-6 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF6B4A] rounded-full blur-[200px] opacity-10 pointer-events-none"></div>
        
        <div className="w-20 h-20 bg-[#1C1E28] border border-[#252733] rounded-2xl flex items-center justify-center mb-6 shadow-xl relative">
          <BarChart3 className="w-10 h-10 text-[#737490]" />
          <div className="absolute -bottom-2 -right-2 bg-[#F4C542] p-1.5 rounded-full shadow-lg">
            <Lock className="w-4 h-4 text-black" />
          </div>
        </div>

        <h2 className="text-3xl font-black text-white mb-3 tracking-tight">Advanced Analytics Locked</h2>
        <p className="text-[#737490] max-w-md mb-8 text-sm leading-relaxed">
          Want to know your true profit? Free users don't have access to Revenue & Expense Reports. Upgrade to Premium to unlock visual charts, daily sales summaries, and profit metrics.
        </p>

        <Link href="/dashboard/upgrade">
          <Button className="h-14 px-8 bg-gradient-to-r from-[#FF6B4A] to-[#E05535] text-white hover:opacity-90 font-bold text-base rounded-xl shadow-[0_0_20px_rgba(255,107,74,0.3)] transition-all flex items-center">
            <Crown className="w-5 h-5 mr-2" />
            UNLOCK PREMIUM ANALYTICS
          </Button>
        </Link>
      </div>
    )
  }

  // 🧮 MATH ENGINE FOR PREMIUM USERS (Revenue vs Expenses)
  const totalRevenue = receipts.reduce((sum, r) => sum + Number(r.grand_total), 0)
  const totalSalesCount = receipts.length
  
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const netProfit = totalRevenue - totalExpenses

  // 📊 BUILDING THE CUSTOM CSS CHART (Grouping Revenue by Day)
  const dailyData: Record<string, number> = {}
  receipts.forEach(r => {
    const date = new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    dailyData[date] = (dailyData[date] || 0) + Number(r.grand_total)
  })

  const chartLabels = Object.keys(dailyData).slice(-7)
  const chartValues = Object.values(dailyData).slice(-7)
  const maxChartValue = Math.max(...chartValues, 1)

  return (
    <div className="min-h-full bg-[#0F1117] rounded-3xl border border-[#252733] shadow-2xl relative overflow-hidden pb-10">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF6B4A] rounded-full blur-[150px] opacity-5 pointer-events-none"></div>

      <div className="relative z-10 p-4 md:p-8 space-y-8">
        
        {/* Header */}
        <div className="border-b border-[#252733] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Revenue Analytics</h1>
            <p className="text-[#737490] mt-1 text-sm font-medium">Your daily sales and profit performance.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
             <Button onClick={exportSalesCSV} variant="outline" className="h-10 border-[#F4C542]/30 text-[#F4C542] hover:bg-[#F4C542]/10 hover:text-[#F4C542] transition-all flex items-center bg-[#1C1E28]">
               <Download className="w-4 h-4 mr-2" />
               Export Report
             </Button>

             <div className="px-4 py-2 bg-[#1C1E28] border border-[#FF6B4A]/30 rounded-lg flex items-center h-10">
                <Crown className="w-4 h-4 text-[#F4C542] mr-2" />
                <span className="text-white font-bold text-sm">Premium Feature</span>
             </div>
          </div>
        </div>

        {/* 🏆 TOP PROFIT CARD */}
        <Card className="bg-gradient-to-br from-[#1C1E28] to-[#15171F] border border-[#10B981]/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <p className="text-[#10B981] text-xs font-black uppercase tracking-widest mb-2 flex items-center">
                  <Wallet className="w-4 h-4 mr-1.5" /> Net Profit (This Month)
                </p>
                <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                  {business?.currency || '₦'}{netProfit.toLocaleString()}
                </h3>
              </div>
              <div className="flex gap-4">
                 <div className="bg-[#1C1E28] border border-[#252733] px-4 py-3 rounded-xl">
                    <p className="text-[10px] text-[#737490] uppercase font-bold tracking-wider mb-1">Money In</p>
                    <p className="text-[#60A5FA] font-bold">{business?.currency || '₦'}{totalRevenue.toLocaleString()}</p>
                 </div>
                 <div className="bg-[#1C1E28] border border-[#252733] px-4 py-3 rounded-xl">
                    <p className="text-[10px] text-[#737490] uppercase font-bold tracking-wider mb-1">Money Out</p>
                    <p className="text-[#FB7185] font-bold">{business?.currency || '₦'}{totalExpenses.toLocaleString()}</p>
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Secondary Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-[#1C1E28] border-[#252733] shadow-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#737490] text-xs font-bold uppercase tracking-wider mb-1">Total Sales Count</p>
                  <h3 className="text-3xl font-black text-white">{totalSalesCount} <span className="text-lg text-[#737490] font-medium">receipts</span></h3>
                </div>
                <div className="p-3 bg-[#60A5FA]/10 rounded-xl"><Activity className="w-6 h-6 text-[#60A5FA]" /></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1C1E28] border-[#252733] shadow-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#737490] text-xs font-bold uppercase tracking-wider mb-1">Total Expenses Logged</p>
                  <h3 className="text-3xl font-black text-white">{expenses.length} <span className="text-lg text-[#737490] font-medium">records</span></h3>
                </div>
                <div className="p-3 bg-[#FB7185]/10 rounded-xl"><TrendingDown className="w-6 h-6 text-[#FB7185]" /></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Beautiful Custom CSS Chart */}
        <Card className="bg-[#1C1E28] border-[#252733] shadow-xl overflow-hidden">
          <CardHeader className="bg-[#15171F] border-b border-[#252733] pb-4">
            <CardTitle className="flex items-center text-white text-lg">
              <BarChart3 className="w-5 h-5 text-[#FF6B4A] mr-3" />
              7-Day Sales Trend (Revenue)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            
            {chartLabels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-[#737490]">
                <Calendar className="w-12 h-12 mb-4 opacity-20" />
                <p>No sales data to display yet.</p>
              </div>
            ) : (
              <div className="h-64 flex items-end gap-2 sm:gap-4 pt-6">
                {chartLabels.map((label, index) => {
                  const value = chartValues[index]
                  // Calculate height percentage relative to the highest day
                  const heightPercent = Math.max((value / maxChartValue) * 100, 5) 

                  return (
                    <div key={label} className="flex-1 flex flex-col items-center group">
                      {/* Tooltip (Shows on hover) */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#15171F] text-white text-xs py-1 px-2 rounded border border-[#252733] mb-2 pointer-events-none whitespace-nowrap z-10">
                        {business?.currency || '₦'}{value.toLocaleString()}
                      </div>
                      
                      {/* The Bar */}
                      <div 
                        className="w-full bg-gradient-to-t from-[#FF6B4A]/40 to-[#FF6B4A] rounded-t-md transition-all duration-500 hover:opacity-80 relative"
                        style={{ height: `${heightPercent}%` }}
                      ></div>
                      
                      {/* X-Axis Label */}
                      <span className="text-[10px] text-[#737490] mt-3 font-bold uppercase truncate max-w-full px-1">{label}</span>
                    </div>
                  )
                })}
              </div>
            )}
            
          </CardContent>
        </Card>

      </div>
    </div>
  )
}