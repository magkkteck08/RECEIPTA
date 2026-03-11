'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'react-hot-toast'
import { Printer, ArrowLeft, ShieldCheck, QrCode, Download, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import html2canvas from 'html2canvas-pro'

export default function ReceiptPreview() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  
  const [receipt, setReceipt] = useState<any>(null)
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  
  const receiptRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchReceipt() {
      // 1. Fetch Receipt & Business Data
      const { data: receiptData, error } = await supabase
        .from('receipts')
        .select('*, businesses (*), receipt_items (*)')
        .eq('id', params.id)
        .single()

      if (error || !receiptData) {
        toast.error("Receipt not found")
        router.push('/dashboard')
        return
      }
      setReceipt(receiptData)

      // 2. Fetch Customer Data (if a customer_id exists)
      if (receiptData.customer_id) {
         const { data: customerData } = await supabase
           .from('customers')
           .select('*')
           .eq('id', receiptData.customer_id)
           .single()
         
         if (customerData) setCustomer(customerData)
      }

      setLoading(false)
    }
    fetchReceipt()
  }, [params.id, router, supabase])

  const handlePrint = () => window.print()

  // 🚀 THE VIRAL WHATSAPP ENGINE
  const handleWhatsApp = () => {
    const businessName = receipt?.businesses?.business_name
    const currency = receipt?.businesses?.currency || '₦'
    const amount = `${currency}${Number(receipt?.grand_total).toLocaleString()}`
    const verifyCode = receipt?.verification_code
    
    // We will use the verify portal URL for the link
    const verifyUrl = `${window.location.origin}/verify/${verifyCode}`
    
    const message = `*Receipt from ${businessName}* 🧾\n\nHello! 👋\nThank you for your purchase of *${amount}*.\n\nYou can view, download, and verify your official digital receipt here:\n🔗 ${verifyUrl}\n\n_Powered by Receipta_`
    
    // Check if we have the customer's phone number
    let whatsappUrl = ''
    if (customer && customer.customer_phone) {
       let cleanPhone = customer.customer_phone.replace(/\D/g, '')
       if (cleanPhone.startsWith('0')) {
          cleanPhone = '234' + cleanPhone.substring(1)
       }
       whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
    } else {
       whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    }

    window.open(whatsappUrl, '_blank')
  }

  const handleDownloadImage = async () => {
    if (!receiptRef.current) return
    setDownloading(true)
    const toastId = toast.loading('Generating high-res image...')

    try {
      receiptRef.current.classList.add('print-mode-active')
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#FFFFFF', 
        logging: false,
      })
      receiptRef.current.classList.remove('print-mode-active')

      const image = canvas.toDataURL('image/png', 1.0)
      const link = document.createElement('a')
      link.download = `Receipt_${receipt.receipt_number}.png`
      link.href = image
      link.click()

      toast.success('Image saved to your device! 📸', { id: toastId })
    } catch (error) {
      console.error(error)
      toast.error('Failed to generate image.', { id: toastId })
    } finally {
      setDownloading(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-[#FF6B4A] animate-pulse font-bold tracking-widest text-sm flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-[#FF6B4A] border-t-transparent rounded-full animate-spin mb-4"></div>
        FETCHING SECURE INVOICE...
      </div>
    </div>
  )

  const business = receipt.businesses
  const items = receipt.receipt_items
  const brandColor = business.brand_primary_color || '#059669' 

  const receiptDate = new Date(receipt.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className="min-h-full pb-20 font-sans print:bg-white print:pb-0">
      
      {/* 🛑 TOP ACTION BAR */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 print:hidden bg-[#1C1E28] p-4 rounded-2xl border border-[#252733] shadow-lg">
        <Link href="/dashboard/receipts" className="flex items-center text-[#EEEEF5] hover:text-white transition-colors font-bold text-sm bg-[#15171F] px-4 py-2 rounded-xl border border-[#252733]">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Link>
        
        <div className="flex flex-wrap justify-center sm:justify-end gap-3 w-full md:w-auto">
          {/* ✨ SMART WHATSAPP BUTTON ✨ */}
          <button onClick={handleWhatsApp} className="flex-1 md:flex-none flex items-center justify-center px-6 py-3 rounded-xl bg-[#25D366] text-white hover:bg-[#1DA851] transition-all font-black text-sm shadow-[0_0_20px_rgba(37,211,102,0.3)]">
            <MessageCircle className="w-5 h-5 mr-2" /> 
            {customer?.customer_phone ? 'Send to Customer' : 'Share via WhatsApp'}
          </button>
          
          <button onClick={handleDownloadImage} disabled={downloading} className="flex-1 md:flex-none flex items-center justify-center px-4 py-3 rounded-xl bg-[#15171F] border border-[#252733] text-[#EEEEF5] hover:bg-[#252733] transition-all font-bold text-sm disabled:opacity-50">
            <Download className="w-4 h-4 mr-2 text-[#60A5FA]" /> {downloading ? 'Saving...' : 'Image'}
          </button>
          
          <button onClick={handlePrint} className="flex-1 md:flex-none flex items-center justify-center px-4 py-3 rounded-xl bg-[#15171F] border border-[#252733] text-[#EEEEF5] hover:bg-[#252733] transition-all font-bold text-sm">
            <Printer className="w-4 h-4 mr-2 text-[#F4C542]" /> Print
          </button>
        </div>
      </div>

      {/* 🧾 THE RECEIPT ITSELF */}
      <div ref={receiptRef} className="max-w-md mx-auto bg-gradient-to-b from-[#FDFDFD] to-[#F3F4F6] rounded-t-2xl rounded-b-md shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden text-slate-900 relative print:shadow-none print:w-full print:max-w-none">
        
        <div style={{ backgroundColor: brandColor }} className="h-4 w-full relative z-20"></div>

        {/* 💧 WATERMARK LOGO */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.03] z-0">
          {business.logo_url ? (
             <img src={business.logo_url} className="w-80 h-80 object-cover rounded-full grayscale mix-blend-multiply" crossOrigin="anonymous" alt="" />
          ) : (
             <ShieldCheck className="w-80 h-80 text-slate-900" />
          )}
        </div>

        <div className="px-8 pt-10 pb-6 text-center relative z-10">
          {business.logo_url ? (
            <img src={business.logo_url} alt="Logo" className="h-20 w-20 object-cover mx-auto mb-4 rounded-full border-2 border-slate-200 shadow-sm bg-white" crossOrigin="anonymous" />
          ) : (
            <div style={{ backgroundColor: `${brandColor}15`, color: brandColor }} className="h-20 w-20 rounded-full mx-auto mb-4 flex items-center justify-center font-black text-3xl border-2 border-slate-200 shadow-sm">
              {business.business_name.charAt(0)}
            </div>
          )}
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">{business.business_name}</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">{business.street_address}</p>
          <p className="text-sm text-slate-500 font-medium">{business.city} {business.state_region && `, ${business.state_region}`}</p>
          <p className="text-sm text-slate-500 mt-2 font-medium">{business.business_phone}</p>
          {business.business_email && <p className="text-sm text-slate-500 font-medium">{business.business_email}</p>}
          {business.cac_reg_no && <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-bold border border-slate-300 bg-white/50 inline-block px-3 py-1.5 rounded-full">CAC: {business.cac_reg_no}</p>}
        </div>

        <div className="w-full border-t-2 border-dashed border-slate-300 my-2 relative z-10"></div>

        {/* 🎨 BRAND COLORED DETAILS SECTION */}
        <div className="px-8 py-4 grid grid-cols-2 gap-y-4 relative z-10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: brandColor }}>Date</p>
            <p className="text-xs font-bold text-slate-800 mt-0.5">{receiptDate}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: brandColor }}>Receipt No.</p>
            <p className="text-sm font-mono font-bold text-slate-800 mt-0.5">{receipt.receipt_number}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: brandColor }}>Payment</p>
            <p className="text-xs font-bold text-slate-800 mt-0.5">{receipt.payment_method}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: brandColor }}>Cashier</p>
            <p className="text-xs font-bold text-slate-800 mt-0.5 uppercase">SYSTEM</p>
          </div>
          
          {/* Customer Info (If exists) */}
          {customer && (
             <>
               <div className="col-span-2 pt-2 border-t border-slate-200/50 mt-2">
                 <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: brandColor }}>Billed To</p>
                 <p className="text-sm font-bold text-slate-800 mt-0.5">{customer.customer_name}</p>
                 <p className="text-xs font-medium text-slate-500">{customer.customer_phone}</p>
               </div>
             </>
          )}
        </div>

        <div className="w-full border-t-2 border-dashed border-slate-300 my-2 relative z-10"></div>

        <div className="px-8 py-4 relative z-10">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-slate-900">
                <th className="pb-2 text-[10px] font-black uppercase tracking-widest text-slate-900">Qty</th>
                <th className="pb-2 text-[10px] font-black uppercase tracking-widest text-slate-900">Item</th>
                <th className="pb-2 text-[10px] font-black uppercase tracking-widest text-slate-900 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {items.map((item: any) => (
                <tr key={item.id}>
                  <td className="py-4 text-sm font-bold text-slate-600 align-top w-12">{item.quantity}</td>
                  <td className="py-4 pr-4">
                    <p className="text-sm font-bold text-slate-900 leading-tight">{item.item_name}</p>
                    
                    {item.serial_number && (
                      <div className="text-[9px] font-bold text-slate-500 tracking-wider mt-2 space-y-0.5">
                        {item.serial_number.split('\n').map((line: string, i: number) => (
                          <div key={i}>{line}</div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-4 text-sm font-mono font-bold text-slate-900 text-right align-top">
                    {Number(item.total_price) === 0 ? (
                      <span className="text-[10px] uppercase tracking-widest font-black text-[#059669] bg-[#059669]/10 px-2 py-1 rounded-md">FREE</span>
                    ) : (
                      Number(item.total_price).toLocaleString()
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-full border-t-2 border-dashed border-slate-300 my-2 relative z-10"></div>

        <div className="px-8 py-4 space-y-2 relative z-10">
          <div className="flex justify-between text-sm font-bold text-slate-500">
            <span>Subtotal</span>
            <span className="font-mono">{Number(receipt.subtotal).toLocaleString()}</span>
          </div>
          {receipt.tax_amount > 0 && (
            <div className="flex justify-between text-sm font-bold text-slate-500">
              <span>Tax ({receipt.tax_percentage}%)</span>
              <span className="font-mono">{Number(receipt.tax_amount).toLocaleString()}</span>
            </div>
          )}
          {receipt.discount_amount > 0 && (
            <div className="flex justify-between text-sm font-bold text-slate-500">
              <span>Discount ({receipt.discount_percentage}%)</span>
              <span className="font-mono">-{Number(receipt.discount_amount).toLocaleString()}</span>
            </div>
          )}
          {receipt.shipping_fee > 0 && (
            <div className="flex justify-between text-sm font-bold text-slate-500">
              <span>Shipping</span>
              <span className="font-mono">{Number(receipt.shipping_fee).toLocaleString()}</span>
            </div>
          )}
        </div>

        <div style={{ backgroundColor: `${brandColor}15`, color: brandColor, borderTopColor: brandColor, borderBottomColor: brandColor }} className="px-8 py-5 flex justify-between items-center border-y-2 border-dashed relative z-10 bg-white/50 backdrop-blur-sm">
          <span className="text-sm font-black uppercase tracking-widest text-slate-900">Total</span>
          <div className="text-right">
             <span className="text-sm font-bold mr-1">{business.currency || '₦'}</span>
             <span className="text-3xl font-black font-mono tracking-tighter text-slate-900">{Number(receipt.grand_total).toLocaleString()}</span>
          </div>
        </div>

        {/* 🔄 REORDERED FOOTER SECTION */}
        <div className="px-8 py-8 flex flex-col items-center text-center relative z-10">
          
          {/* 1. Signature */}
          {business.signature_url && (
            <div className="mb-6 flex flex-col items-center bg-white/50 p-3 rounded-2xl border border-slate-200 shadow-sm">
              <img src={business.signature_url} alt="Signature" className="h-16 object-contain mb-1 mix-blend-multiply" crossOrigin="anonymous" />
              <div className="w-40 border-t-2 border-slate-300 pt-1.5 text-[9px] text-slate-500 uppercase font-black tracking-widest">Authorized Sign</div>
            </div>
          )}

          {/* 2. Main Footer Message */}
          <p className="text-lg font-black text-slate-900 mb-6">{business.footer_message || 'Thank you for your business!'}</p>

          {/* 3. Warranty & Return Policy (Moved UP) */}
          {(business.warranty_policy || business.return_policy) && (
            <div className="w-full text-left bg-white/60 p-5 rounded-xl border border-slate-200 space-y-3 shadow-sm mb-6">
              {business.warranty_policy && (
                <p className="text-[9px] text-slate-500 font-bold leading-relaxed uppercase"><span className="text-slate-900">Warranty:</span> {business.warranty_policy}</p>
              )}
              {business.return_policy && (
                <p className="text-[9px] text-slate-500 font-bold leading-relaxed uppercase"><span className="text-slate-900">Returns:</span> {business.return_policy}</p>
              )}
            </div>
          )}

          {/* 4. Verification Code Display */}
          <div className="flex items-center gap-1.5 justify-center mb-5 bg-white/60 px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <ShieldCheck className="w-4 h-4" style={{ color: brandColor }} />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Verify: {receipt.verification_code}</span>
          </div>

          {/* 5. QR Code (Moved DOWN to the bottom) */}
          {business.show_qr && (
            <div className="mt-2 p-2 bg-white border-2 border-dashed rounded-2xl inline-block shadow-sm" style={{ borderColor: `${brandColor}50` }}>
              <div className="w-24 h-24 flex items-center justify-center bg-slate-50 rounded-xl">
                <QrCode className="w-16 h-16" style={{ color: brandColor }} />
              </div>
              <p className="text-[8px] font-bold text-slate-500 uppercase mt-2">Scan to Verify</p>
            </div>
          )}

        </div>
        
      </div>
    </div>
  )
}