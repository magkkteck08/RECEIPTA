import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Receipt, Users, Settings, Store, BarChart3, Package, Wallet, MessageSquarePlus, LogOut } from 'lucide-react'
import { logout } from '@/app/login/actions'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 🛑 THE FIX: Use maybeSingle() instead of single()
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  // 🛑 THE ENFORCER: If no business profile exists, redirect to setup
  if (!business) {
    redirect('/setup')
  }

  return (
    <div className="flex h-screen bg-[#0F1117] text-[#EEEEF5] overflow-hidden selection:bg-[#FF6B4A] selection:text-[#0F1117]">
      
      {/* 🖥️ DESKTOP SIDEBAR */}
      <aside className="w-64 bg-[#1C1E28] border-r border-[#252733] hidden md:flex flex-col justify-between z-20 shadow-2xl relative">
        {/* Subtle Side Glow */}
        <div className="absolute top-0 left-0 w-1 bg-gradient-to-b from-[#FF6B4A] to-transparent h-full opacity-20"></div>

        <div>
          {/* Logo Area */}
          <div className="h-[72px] flex items-center px-6 border-b border-[#252733] bg-[#15171F]">
            {business?.logo_url ? (
              <img src={business.logo_url} alt="Logo" className="h-9 w-9 object-cover rounded-xl border border-[#252733]" />
            ) : (
              <div className="h-9 w-9 bg-gradient-to-br from-[#FF6B4A] to-[#E05535] rounded-xl flex items-center justify-center text-[#0F1117] font-black shadow-[0_0_15px_rgba(110,231,183,0.3)]">
                {business?.business_name?.charAt(0) || <Store className="w-5 h-5" />}
              </div>
            )}
            <span className="ml-3 font-black text-lg truncate text-white tracking-tight">
              {business?.business_name || 'Receipta'}
            </span>
          </div>
          
          {/* Desktop Nav Links */}
          <nav className="p-4 space-y-2 mt-2 flex flex-col h-[calc(100vh-160px)] overflow-y-auto scrollbar-hide">
            <Link href="/dashboard" className="flex items-center px-4 py-3.5 rounded-xl bg-[#FF6B4A]/10 text-[#FF6B4A] font-bold border border-[#FF6B4A]/20 transition-all shadow-[0_0_15px_rgba(110,231,183,0.05)] hover:shadow-[0_0_20px_rgba(110,231,183,0.1)]">
              <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
            </Link>
            
            <Link href="/dashboard/receipts" className="flex items-center px-4 py-3.5 rounded-xl text-[#EEEEF5] hover:bg-[#15171F] hover:text-white transition-colors font-medium">
              <Receipt className="w-5 h-5 mr-3" /> Receipts
            </Link>

            {/* 📦 INVENTORY LINK WITH PRO BADGE */}
            <Link href="/dashboard/products" className="flex items-center justify-between px-4 py-3.5 rounded-xl text-[#EEEEF5] hover:bg-[#15171F] hover:text-white transition-colors font-medium">
              <div className="flex items-center">
                <Package className="w-5 h-5 mr-3" /> Inventory
              </div>
              <span className="text-[9px] font-bold tracking-widest bg-[#F4C542]/20 text-[#F4C542] px-2 py-0.5 rounded-md border border-[#F4C542]/30 uppercase">Pro</span>
            </Link>

            {/* 👑 CUSTOMERS LINK WITH PRO BADGE */}
            <Link href="/dashboard/customers" className="flex items-center justify-between px-4 py-3.5 rounded-xl text-[#EEEEF5] hover:bg-[#15171F] hover:text-white transition-colors font-medium">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-3" /> Customers
              </div>
              <span className="text-[9px] font-bold tracking-widest bg-[#F4C542]/20 text-[#F4C542] px-2 py-0.5 rounded-md border border-[#F4C542]/30 uppercase">Pro</span>
            </Link>

            {/* 💸 NEW EXPENSES LINK WITH PRO BADGE */}
            <Link href="/dashboard/expenses" className="flex items-center justify-between px-4 py-3.5 rounded-xl text-[#EEEEF5] hover:bg-[#15171F] hover:text-white transition-colors font-medium">
              <div className="flex items-center">
                <Wallet className="w-5 h-5 mr-3" /> Expenses
              </div>
              <span className="text-[9px] font-bold tracking-widest bg-[#F4C542]/20 text-[#F4C542] px-2 py-0.5 rounded-md border border-[#F4C542]/30 uppercase">Pro</span>
            </Link>
            
            {/* 📈 ANALYTICS LINK WITH PRO BADGE */}
            <Link href="/dashboard/analytics" className="flex items-center justify-between px-4 py-3.5 rounded-xl text-[#EEEEF5] hover:bg-[#15171F] hover:text-white transition-colors font-medium">
              <div className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-3" /> Analytics
              </div>
              <span className="text-[9px] font-bold tracking-widest bg-[#F4C542]/20 text-[#F4C542] px-2 py-0.5 rounded-md border border-[#F4C542]/30 uppercase">Pro</span>
            </Link>
          </nav>
        </div>

        {/* Settings Area */}
        <div className="p-4 border-t border-[#252733] bg-[#15171F]/50 mt-auto">
           <Link href="/dashboard/settings" className="flex items-center px-4 py-3.5 rounded-xl text-[#EEEEF5] hover:bg-[#1C1E28] hover:text-white transition-colors font-medium border border-transparent hover:border-[#252733]">
              <Settings className="w-5 h-5 mr-3" /> System Settings
           </Link>
        </div>
      </aside>

      {/* 📱 MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Mobile Top Header */}
        <header className="md:hidden h-[72px] bg-[#1C1E28] border-b border-[#252733] flex items-center px-4 justify-between z-10 shrink-0 shadow-lg">
          <div className="flex items-center">
             {business?.logo_url ? (
              <img src={business.logo_url} alt="Logo" className="h-9 w-9 object-cover rounded-xl border border-[#252733]" />
            ) : (
              <div className="h-9 w-9 bg-gradient-to-br from-[#FF6B4A] to-[#E05535] rounded-xl flex items-center justify-center text-[#0F1117] font-black">
                {business?.business_name?.charAt(0) || <Store className="w-5 h-5" />}
              </div>
            )}
            <span className="ml-3 font-black text-lg truncate text-white">
              {business?.business_name || 'Receipta'}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
             {/* ⚙️ MOBILE SETTINGS BUTTON */}
             <Link href="/dashboard/settings" className="bg-[#15171F] text-[#737490] p-2 rounded-lg border border-[#252733] hover:text-white hover:bg-[#252733] transition-all">
                <Settings className="w-5 h-5" />
             </Link>

             {/* Mobile Feedback Button */}
             <a href="mailto:beta@receipta.com?subject=Beta%20Feedback" className="bg-[#FF6B4A]/10 text-[#FF6B4A] p-2 rounded-lg border border-[#FF6B4A]/20">
                <MessageSquarePlus className="w-5 h-5" />
             </a>

             {/* 🚪 MOBILE LOGOUT BUTTON */}
             <form action={logout}>
               <button type="submit" className="bg-[#FB7185]/10 text-[#FB7185] p-2 rounded-lg border border-[#FB7185]/20 hover:bg-[#FB7185]/20 transition-all">
                  <LogOut className="w-5 h-5" />
               </button>
             </form>
          </div>
        </header>

        {/* Desktop Top Header */}
        <header className="hidden md:flex h-[72px] bg-[#0F1117] border-b border-[#252733] items-center justify-between px-8 z-10 shrink-0">
           
           {/* Desktop Beta Feedback Button */}
           <a href="mailto:beta@receipta.com?subject=Beta%20Feedback" className="flex items-center text-xs font-bold text-[#FF6B4A] bg-[#FF6B4A]/10 border border-[#FF6B4A]/20 px-4 py-2 rounded-lg hover:bg-[#FF6B4A]/20 transition-all">
              <MessageSquarePlus className="w-4 h-4 mr-2" />
              Give Beta Feedback
           </a>

           <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-[#FF6B4A] animate-pulse shadow-[0_0_10px_#FF6B4A]"></div>
               <span className="text-xs font-bold text-[#EEEEF5] tracking-wider uppercase border border-[#252733] bg-[#1C1E28] px-4 py-2 rounded-lg">
                 {user.email}
               </span>
             </div>
             {/* 🚪 DESKTOP LOGOUT BUTTON */}
             <form action={logout}>
               <button type="submit" className="flex items-center text-xs font-bold text-[#FB7185] bg-[#FB7185]/10 border border-[#FB7185]/20 px-4 py-2 rounded-lg hover:bg-[#FB7185]/20 transition-all">
                 <LogOut className="w-4 h-4 mr-2" /> Sign Out
               </button>
             </form>
           </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 relative">
          <div className="max-w-6xl mx-auto h-full">
            {children}
          </div>
        </div>

        {/* 📱 MOBILE BOTTOM NAV */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1C1E28] border-t border-[#252733] flex justify-between items-center h-[72px] px-2 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md bg-opacity-95 overflow-x-auto gap-2 scrollbar-hide">
           
           <Link href="/dashboard" className="flex flex-col items-center p-2 text-[#FF6B4A] min-w-[50px]">
              <LayoutDashboard className="w-5 h-5 mb-1" />
              <span className="text-[9px] font-bold tracking-wide">Home</span>
           </Link>
           
           <Link href="/dashboard/receipts" className="flex flex-col items-center p-2 text-[#737490] hover:text-white transition-colors min-w-[50px]">
              <Receipt className="w-5 h-5 mb-1" />
              <span className="text-[9px] font-bold tracking-wide">Receipts</span>
           </Link>

           <Link href="/dashboard/products" className="flex flex-col items-center p-2 text-[#737490] hover:text-white transition-colors relative min-w-[50px]">
              <Package className="w-5 h-5 mb-1" />
              <span className="text-[9px] font-bold tracking-wide">Items</span>
              <div className="absolute top-1 right-2 w-1.5 h-1.5 bg-[#F4C542] rounded-full"></div>
           </Link>

           {/* 👑 NEW MOBILE CUSTOMERS LINK */}
           <Link href="/dashboard/customers" className="flex flex-col items-center p-2 text-[#737490] hover:text-white transition-colors relative min-w-[50px]">
              <Users className="w-5 h-5 mb-1" />
              <span className="text-[9px] font-bold tracking-wide">Clients</span>
              <div className="absolute top-1 right-2 w-1.5 h-1.5 bg-[#F4C542] rounded-full"></div>
           </Link>

           <Link href="/dashboard/expenses" className="flex flex-col items-center p-2 text-[#737490] hover:text-white transition-colors relative min-w-[50px]">
              <Wallet className="w-5 h-5 mb-1" />
              <span className="text-[9px] font-bold tracking-wide">Spend</span>
              <div className="absolute top-1 right-2 w-1.5 h-1.5 bg-[#F4C542] rounded-full"></div>
           </Link>
           
           <Link href="/dashboard/analytics" className="flex flex-col items-center p-2 text-[#737490] hover:text-white transition-colors relative min-w-[50px]">
              <BarChart3 className="w-5 h-5 mb-1" />
              <span className="text-[9px] font-bold tracking-wide">Stats</span>
              <div className="absolute top-1 right-2 w-1.5 h-1.5 bg-[#F4C542] rounded-full"></div>
           </Link>
        </nav>
      </main>
    </div>
  )
}