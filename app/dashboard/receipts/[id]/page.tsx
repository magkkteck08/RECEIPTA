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
    const toastId = toast.loading('Rendering premium asset...')

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 3, // Ultra-high resolution for that crisp glass look
        useCORS: true, 
        backgroundColor: '#0A0C10', // Dark space background for the bounding box
        logging: false,
      })

      const image = canvas.toDataURL('image/png', 1.0)
      const link = document.createElement('a')
      const docType = receipt?.document_type || 'Receipt'
      link.download = `${docType}_${receipt.receipt_number}.png`
      link.href = image
      link.click()

      toast.success('Digital asset saved! 📸', { id: toastId })
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
  const brandColor = business.brand_primary_color || '#00C896' 
  const docType = receipt.document_type || 'Receipt'

  const receiptDate = new Date(receipt.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'
  })

  const resolvedCustomerName = customer?.customer_name || customer?.name

  return (
    <div className="min-h-full pb-20 font-sans print:bg-white print:pb-0 bg-[#0A0C10]">
      
      {/* 
        SMART PRINT CSS:
        This ensures that even though the UI is Dark/Glass, 
        when the user clicks "Print" for a physical thermal printer, 
        it forces a white background with black text to save ink.
      */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-canvas { padding: 0 !important; background: white !important; display: block !important; }
          .print-card { box-shadow: none !important; border: none !important; background: white !important; max-width: 100% !important; border-radius: 0 !important; }
          .print-text-white { color: black !important; }
          .print-text-gray { color: #4b5563 !important; }
          .print-border { border-color: #e5e7eb !important; }
          .print-bg-transparent { background: transparent !important; }
          @page { margin: 5mm; } 
        }
      `}} />

      {/* ACTION HEADER BAR */}
      <div className="max-w-3xl mx-auto no-print flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-[#161B22] p-4 rounded-2xl border border-[#21262D] shadow-lg mt-6">
        <Link href="/dashboard/receipts" className="flex items-center text-[#EEEEF5] hover:text-white transition-colors font-bold text-sm bg-[#0A0C10] px-4 py-2 rounded-xl border border-[#21262D]">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Link>
        
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 w-full md:w-auto">
          
          {/* 🔄 THE DOCUMENT TYPE SELECTOR */}
          <select
            value={docType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="bg-[#0A0C10] border border-[#21262D] text-[#00C896] rounded-xl px-4 py-2.5 text-sm font-black uppercase tracking-wider outline-none focus:border-[#00C896] transition-colors cursor-pointer"
          >
            <option value="Receipt">Receipt</option>
            <option value="Invoice">Invoice</option>
            <option value="Quotation">Quotation</option>
          </select>

          <button onClick={handleWhatsApp} className="flex-1 md:flex-none flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#25D366] text-white hover:bg-[#1DA851] transition-all font-black text-sm shadow-[0_0_20px_rgba(37,211,102,0.3)]">
            <MessageCircle className="w-4 h-4 mr-2" /> 
            {(customer?.customer_phone || customer?.phone) ? 'Send' : 'Share'}
          </button>
          <button onClick={handleDownloadImage} disabled={downloading} className="flex-1 md:flex-none flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#0A0C10] border border-[#21262D] text-[#EEEEF5] hover:bg-[#21262D] transition-all font-bold text-sm disabled:opacity-50">
            <Download className="w-4 h-4 mr-2 text-[#60A5FA]" /> {downloading ? 'Rendering...' : 'Asset'}
          </button>
          <button onClick={handlePrint} className="flex-1 md:flex-none flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#0A0C10] border border-[#21262D] text-[#EEEEF5] hover:bg-[#21262D] transition-all font-bold text-sm">
            <Printer className="w-4 h-4 mr-2 text-[#F4C542]" /> Print
          </button>
        </div>
      </div>

      {/* 📸 THE PRESENTATION CANVAS (Exported via html2canvas) */}
      <div 
        ref={receiptRef} 
        className="print-canvas bg-[#0A0C10] p-8 md:p-16 flex items-center justify-center relative overflow-hidden"
      >
        
        {/* Subtle Ambient Glow for the background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px] opacity-20 pointer-events-none no-print" style={{ backgroundColor: brandColor }}></div>

        {/* 💳 THE GLASS RECEIPT CARD */}
        <div className="print-card w-full max-w-[420px] bg-[#161B22] border border-white/10 rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden print-bg-transparent">
          
          {/* Top Glass Glare Line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent no-print"></div>

          {/* Premium Brand Color Bar */}
          <div style={{ backgroundColor: brandColor, boxShadow: `0 0 20px ${brandColor}80` }} className="h-1.5 w-full relative z-20 no-print"></div>

          {/* 📄 DYNAMIC BACKGROUND WATERMARK STAMP */}
          <div className="absolute top-40 left-1/2 -translate-x-1/2 -rotate-12 pointer-events-none z-0 opacity-5">
               <span className="text-7xl font-black border-8 px-4 py-2 uppercase print-text-gray" style={{ color: brandColor, borderColor: brandColor }}>
                  {docType}
               </span>
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-5 z-0">
            {business.logo_url ? (
               <img src={business.logo_url} className="w-64 h-64 object-cover rounded-full grayscale mix-blend-screen" crossOrigin="anonymous" alt="" />
            ) : (
               <ShieldCheck className="w-64 h-64 text-white print-text-gray" />
            )}
          </div>

          {/* VENDOR HEADER SECTION */}
          <div className="px-8 pt-8 pb-4 text-center relative z-10">
            {business.logo_url ? (
              <img src={business.logo_url} alt="Logo" className="h-16 w-16 object-cover mx-auto mb-4 rounded-2xl border border-white/10 shadow-lg bg-[#0A0C10]" crossOrigin="anonymous" />
            ) : (
              <div style={{ backgroundColor: `${brandColor}20`, color: brandColor, borderColor: `${brandColor}40` }} className="h-16 w-16 rounded-2xl mx-auto mb-4 flex items-center justify-center font-black text-3xl border shadow-lg">
                {business.business_name?.charAt(0) || 'V'}
              </div>
            )}
            <h1 className="text-2xl font-black tracking-tight text-white uppercase leading-tight print-text-white">{business.business_name}</h1>
            <p className="text-[11px] text-[#8B949E] mt-1.5 font-medium leading-tight print-text-gray">{business.street_address}</p>
            <p className="text-[11px] text-[#8B949E] font-medium leading-tight print-text-gray">{business.city} {business.state_region && `, ${business.state_region}`}</p>
            <p className="text-[11px] text-[#8B949E] mt-1 font-medium print-text-gray">{business.business_phone}</p>
            
            {/* 📄 DYNAMIC HEADER BADGE */}
            <div className="mt-4">
               <span className="text-[9px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border bg-white/5 backdrop-blur-sm shadow-inner print-bg-transparent print-border" style={{ color: brandColor, borderColor: `${brandColor}40` }}>
                  {docType}
               </span>
            </div>
          </div>

          <div className="w-full border-t border-dashed border-white/10 my-2 relative z-10 print-border"></div>

          {/* DOCUMENT METADATA */}
          <div className="px-8 py-4 grid grid-cols-2 gap-y-4 relative z-10">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-[#8B949E] print-text-gray">Date</p>
              <p className="text-[11px] font-bold text-white mt-1 print-text-white">{receiptDate}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-widest text-[#8B949E] print-text-gray">{docType} No.</p>
              <p className="text-[11px] font-mono font-bold text-white mt-1 print-text-white">{receipt.receipt_number}</p>
            </div>
            
            {/* DYNAMIC FIELD */}
            {docType !== 'Quotation' && (
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-[#8B949E] print-text-gray">Payment</p>
                <p className="text-[11px] font-bold text-white mt-1 print-text-white">{receipt.payment_method || 'N/A'}</p>
              </div>
            )}

            <div className={docType === 'Quotation' ? "col-span-2 text-left" : "text-right"}>
              <p className="text-[9px] font-black uppercase tracking-widest text-[#8B949E] print-text-gray">Issued By</p>
              <p className="text-[11px] font-bold text-white mt-1 uppercase print-text-white">SYSTEM</p>
            </div>
            
            {resolvedCustomerName && (
               <div className="col-span-2 pt-3 border-t border-white/5 mt-1 print-border">
                 <p className="text-[9px] font-black uppercase tracking-widest text-[#8B949E] print-text-gray">Billed To</p>
                 <p className="text-sm font-bold text-white mt-1 leading-tight print-text-white">{resolvedCustomerName}</p>
                 {(customer.customer_phone || customer.phone) && (
                   <p className="text-[10px] font-mono font-medium text-[#8B949E] mt-0.5 print-text-gray">{customer.customer_phone || customer.phone}</p>
                 )}
               </div>
            )}
          </div>

          <div className="w-full border-t border-dashed border-white/10 my-2 relative z-10 print-border"></div>

          {/* ITEMS TABLE */}
          <div className="px-8 py-4 relative z-10">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 print-border">
                  <th className="pb-2 text-[9px] font-black uppercase tracking-widest text-[#8B949E] print-text-gray">Qty</th>
                  <th className="pb-2 text-[9px] font-black uppercase tracking-widest text-[#8B949E] print-text-gray">Item</th>
                  <th className="pb-2 text-[9px] font-black uppercase tracking-widest text-[#8B949E] text-right print-text-gray">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 print-border">
                {items?.map((item: any) => (
                  <tr key={item.id}>
                    <td className="py-3 text-xs font-bold text-[#8B949E] align-top w-8 print-text-gray">{item.quantity}</td>
                    <td className="py-3 pr-2">
                      <p className="text-xs font-bold text-white leading-tight print-text-white">{item.item_name}</p>
                      {Number(item.quantity) > 1 && (
                        <p className="text-[10px] font-bold text-[#8B949E] mt-1 print-text-gray">
                          {item.quantity} x {Number(Number(item.total_price) / Number(item.quantity)).toLocaleString()}
                        </p>
                      )}
                      {item.serial_number && (
                        <div className="text-[9px] font-mono text-[#8B949E] tracking-wider mt-1 space-y-0.5 print-text-gray">
                          {item.serial_number.split('\n').map((line: string, i: number) => (
                            <div key={i}>{line}</div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3 text-xs font-mono font-bold text-white text-right align-top print-text-white">
                      {Number(item.total_price) === 0 ? (
                        <span className="text-[9px] uppercase tracking-widest font-black text-[#00C896] bg-[#00C896]/10 px-2 py-1 rounded-md print-bg-transparent">FREE</span>
                      ) : (
                        Number(item.total_price).toLocaleString()
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="w-full border-t border-dashed border-white/10 my-2 relative z-10 print-border"></div>

          {/* PRICING FINANCIALS */}
          <div className="px-8 py-4 space-y-2 relative z-10">
            <div className="flex justify-between text-xs font-bold text-[#8B949E] print-text-gray">
              <span>Subtotal</span>
              <span className="font-mono text-white print-text-white">{Number(receipt.subtotal).toLocaleString()}</span>
            </div>
            {receipt.tax_amount > 0 && (
              <div className="flex justify-between text-xs font-bold text-[#8B949E] print-text-gray">
                <span>Tax ({receipt.tax_percentage}%)</span>
                <span className="font-mono text-white print-text-white">{Number(receipt.tax_amount).toLocaleString()}</span>
              </div>
            )}
            {receipt.discount_amount > 0 && (
              <div className="flex justify-between text-xs font-bold text-[#00C896]">
                <span>Discount ({receipt.discount_percentage}%)</span>
                <span className="font-mono">-{Number(receipt.discount_amount).toLocaleString()}</span>
              </div>
            )}
            {receipt.shipping_fee > 0 && (
              <div className="flex justify-between text-xs font-bold text-[#8B949E] print-text-gray">
                <span>Shipping</span>
                <span className="font-mono text-white print-text-white">{Number(receipt.shipping_fee).toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* TOTAL & BRAND WATERMARK */}
          <div style={{ backgroundColor: `${brandColor}10`, borderTopColor: brandColor }} className="px-8 py-5 flex justify-between items-center border-t-2 relative z-10 print-bg-transparent print-border">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#8B949E] print-text-gray">Total</span>
              
              {/* 🔒 THE PREMIUM WATERMARK CHECK */}
              {!business?.hide_watermark && (
                <div className="flex flex-col gap-1 mt-2 opacity-60">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-white print-text-gray" />
                    <span className="text-[7px] font-black uppercase tracking-widest text-white print-text-gray">Powered by Receipta</span>
                  </div>
                </div>
              )}

            </div>
            <div className="text-right flex items-end">
               <span className="text-sm font-bold mr-1 text-[#8B949E] print-text-gray mb-1">{business.currency || '₦'}</span>
               <span className="text-3xl font-black font-mono tracking-tighter text-white print-text-white">{Number(receipt.grand_total).toLocaleString()}</span>
            </div>
          </div>

          {/* FOOTER & VERIFICATION BLOCK */}
          <div className="px-8 pt-6 pb-8 flex flex-col items-center text-center relative z-10 bg-[#0D1117] print-bg-transparent">
            {business.signature_url && (
              <div className="mb-4 flex flex-col items-center bg-white/5 p-3 rounded-2xl border border-white/5 shadow-inner print-bg-transparent print-border">
                <img src={business.signature_url} alt="Signature" className="h-10 object-contain mb-1 drop-shadow-md print-bg-transparent" crossOrigin="anonymous" />
                <div className="w-40 border-t border-white/20 pt-1.5 text-[8px] text-[#8B949E] uppercase font-black tracking-widest print-border print-text-gray">Authorized Sign</div>
              </div>
            )}
            <p className="text-xs font-black text-white mb-3 print-text-white">{business.footer_message || 'Thank you for your business!'}</p>
            
            {(business.warranty_policy || business.return_policy) && (
              <div className="w-full text-left bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1.5 shadow-inner mb-4 print-bg-transparent print-border">
                {business.warranty_policy && (
                  <p className="text-[8px] text-[#8B949E] font-bold leading-relaxed uppercase print-text-gray"><span className="text-white print-text-white">Warranty:</span> {business.warranty_policy}</p>
                )}
                {business.return_policy && (
                  <p className="text-[8px] text-[#8B949E] font-bold leading-relaxed uppercase print-text-gray"><span className="text-white print-text-white">Returns:</span> {business.return_policy}</p>
                )}
              </div>
            )}

            {/* Premium Cryptographic Badge */}
            <div className="flex items-center gap-2 justify-center bg-[#161B22] px-4 py-2 rounded-full border border-white/10 shadow-lg mt-2 print-bg-transparent print-border">
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: brandColor }} />
              <span className="text-[9px] font-mono font-bold text-white uppercase tracking-widest print-text-gray">ID: {receipt.verification_code}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
