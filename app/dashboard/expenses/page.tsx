'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'react-hot-toast'
import { Wallet, Plus, Trash2, TrendingDown, Lock, Crown, Calendar } from 'lucide-react'
import Link from 'next/link'

// Shadcn UI Imports
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function ExpensesPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [business, setBusiness] = useState<any>(null)
  const [expenses, setExpenses] = useState<any[]>([])

  const [newExpense, setNewExpense] = useState({ description: '', amount: '' })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: biz } = await supabase.from('businesses').select('*').eq('user_id', user.id).single()
    if (biz) {
      setBusiness(biz)
      
      // ONLY fetch expenses if Premium!
      if (biz.subscription_tier !== 'free') {
        const { data: expenseData } = await supabase
          .from('expenses')
          .select('*')
          .eq('business_id', biz.id)
          .order('created_at', { ascending: false })
        
        if (expenseData) setExpenses(expenseData)
      }
    }
    setLoading(false)
  }

  async function handleAddExpense(e: React.FormEvent) {
    e.preventDefault()
    if (!newExpense.description || !newExpense.amount) return toast.error("Please fill all fields")

    setSaving(true)
    try {
      const { data, error } = await supabase.from('expenses').insert({
        business_id: business.id,
        description: newExpense.description,
        amount: Number(newExpense.amount)
      }).select().single()

      if (error) throw error

      toast.success('Expense logged successfully! 📉', { 
        style: { background: '#1C1E28', color: '#FB7185', border: '1px solid #252733' } 
      })
      
      setExpenses([data, ...expenses])
      setNewExpense({ description: '', amount: '' })
    } catch (error: any) {
      toast.error(error.message || "Failed to add expense")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this expense record?")) return
    try {
      const { error } = await supabase.from('expenses').delete().eq('id', id)
      if (error) throw error
      setExpenses(expenses.filter(e => e.id !== id))
      toast.success("Expense deleted.")
    } catch (error: any) {
      toast.error("Failed to delete expense.")
    }
  }

  const inputTheme = "bg-[#15171F] border-[#252733] text-[#EEEEF5] placeholder:text-[#737490] focus-visible:ring-[#FB7185] focus-visible:border-[#FB7185] h-11"
  const labelTheme = "text-[11px] font-bold text-[#EEEEF5] uppercase tracking-wider mb-1.5 block"

  if (loading) return <div className="flex items-center justify-center min-h-[50vh] text-[#FF6B4A] animate-pulse font-bold tracking-widest text-sm">LOADING EXPENSES...</div>

  // 🛑 THE PAYWALL UI FOR FREE USERS
  if (business?.subscription_tier === 'free') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#0F1117] rounded-3xl border border-[#252733] shadow-2xl relative overflow-hidden p-6 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FB7185] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
        
        <div className="w-20 h-20 bg-[#1C1E28] border border-[#252733] rounded-2xl flex items-center justify-center mb-6 shadow-xl relative">
          <Wallet className="w-10 h-10 text-[#737490]" />
          <div className="absolute -bottom-2 -right-2 bg-[#F4C542] p-1.5 rounded-full shadow-lg">
            <Crown className="w-4 h-4 text-black" />
          </div>
        </div>

        <h2 className="text-3xl font-black text-white mb-3 tracking-tight">Expense Tracker Locked</h2>
        <p className="text-[#737490] max-w-md mb-8 text-sm leading-relaxed">
          Free users can only track revenue. Upgrade to Premium for <b>₦12,000/year</b> to track your daily business expenses and calculate your true Net Profit.
        </p>

        <Link href="/dashboard/upgrade">
          <Button className="h-14 px-8 bg-gradient-to-r from-[#FF6B4A] to-[#E05535] text-white hover:opacity-90 font-bold text-base rounded-xl shadow-[0_0_20px_rgba(255,107,74,0.3)] transition-all flex items-center">
            <Crown className="w-5 h-5 mr-2" />
            UNLOCK PREMIUM TRACKER
          </Button>
        </Link>
      </div>
    )
  }

  // 🧮 MATH ENGINE
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0)

  // ✅ FULL UI FOR PREMIUM USERS
  return (
    <div className="min-h-full bg-[#0F1117] rounded-3xl border border-[#252733] shadow-2xl relative overflow-hidden pb-10">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FB7185] rounded-full blur-[150px] opacity-5 pointer-events-none"></div>

      <div className="relative z-10 p-4 md:p-8 space-y-8">
        
        {/* Header */}
        <div className="border-b border-[#252733] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Expense Tracker</h1>
            <p className="text-[#737490] mt-1 text-sm font-medium">Log your daily spending to calculate your net profit.</p>
          </div>
          <div className="flex items-center gap-2 bg-[#1C1E28] border border-[#FB7185]/30 px-4 py-2 rounded-xl">
            <TrendingDown className="w-5 h-5 text-[#FB7185]" />
            <span className="text-white font-bold text-lg">
               {business?.currency || '₦'}{totalExpenses.toLocaleString()} <span className="text-[#737490] font-medium text-xs uppercase ml-1">Total Spent</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Add New Expense Form */}
          <div className="xl:col-span-1">
            <Card className="bg-[#1C1E28] border-[#252733] shadow-xl overflow-hidden sticky top-8">
              <CardHeader className="bg-[#15171F] border-b border-[#252733] pb-4">
                <CardTitle className="flex items-center text-white text-lg">
                  <div className="p-2 bg-[#FB7185]/10 rounded-lg mr-3"><Wallet className="w-5 h-5 text-[#FB7185]" /></div>
                  Log New Expense
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleAddExpense} className="space-y-5">
                  <div>
                    <Label className={labelTheme}>Description <span className="text-[#FB7185]">*</span></Label>
                    <Input required placeholder="e.g. Fuel, Transport, Adverts" className={inputTheme} value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} />
                  </div>
                  <div>
                    <Label className={labelTheme}>Amount ({business?.currency || '₦'}) <span className="text-[#FB7185]">*</span></Label>
                    <Input required type="number" min="0" placeholder="e.g. 5000" className={inputTheme} value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} />
                  </div>
                  
                  <Button type="submit" disabled={saving} className="w-full h-12 mt-2 bg-[#FB7185] hover:bg-[#E11D48] text-white font-bold rounded-xl shadow-[0_0_15px_rgba(251,113,133,0.2)] transition-all">
                    <Plus className="w-4 h-4 mr-2" />
                    {saving ? 'SAVING...' : 'LOG EXPENSE'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Expenses List */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-[#1C1E28] border border-[#252733] rounded-2xl overflow-hidden shadow-xl">
              {expenses.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center bg-[#15171F]">
                  <Wallet className="w-12 h-12 text-[#737490] mb-4 opacity-20" />
                  <h3 className="text-white font-bold text-lg">No expenses logged</h3>
                  <p className="text-[#737490] text-sm mt-1">Start tracking your spending to see your true profit.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#252733]">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="p-4 md:p-6 flex items-center justify-between gap-4 hover:bg-[#15171F]/50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FB7185]/20 to-[#FB7185]/5 border border-[#FB7185]/20 flex items-center justify-center text-[#FB7185]">
                          <TrendingDown className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-base">{expense.description}</h4>
                          <div className="text-[10px] font-bold text-[#737490] uppercase tracking-wider mt-1 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(expense.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                         <div className="text-base font-black text-[#FB7185]">
                            - {business?.currency || '₦'}{Number(expense.amount).toLocaleString()}
                         </div>
                         <button 
                           onClick={() => handleDelete(expense.id)}
                           className="p-2 rounded-lg text-[#737490] hover:bg-[#FB7185]/10 hover:text-[#FB7185] transition-colors"
                           title="Delete"
                         >
                           <Trash2 className="w-5 h-5" />
                         </button>
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