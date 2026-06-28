
'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { ShieldCheck, XCircle, CheckCircle, Calendar, Store, CreditCard, ShoppingBag, Receipt, ArrowLeft, Search } from 'lucide-react'
import Link from 'next/link'

function VerifyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()
  
  // Reads the code from the URL (e.g. receipta.cv/verify?code=RCP-123)
  const queryCode = searchParams.get('code')

  const [inputCode, setInputCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [isValid, setIsValid] = useState<boolean | null>(null) // null = Search mode
  const [receipt, setReceipt] = useState<any>(null)

  useEffect(() => {
    async function verifyCode() {
      // If there's no code in the URL, stay on the Search UI
      if (!queryCode) {
        setIsValid(null)
        setReceipt(null)
        setLoading(false)
        return
      }

      setLoading(true)
      const { data, error } = await supabase
        .from('receipts')
        .select('*, businesses(*), receipt_items(*)')
        .eq('verification_code', queryCode)
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
  }, [queryCode, supabase])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputCode.trim()) {
      // This updates the URL without leaving the page, triggering the database search
      router.push(`/verify?code=${inputCode.trim()}`)
    }
  }

  const getFormattedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  // ⏳ 1. LOADING UI
  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090F] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#00C896] rounded-full blur-[200px] opacity-[0.12] pointer-events-none"></div>
        <ShieldCheck className="w-16 h-16 text-[#00C896] animate-pulse mb-6 relative z-10" />
        <h2 className="text-[#8B92A6] font-bold tracking-[0.2em] text-sm uppercase animate-pulse relative z-10">
          Scanning Secure Database...
        </h2>
      </div>
    )
  }

  // ❌ 2. INVALID RECEIPT UI
  if (isValid === false) {
    return (
      <div className="min-h-screen bg-[#07090F] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FB7185] rounded-full blur-[250px] opacity-[0.15] pointer-events-none"></div>
        
        <div className="bg-[#11141B] border border-[#FB7185]/30 p-10 rounded-[2rem] max-w-md w-full text-center shadow-[0_0_50px_rgba(251,113,133,0.1)] relative z-10">
          <div className="w-24 h-24 bg-[#FB7185]/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <XCircle className="w-12 h-12 text-[#FB7185]" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3 tracking-tight">Invalid Record</h1>
          <p className="text-[#8B92A6] text-sm leading-relaxed mb-8">
            This verification code does not exist in our system. This receipt may be fraudulent, mistyped, or digitally altered.
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={() => router.push('/verify')} className="w-full bg-[#FB7185] text-[#07090F] font-black py-4 rounded-xl hover:bg-white transition-all">
              TRY ANOTHER CODE
            </button>
            <Link href="/" className="w-full bg-[#161B24] border border-[#232838] text-white font-bold py-4 rounded-xl hover:bg-[#1E2430] transition-all flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ✅ 3. VALID RECEIPT UI
  if (isValid === true && receipt) {
    const business = receipt.businesses
    return (
      <div className="min-h-screen bg-[#07090F] flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden font-sans">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00C896] rounded-full blur-[250px] opacity-[0.12] pointer-events-none"></div>
        
        <div className="w-full max-w-lg relative z-10 fade-up" style={{ animation: 'fadeUp 0.6s ease-out both' }}>
          <style>{`@keyframes fadeUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }`}</style>

          <div className="flex flex-col items-center mb-8">
            <div className="bg-[#00C896]/10 border border-[#00C896]/30 text-[#00C896] px-5 py-2.5 rounded-full flex items-center shadow-[0_0_30px_rgba(0,200,150,0.2)] mb-3">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-black text-sm tracking-widest uppercase">Verified Authentic</span>
            </div>
            <p className="text-[#5C6478] text-xs font-bold tracking-[0.2em] uppercase">Secured by Receipta Matrix</p>
          </div>

          <div className="bg-[#11141B] border border-[#232838] rounded-[2rem] shadow-2xl overflow-hidden">
            <div className="bg-[#161B24]/80 border-b border-[#232838] p-8 text-center relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00C896]/10 to-transparent rounded-bl-full pointer-events-none"></div>
               {business?.logo_url ? (
                 <img src={business.logo_url} alt="Business Logo" className="w-16 h-16 object-cover rounded-2xl mx-auto mb-4 border border-[#232838] shadow-lg relative z-10" />
               ) : (
                 <div className="w-16 h-16 bg-gradient-to-br from-[#00C896] to-[#047857] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_10px_20px_-5px_rgba(0,200,150,0.3)] relative z-10">
                   <Store className="w-8 h-8 text-[#07090F]" />
                 </div>
               )}
               <h2 className="text-2xl font-black text-white tracking-tight relative z-10">{business?.business_name || 'Unknown Business'}</h2>
               <p className="text-[#8B92A6] text-sm font-medium mt-1 relative z-10">{business?.business_email || business?.business_phone}</p>
            </div>

            <div className="p-8 space-y-4">
              <div className="bg-[#07090F] border border-[#232838] p-5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center text-[#A8AFC0]">
                  <CreditCard className="w-5 h-5 mr-3 text-[#00C896]" />
                  <span className="text-sm font-bold uppercase tracking-wider">Total Paid</span>
                </div>
                <span className="text-2xl font-black text-white">
                  {business?.currency || '₦'}{Number(receipt.grand_total).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#07090F] border border-[#232838] p-4 rounded-2xl">
                  <p className="text-[#5C6478] text-[10px] uppercase font-bold tracking-widest mb-2 flex items-center"><Calendar className="w-3 h-3 mr-1.5 text-[#00C896]"/> Date Issued</p>
                  <p className="text-white text-sm font-bold leading-tight">{getFormattedDate(receipt.created_at)}</p>
                </div>
                <div className="bg-[#07090F] border border-[#232838] p-4 rounded-2xl">
                  <p className="text-[#5C6478] text-[10px] uppercase font-bold tracking-widest mb-2 flex items-center"><Receipt className="w-3 h-3 mr-1.5 text-[#00C896]"/> Receipt No.</p>
                  <p className="text-white text-sm font-mono font-bold truncate">{receipt.receipt_number}</p>
                </div>
              </div>

              <div className="bg-[#07090F] border border-[#232838] p-5 rounded-2xl">
                <p className="text-[#5C6478] text-[10px] uppercase font-bold tracking-widest mb-4 flex items-center"><ShoppingBag className="w-3 h-3 mr-1.5 text-[#00C896]"/> Items Purchased</p>
                <div className="space-y-4">
                  {receipt.receipt_items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-start border-b border-[#232838]/50 pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="text-white text-sm font-bold">{item.item_name}</p>
                        <p className="text-[#8B92A6] text-xs font-medium mt-1 bg-[#161B24] inline-block px-2 py-0.5 rounded-md">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-white text-sm font-mono font-bold">
                        {business?.currency || '₦'}{Number(item.total_price).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-[#161B24] p-5 flex flex-col items-center justify-center border-t border-[#232838]">
               <p className="text-[#5C6478] text-[10px] uppercase font-bold tracking-widest mb-1">Unique Verification Code</p>
               <p className="text-[#00C896] font-mono font-bold tracking-widest text-lg bg-[#00C896]/10 px-4 py-1 rounded-lg border border-[#00C896]/20">
                 {receipt.verification_code}
               </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4">
            <button onClick={() => router.push('/verify')} className="text-[#00C896] text-sm font-bold hover:text-white transition-colors">
              Verify Another Receipt
            </button>
            <Link href="/" className="inline-flex items-center text-[#5C6478] text-xs font-bold hover:text-[#8B92A6] transition-colors">
              <ArrowLeft className="w-3 h-3 mr-2" /> Powered by Receipta
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // 🔍 4. DEFAULT SEARCH UI (Shown when someone visits /verify directly)
  return (
    <div className="min-h-screen bg-[#07090F] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00C896] rounded-full blur-[250px] opacity-[0.12] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 fade-up" style={{ animation: 'fadeUp 0.6s ease-out both' }}>
        <style>{`@keyframes fadeUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }`}</style>

        <Link href="/" className="inline-flex items-center text-[#8B92A6] hover:text-white transition-colors mb-8 text-sm font-bold">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Homepage
        </Link>

        <div className="bg-[#11141B] border border-[#232838] p-8 md:p-10 rounded-[2rem] shadow-2xl">
          <div className="w-16 h-16 bg-[#00C896]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#00C896]/20 shadow-inner">
            <ShieldCheck className="w-8 h-8 text-[#00C896]" />
          </div>
          
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Verification Portal</h1>
          <p className="text-[#8B92A6] text-sm mb-8 leading-relaxed">
            Enter a unique receipt ID to securely verify a transaction on the Receipta network.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5C6478]" />
              <input 
                type="text" 
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="e.g. RCP-12345" 
                className="w-full bg-[#161B24] border border-[#232838] text-white text-sm rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-[#00C896] transition-colors placeholder:text-[#5C6478]"
                required
              />
            </div>
            <button type="submit" className="w-full py-4 bg-[#00C896] text-[#07090F] font-black rounded-xl hover:bg-[#5EEAD4] transition-all flex items-center justify-center shadow-[0_10px_20px_-5px_rgba(0,200,150,0.3)]">
              VERIFY RECORD
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// Next.js requires useSearchParams to be wrapped in Suspense for production builds
export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#07090F] flex flex-col items-center justify-center">
        <ShieldCheck className="w-12 h-12 text-[#00C896] animate-pulse mb-4" />
        <h2 className="text-[#8B92A6] font-bold tracking-[0.2em] text-xs uppercase animate-pulse">Loading Portal...</h2>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}
