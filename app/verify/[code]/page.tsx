'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { ShieldCheck, XCircle, CheckCircle, Calendar, Store, CreditCard, ShoppingBag, Receipt } from 'lucide-react'
import Link from 'next/link'

export default function VerifyReceiptPage() {
  const params = useParams()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [isValid, setIsValid] = useState(false)
  const [receipt, setReceipt] = useState<any>(null)

  useEffect(() => {
    async function verifyCode() {
      if (!params.code) return setLoading(false)

      const { data, error } = await supabase
        .from('receipts')
        .select('*, businesses(*), receipt_items(*)')
        .eq('verification_code', params.code)
        .single()

      if (data && !error) {
        setReceipt(data)
        setIsValid(true)
      } else {
        setIsValid(false)
      }
      
      setLoading(false)
    }

    verifyCode()
  }, [params.code])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1117] flex flex-col items-center justify-center">
        <ShieldCheck className="w-16 h-16 text-[#60A5FA] animate-pulse mb-4" />
        <h2 className="text-[#EEEEF5] font-bold tracking-widest text-sm animate-pulse">VERIFYING BLOCKCHAIN RECORD...</h2>
      </div>
    )
  }

  // ❌ INVALID RECEIPT UI
  if (!isValid) {
    return (
      <div className="min-h-screen bg-[#0F1117] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FB7185] rounded-full blur-[200px] opacity-10 pointer-events-none"></div>
        
        <div className="bg-[#1C1E28] border border-[#FB7185]/30 p-8 rounded-3xl max-w-md w-full text-center shadow-[0_0_50px_rgba(251,113,133,0.1)] relative z-10">
          <div className="w-24 h-24 bg-[#FB7185]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-[#FB7185]" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Invalid Record</h1>
          <p className="text-[#737490] text-sm leading-relaxed mb-8">
            This verification code does not exist in our system. This receipt may be fraudulent or digitally altered.
          </p>
          <Link href="/">
            <button className="w-full bg-[#15171F] border border-[#252733] text-white font-bold py-4 rounded-xl hover:bg-[#252733] transition-all">
              Return to Homepage
            </button>
          </Link>
        </div>
      </div>
    )
  }

  // ✅ VALID RECEIPT UI
  const business = receipt.businesses
  const receiptDate = new Date(receipt.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className="min-h-screen bg-[#0F1117] flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#10B981] rounded-full blur-[250px] opacity-10 pointer-events-none"></div>
      
      <div className="w-full max-w-lg relative z-10">
        
        {/* Verification Badge */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] px-4 py-2 rounded-full flex items-center shadow-[0_0_30px_rgba(16,185,129,0.2)] mb-4">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="font-black text-sm tracking-widest uppercase">Verified Authentic</span>
          </div>
          <p className="text-[#737490] text-xs font-medium tracking-widest uppercase">Secured by Receipta</p>
        </div>

        {/* The Digital Card */}
        <div className="bg-[#1C1E28] border border-[#252733] rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-[#15171F] border-b border-[#252733] p-6 text-center">
             {business.logo_url ? (
               <img src={business.logo_url} alt="Logo" className="w-16 h-16 object-cover rounded-2xl mx-auto mb-3 border border-[#252733]" />
             ) : (
               <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B4A] to-[#E05535] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                 <Store className="w-8 h-8 text-white" />
               </div>
             )}
             <h2 className="text-xl font-black text-white tracking-tight">{business.business_name}</h2>
             <p className="text-[#737490] text-xs font-medium mt-1">{business.business_email || business.business_phone}</p>
          </div>

          {/* Core Details */}
          <div className="p-6 space-y-4">
            
            <div className="bg-[#0F1117] border border-[#252733] p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center text-[#EEEEF5]">
                <CreditCard className="w-5 h-5 mr-3 text-[#FF6B4A]" />
                <span className="text-sm font-bold uppercase tracking-wider">Total Paid</span>
              </div>
              <span className="text-xl font-black text-[#10B981]">{business.currency || '₦'}{Number(receipt.grand_total).toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0F1117] border border-[#252733] p-4 rounded-2xl">
                <p className="text-[#737490] text-[10px] uppercase font-bold tracking-widest mb-1 flex items-center"><Calendar className="w-3 h-3 mr-1"/> Date Issued</p>
                <p className="text-[#EEEEF5] text-xs font-bold leading-tight">{receiptDate}</p>
              </div>
              <div className="bg-[#0F1117] border border-[#252733] p-4 rounded-2xl">
                <p className="text-[#737490] text-[10px] uppercase font-bold tracking-widest mb-1 flex items-center"><Receipt className="w-3 h-3 mr-1"/> Receipt No.</p>
                <p className="text-[#EEEEF5] text-sm font-mono font-bold">{receipt.receipt_number}</p>
              </div>
            </div>

            <div className="bg-[#0F1117] border border-[#252733] p-4 rounded-2xl">
              <p className="text-[#737490] text-[10px] uppercase font-bold tracking-widest mb-3 flex items-center"><ShoppingBag className="w-3 h-3 mr-1"/> Items Purchased</p>
              <div className="space-y-3">
                {receipt.receipt_items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-start border-b border-[#252733]/50 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="text-[#EEEEF5] text-sm font-bold">{item.item_name}</p>
                      <p className="text-[#737490] text-[10px] font-medium mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-[#EEEEF5] text-sm font-mono font-bold">{business.currency || '₦'}{Number(item.total_price).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="bg-[#15171F] p-4 text-center border-t border-[#252733]">
             <p className="text-[#737490] text-[10px] uppercase font-bold tracking-widest">
               Verification Code: <span className="text-white font-mono">{receipt.verification_code}</span>
             </p>
          </div>

        </div>
        
      </div>
    </div>
  )
}