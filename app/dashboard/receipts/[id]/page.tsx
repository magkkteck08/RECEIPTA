'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'react-hot-toast'
import { Printer, ArrowLeft, ShieldCheck, Download, MessageCircle } from 'lucide-react'
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
      const { data: receiptData, error } = await supabase
        .from('receipts')
        .select('*, businesses (*), receipt_items (*)')
        .eq('id', params.id)
        .single()

      if (error || !receiptData) {
        toast.error("Document not found")
        router.push('/dashboard')
        return
      }
      setReceipt(receiptData)

      // Resolve Customer Details from standalone customer relation or fallback to direct receipt fields
      if (receiptData.customer_id) {
         const { data: customerData } = await supabase
           .from('customers')
           .select('*')
           .eq('id', receiptData.customer_id)
           .single()
         
         if (customerData) {
           setCustomer(customerData)
         } else {
           setCustomer({
             customer_name: receiptData.customer_name,
             customer_phone: receiptData.customer_phone,
             customer_email: receiptData.customer_email
           })
         }
      } else if (receiptData.customer_name || receiptData.customer_phone || receiptData.customer_email) {
         setCustomer({
           customer_name: receiptData.customer_name,
           customer_phone: receiptData.customer_phone,
           customer_email: receiptData.customer_email
         })
      }
      setLoading(false)
    }
    fetchReceipt()
  }, [params.id, router, supabase])

  // 🔄 DATABASE UPDATE: Change Document Type on the fly
  const handleTypeChange = async (newType: string) => {
    setReceipt({ ...receipt, document_type: newType })
    
    const { error } = await supabase
      .from('receipts')
      .update({ document_type: newType })
      .eq('id', receipt.id)

    if (error) {
      toast.error('Failed to update document type')
    } else {
      toast.success(`Switched to ${newType} 📄`)
    }
  }

  const handlePrint = () => window.print()

  // 📄 DYNAMIC WHATSAPP MESSAGE
  const handleWhatsApp = () => {
    const businessName = receipt?.businesses?.business_name
    const currency = receipt?.businesses?.currency || '₦'
    const amount = `${currency}${Number(receipt?.grand_total).toLocaleString()}`
    const verifyCode = receipt?.verification_code
    const docType = receipt?.document_type || 'Receipt'
    
    const verifyUrl = `${window.location.origin}/verify/${verifyCode}`
    
    let message = `*${docType} from ${businessName}* 🧾\n\nHello! 👋\n`
    if (docType === 'Quotation') {
        message += `Here is the price quotation you requested for *${amount}*.\n\n`
    } else if (docType === 'Invoice') {
        message += `Please find the official invoice for *${amount}*.\n\n`
    } else {
        message += `Thank you for your purchase of *${amount}*.\n\n`
    }
    
    message += `You can view and verify the official document here:\n🔗 ${verifyUrl}\n\n_Powered by Receipta_`
    
    let whatsappUrl = ''
    const phoneNum = customer?.customer_phone || customer?.phone
    if (phoneNum) {
       let cleanPhone = phoneNum.replace(/\D/g, '')
       if (cleanPhone.startsWith('0')) cleanPhone = '234' + cleanPhone.substring(1)
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
      const docType = receipt?.document_type || 'Receipt'
      link.download = `${docType}_${receipt.receipt_number}.png`
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
      <div className="text-[#00C896] animate-pulse font-bold tracking-widest text-sm flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-[#00C896] border-t-transparent rounded-full animate-spin mb-4"></div>
        FETCHING SECURE DOCUMENT...
      </div>
    </div>
  )

  const business = receipt.businesses
  const items = receipt.receipt_items
  const brandColor = business.brand_primary_color || '#059669' 
  const docType = receipt.document_type || 'Receipt'

  const receiptDate = new Date(receipt.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'
  })

  // Dynamic names tracking across object structures
  const resolvedCustomerName = customer?.customer_name || customer?.name

  return (
    <div className="min-h-full pb-20 font-sans print:bg-white print:pb-0">
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; background: white; }
          @page { margin: 10mm; } 
        }
      `}} />

      {/* ACTION HEADER BAR */}
      <div className="no-print flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-[#161B22] p-4 rounded-2xl border border-[#21262D] shadow-lg">
        <Link href="/dashboard/receipts" className="flex items-center text-[#EEEEF5] hover:text-white transition-colors font-bold text-sm bg-[#0D1117] px-4 py-2 rounded-xl border border-[#21262D]">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Link>
        
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 w-full md:w-auto">
          
          {/* 🔄 THE DOCUMENT TYPE SELECTOR */}
          <select
            value={docType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="bg-[#0D1117] border border-[#21262D] text-[#00C896] rounded-xl px-4 py-2.5 text-sm font-black uppercase tracking-wider outline-none focus:border-[#00C896] transition-colors cursor-pointer"
          >
            <option value="Receipt">Receipt</option>
            <option value="Invoice">Invoice</option>
            <option value="Quotation">Quotation</option>
          </select>

          <button onClick={handleWhatsApp} className="flex-1 md:flex-none flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#25D366] text-white hover:bg-[#1DA851] transition-all font-black text-sm shadow-[0_0_20px_rgba(37,211,102,0.3)]">
            <MessageCircle className="w-4 h-4 mr-2" /> 
            {(customer?.customer_phone || customer?.phone) ? 'Send' : 'Share'}
          </button>
          <button onClick={handleDownloadImage} disabled={downloading} className="flex-1 md:flex-none flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#0D1117] border border-[#21262D] text-[#EEEEF5] hover:bg-[#21262D] transition-all font-bold text-sm disabled:opacity-50">
            <Download className="w-4 h-4 mr-2 text-[#60A5FA]" /> {downloading ? 'Saving...' : 'Image'}
          </button>
          <button onClick={handlePrint} className="flex-1 md:flex-none flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#0D1117] border border-[#21262D] text-[#EEEEF5] hover:bg-[#21262D] transition-all font-bold text-sm">
            <Printer className="w-4 h-4 mr-2 text-[#F4C542]" /> Print
          </button>
        </div>
      </div>

      {/* RECEIPT TEMPLATE BODY */}
      <div ref={receiptRef} className="max-w-[380px] mx-auto bg-gradient-to-b from-[#FDFDFD] to-[#F3F4F6] rounded-t-xl rounded-b-md shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden text-slate-900 relative print:shadow-none print:my-0">
        
        <div style={{ backgroundColor: brandColor }} className="h-3 w-full relative z-20"></div>

        {/* 📄 DYNAMIC BACKGROUND WATERMARK STAMP */}
        <div className="absolute top-40 left-1/2 -translate-x-1/2 -rotate-12 pointer-events-none z-0 opacity-[0.08]">
             <span className="text-6xl font-black border-8 px-4 py-2 uppercase" style={{ color: brandColor, borderColor: brandColor }}>
                {docType}
             </span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.03] z-0">
          {business.logo_url ? (
             <img src={business.logo_url} className="w-64 h-64 object-cover rounded-full grayscale mix-blend-multiply" crossOrigin="anonymous" alt="" />
          ) : (
             <ShieldCheck className="w-64 h-64 text-slate-900" />
          )}
        </div>

        {/* VENDOR HEADER SECTION */}
        <div className="px-6 pt-6 pb-3 text-center relative z-10">
          {business.logo_url ? (
            <img src={business.logo_url} alt="Logo" className="h-14 w-14 object-cover mx-auto mb-3 rounded-full border border-slate-200 shadow-sm bg-white" crossOrigin="anonymous" />
          ) : (
            <div style={{ backgroundColor: `${brandColor}15`, color: brandColor }} className="h-14 w-14 rounded-full mx-auto mb-3 flex items-center justify-center font-black text-2xl border border-slate-200 shadow-sm">
              {business.business_name?.charAt(0) || 'V'}
            </div>
          )}
          <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase leading-tight">{business.business_name}</h1>
          <p className="text-[11px] text-slate-500 mt-1 font-medium leading-tight">{business.street_address}</p>
          <p className="text-[11px] text-slate-500 font-medium leading-tight">{business.city} {business.state_region && `, ${business.state_region}`}</p>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">{business.business_phone}</p>
          
          {/* 📄 DYNAMIC HEADER BADGE */}
          <div className="mt-3">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1 rounded-full border bg-white shadow-sm" style={{ color: brandColor, borderColor: `${brandColor}40` }}>
                {docType}
             </span>
          </div>
        </div>

        <div className="w-full border-t border-dashed border-slate-300 my-1 relative z-10"></div>

        {/* DOCUMENT METADATA */}
        <div className="px-6 py-3 grid grid-cols-2 gap-y-2 relative z-10">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: brandColor }}>Date</p>
            <p className="text-[11px] font-bold text-slate-800 mt-0.5">{receiptDate}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: brandColor }}>{docType} No.</p>
            <p className="text-[11px] font-mono font-bold text-slate-800 mt-0.5">{receipt.receipt_number}</p>
          </div>
          
          {/* DYNAMIC FIELD: Only show Payment Method if it is NOT a Quotation */}
          {docType !== 'Quotation' && (
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: brandColor }}>Payment</p>
              <p className="text-[11px] font-bold text-slate-800 mt-0.5">{receipt.payment_method || 'N/A'}</p>
            </div>
          )}

          <div className={docType === 'Quotation' ? "col-span-2 text-left" : "text-right"}>
            <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: brandColor }}>Issued By</p>
            <p className="text-[11px] font-bold text-slate-800 mt-0.5 uppercase">SYSTEM</p>
          </div>
          
          {resolvedCustomerName && (
             <div className="col-span-2 pt-2 border-t border-slate-200/50 mt-1">
               <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: brandColor }}>Billed To</p>
               <p className="text-xs font-bold text-slate-800 mt-0.5 leading-tight">{resolvedCustomerName}</p>
               {(customer.customer_phone || customer.phone) && (
                 <p className="text-[10px] font-medium text-slate-500">{customer.customer_phone || customer.phone}</p>
               )}
             </div>
          )}
        </div>

        <div className="w-full border-t border-dashed border-slate-300 my-1 relative z-10"></div>

        {/* ITEMS TABLE */}
        <div className="px-6 py-2 relative z-10">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-900">
                <th className="pb-1 text-[9px] font-black uppercase tracking-widest text-slate-900">Qty</th>
                <th className="pb-1 text-[9px] font-black uppercase tracking-widest text-slate-900">Item</th>
                <th className="pb-1 text-[9px] font-black uppercase tracking-widest text-slate-900 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {items?.map((item: any) => (
                <tr key={item.id}>
                  <td className="py-2 text-xs font-bold text-slate-600 align-top w-8">{item.quantity}</td>
                  <td className="py-2 pr-2">
                    <p className="text-xs font-bold text-slate-900 leading-tight">{item.item_name}</p>
                    {Number(item.quantity) > 1 && (
                      <p className="text-[9px] font-bold text-slate-500 mt-0.5">
                        {item.quantity} x {Number(Number(item.total_price) / Number(item.quantity)).toLocaleString()}
                      </p>
                    )}
                    {item.serial_number && (
                      <div className="text-[8px] font-bold text-slate-500 tracking-wider mt-1 space-y-0.5">
                        {item.serial_number.split('\n').map((line: string, i: number) => (
                          <div key={i}>{line}</div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-2 text-xs font-mono font-bold text-slate-900 text-right align-top">
                    {Number(item.total_price) === 0 ? (
                      <span className="text-[9px] uppercase tracking-widest font-black text-[#059669] bg-[#059669]/10 px-1.5 py-0.5 rounded-sm">FREE</span>
                    ) : (
                      Number(item.total_price).toLocaleString()
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-full border-t border-dashed border-slate-300 my-1 relative z-10"></div>

        {/* PRICING FINANCIALS */}
        <div className="px-6 py-2 space-y-1 relative z-10">
          <div className="flex justify-between text-xs font-bold text-slate-500">
            <span>Subtotal</span>
            <span className="font-mono">{Number(receipt.subtotal).toLocaleString()}</span>
          </div>
          {receipt.tax_amount > 0 && (
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>Tax ({receipt.tax_percentage}%)</span>
              <span className="font-mono">{Number(receipt.tax_amount).toLocaleString()}</span>
            </div>
          )}
          {receipt.discount_amount > 0 && (
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>Discount ({receipt.discount_percentage}%)</span>
              <span className="font-mono">-{Number(receipt.discount_amount).toLocaleString()}</span>
            </div>
          )}
          {receipt.shipping_fee > 0 && (
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>Shipping</span>
              <span className="font-mono">{Number(receipt.shipping_fee).toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* TOTAL & BRAND WATERMARK (Premium check applied) */}
        <div style={{ backgroundColor: `${brandColor}10`, color: brandColor, borderTopColor: brandColor, borderBottomColor: brandColor }} className="px-6 py-3 flex justify-between items-center border-y border-dashed relative z-10">
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-widest text-slate-900">Total</span>
            
            {/* 🔒 THE PREMIUM WATERMARK CHECK */}
            {!business?.hide_watermark && (
              <div className="flex flex-col gap-0.5 mt-1 opacity-80">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  <span className="text-[6px] font-black uppercase tracking-widest">Powered by Receipta</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-current"></div>
                  <span className="text-[6px] font-bold uppercase tracking-[0.05em]">Architected by MAGKK.TECK</span>
                </div>
              </div>
            )}

          </div>
          <div className="text-right">
             <span className="text-xs font-bold mr-1">{business.currency || '₦'}</span>
             <span className="text-2xl font-black font-mono tracking-tighter text-slate-900">{Number(receipt.grand_total).toLocaleString()}</span>
          </div>
        </div>

        {/* FOOTER & VERIFICATION BLOCK */}
        <div className="px-6 pt-3 pb-4 flex flex-col items-center text-center relative z-10">
          {business.signature_url && (
            <div className="mb-2 flex flex-col items-center bg-white/50 p-2 rounded-xl border border-slate-200 shadow-sm">
              <img src={business.signature_url} alt="Signature" className="h-8 object-contain mb-0.5 mix-blend-multiply" crossOrigin="anonymous" />
              <div className="w-32 border-t border-slate-300 pt-1 text-[7px] text-slate-500 uppercase font-black tracking-widest">Authorized Sign</div>
            </div>
          )}
          <p className="text-xs font-black text-slate-900 mb-2">{business.footer_message || 'Thank you for your business!'}</p>
          {(business.warranty_policy || business.return_policy) && (
            <div className="w-full text-left bg-white/60 p-2.5 rounded-lg border border-slate-200 space-y-1 shadow-sm mb-2">
              {business.warranty_policy && (
                <p className="text-[7px] text-slate-500 font-bold leading-tight uppercase"><span className="text-slate-900">Warranty:</span> {business.warranty_policy}</p>
              )}
              {business.return_policy && (
                <p className="text-[7px] text-slate-500 font-bold leading-tight uppercase"><span className="text-slate-900">Returns:</span> {business.return_policy}</p>
              )}
            </div>
          )}
          <div className="flex items-center gap-1.5 justify-center mb-1.5 bg-white/60 px-3 py-1 rounded-full border border-slate-200 shadow-sm">
            <ShieldCheck className="w-3 h-3" style={{ color: brandColor }} />
            <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">Verify: {receipt.verification_code}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

