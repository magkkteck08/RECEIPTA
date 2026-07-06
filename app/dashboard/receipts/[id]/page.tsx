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
        scale: 3, 
        useCORS: true, 
        backgroundColor: '#0A0C10', 
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

  const rawDate = new Date(receipt.created_at)
  const displayDate = rawDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
  const displayTime = rawDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  const resolvedCustomerName = customer?.customer_name || customer?.name

  return (
    <div className="min-h-full pb-20 font-sans print:bg-white print:pb-0 bg-[#0A0C10]">
      
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

      {/* 📸 PRESENTATION CANVAS */}
      <div 
        ref={receiptRef} 
        className="print-canvas bg-[#0A0C10] p-8 md:p-16 flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px] opacity-20 pointer-events-none no-print" style={{ backgroundColor: brandColor }}></div>

        {/* 💳 GLASS RECEIPT CARD */}
        <div className="print-card w-full max-w-[420px] bg-[#161B22] border border-white/10 rounded-[32px] shadow-[0_40px_100px_rgba(0,0,0,0.9)] relative z-10 overflow-hidden print-bg-transparent">
          
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent no-print"></div>
          <div style={{ backgroundColor: brandColor, boxShadow: `0 0 20px ${brandColor}80` }} className="h-1.5 w-full relative z-20 no-print"></div>

          {/* 📄 DYNAMIC BACKGROUND WATERMARK STAMP */}
          <div className="absolute top-48 left-1/2 -translate-x-1/2 -rotate-12 pointer-events-none z-0 opacity-[0.03]">
               <span className="text-8xl font-black border-[12px] px-6 py-2 uppercase print-text-gray" style={{ color: brandColor, borderColor: brandColor }}>
                  {docType}
               </span>
          </div>

          {/* SOFTENED FACE/LOGO WATERMARK */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.03] z-0">
            {business.logo_url ? (
               <img src={business.logo_url} className="w-80 h-80 object-cover rounded-full grayscale mix-blend-screen" crossOrigin="anonymous" alt="" />
            ) : (
               <ShieldCheck className="w-80 h-80 text-white print-text-gray" />
            )}
          </div>

          {/* VENDOR HEADER SECTION */}
          <div className="px-8 pt-10 pb-6 text-center relative z-10">
            {business.logo_url ? (
              <img src={business.logo_url} alt="Logo" className="h-16 w-16 object-cover mx-auto mb-5 rounded-2xl border border-white/10 shadow-lg bg-[#0A0C10]" crossOrigin="anonymous" />
            ) : (
              <div style={{ backgroundColor: `${brandColor}20`, color: brandColor, borderColor: `${brandColor}40` }} className="h-16 w-16 rounded-2xl mx-auto mb-5 flex items-center justify-center font-black text-3xl border shadow-lg">
                {business.business_name?.charAt(0) || 'V'}
              </div>
            )}
            
            {/* HERO BUSINESS NAME WITH ®️ */}
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white uppercase leading-tight print-text-white drop-shadow-md">
              {business.business_name}®
            </h1>
            
            <div className="mt-3 space-y-0.5">
              <p className="text-[11px] text-[#8B949E] font-medium leading-tight print-text-gray">{business.street_address}</p>
              <p className="text-[11px] text-[#8B949E] font-medium leading-tight print-text-gray">{business.city} {business.state_region && `, ${business.state_region}`}</p>
              <p className="text-[11px] text-[#8B949E] font-medium print-text-gray">{business.business_phone}</p>
            </div>
            
            {/* 📄 DYNAMIC HEADER BADGE */}
            <div className="mt-5">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] px-5 py-2 rounded-full border bg-white/5 backdrop-blur-md shadow-inner print-bg-transparent print-border" style={{ color: brandColor, borderColor: `${brandColor}40` }}>
                  {docType}
               </span>
            </div>
          </div>

          <div className="w-full border-t border-dashed border-white/10 my-1 relative z-10 print-border"></div>

          {/* DOCUMENT METADATA */}
          <div className="px-8 py-5 grid grid-cols-2 gap-y-5 relative z-10">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-[#8B949E] print-text-gray">Date</p>
              <p className="text-[12px] font-bold text-white mt-1 print-text-white">{displayDate}, {displayTime}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-widest text-[#8B949E] print-text-gray">{docType} No.</p>
              <div className="flex justify-end items-center gap-2 mt-1">
                <p className="text-[12px] font-mono font-bold text-white print-text-white">{receipt.receipt_number}</p>
                
                {/* STATUS PILL */}
                {docType === 'Receipt' && (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#00C896]/10 border border-[#00C896]/30 text-[#00C896] text-[8px] font-black uppercase tracking-widest print-border print-bg-transparent print-text-gray">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00C896]"></span> PAID
                  </span>
                )}
              </div>
            </div>
            
            {docType !== 'Quotation' && (
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-[#8B949E] print-text-gray">Payment</p>
                <p className="text-[12px] font-bold text-white mt-1 print-text-white">{receipt.payment_method || 'N/A'}</p>
              </div>
            )}

            <div className={docType === 'Quotation' ? "col-span-2 text-left" : "text-right"}>
              <p className="text-[9px] font-black uppercase tracking-widest text-[#8B949E] print-text-gray">Issued By</p>
              <p className="text-[12px] font-bold text-white mt-1 uppercase print-text-white">SYSTEM</p>
            </div>
            
            {resolvedCustomerName && (
               <div className="col-span-2 pt-4 border-t border-white/5 mt-1 print-border">
                 <p className="text-[9px] font-black uppercase tracking-widest text-[#8B949E] print-text-gray">Billed To</p>
                 <p className="text-[15px] font-bold text-white mt-1 leading-tight print-text-white">{resolvedCustomerName}</p>
                 {(customer.customer_phone || customer.phone) && (
                   <p className="text-[11px] font-mono font-medium text-[#8B949E] mt-0.5 print-text-gray">{customer.customer_phone || customer.phone}</p>
                 )}
               </div>
            )}
          </div>

          <div className="w-full border-t border-dashed border-white/10 my-1 relative z-10 print-border"></div>

          {/* ITEMS TABLE */}
          <div className="px-8 py-5 relative z-10">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 print-border">
                  <th className="pb-3 text-[9px] font-black uppercase tracking-widest text-[#8B949E] print-text-gray">Qty</th>
                  <th className="pb-3 text-[9px] font-black uppercase tracking-widest text-[#8B949E] print-text-gray">Item</th>
                  <th className="pb-3 text-[9px] font-black uppercase tracking-widest text-[#8B949E] text-right print-text-gray">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 print-border">
                {items?.map((item: any) => (
                  <tr key={item.id}>
                    <td className="py-5 text-sm font-bold text-[#8B949E] align-top w-8 print-text-gray">{item.quantity}</td>
                    <td className="py-5 pr-2">
                      <p className="text-[13px] font-bold text-white leading-tight print-text-white">{item.item_name}</p>
                      {Number(item.quantity) > 1 && (
                        <p className="text-[11px] font-bold text-[#8B949E] mt-1.5 print-text-gray">
                          {item.quantity} x {Number(Number(item.total_price) / Number(item.quantity)).toLocaleString()}
                        </p>
                      )}
                      {item.serial_number && (
                        <div className="text-[10px] font-mono text-[#8B949E] tracking-wider mt-1.5 space-y-0.5 print-text-gray">
                          {item.serial_number.split('\n').map((line: string, i: number) => (
                            <div key={i}>{line}</div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-5 text-[13px] font-mono font-bold text-white text-right align-top print-text-white">
                      {Number(item.total_price) === 0 ? (
                        <span className="text-[10px] uppercase tracking-widest font-black text-[#00C896] bg-[#00C896]/10 px-2 py-1 rounded-md print-bg-transparent">FREE</span>
                      ) : (
                        Number(item.total_price).toLocaleString()
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="w-full border-t border-dashed border-white/10 my-1 relative z-10 print-border"></div>

          {/* PRICING FINANCIALS */}
          <div className="px-8 py-5 space-y-3 relative z-10">
            <div className="flex justify-between text-[13px] font-bold text-[#8B949E] print-text-gray">
              <span>Subtotal</span>
              <span className="font-mono text-white print-text-white">{Number(receipt.subtotal).toLocaleString()}</span>
            </div>
            {receipt.tax_amount > 0 && (
              <div className="flex justify-between text-[13px] font-bold text-[#8B949E] print-text-gray">
                <span>Tax ({receipt.tax_percentage}%)</span>
                <span className="font-mono text-white print-text-white">{Number(receipt.tax_amount).toLocaleString()}</span>
              </div>
            )}
            {receipt.discount_amount > 0 && (
              <div className="flex justify-between text-[13px] font-bold text-[#00C896]">
                <span>Discount ({receipt.discount_percentage}%)</span>
                <span className="font-mono">-{Number(receipt.discount_amount).toLocaleString()}</span>
              </div>
            )}
            {receipt.shipping_fee > 0 && (
              <div className="flex justify-between text-[13px] font-bold text-[#8B949E] print-text-gray">
                <span>Shipping</span>
                <span className="font-mono text-white print-text-white">{Number(receipt.shipping_fee).toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* UPGRADED TOTAL BOX */}
          <div 
            style={{ 
              backgroundColor: `${brandColor}10`, 
              borderTopColor: brandColor,
              boxShadow: `0 -10px 40px -15px ${brandColor}40`
            }} 
            className="px-8 py-6 flex justify-between items-center border-t-2 relative z-10 print-bg-transparent print-border"
          >
            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#8B949E] print-text-gray">Total</span>
              
              {!business?.hide_watermark && (
                <div className="flex items-center gap-1.5 mt-1.5 opacity-70">
                  <ShieldCheck className="w-3.5 h-3.5 text-white print-text-gray" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-white print-text-gray">Powered by Receipta</span>
                </div>
              )}
            </div>
            
            <div className="text-right flex items-end">
               <span className="text-lg font-bold mr-1.5 text-[#8B949E] print-text-gray mb-1">{business.currency || '₦'}</span>
               <span className="text-4xl md:text-[42px] font-black font-mono tracking-tighter text-white drop-shadow-md print-text-white leading-none">
                 {Number(receipt.grand_total).toLocaleString()}
               </span>
            </div>
          </div>

          {/* COMPACT SECURITY FOOTER */}
          <div className="px-8 pt-6 pb-6 flex flex-col relative z-10 bg-[#0D1117] print-bg-transparent border-t border-white/5">
            
            {business.signature_url && (
              <div className="mb-5 flex flex-col items-center">
                <img src={business.signature_url} alt="Signature" className="h-12 object-contain mb-2 drop-shadow-md print-bg-transparent" crossOrigin="anonymous" />
                <div className="w-48 border-t border-white/20 pt-2 text-[9px] text-[#8B949E] uppercase font-black tracking-widest text-center print-border print-text-gray">Authorized Sign</div>
              </div>
            )}

            <p className="text-sm font-black text-white text-center mb-5 print-text-white">{business.footer_message || 'Thank you for your business!'}</p>
            
            {(business.warranty_policy || business.return_policy) && (
              <div className="w-full text-left bg-[#161B22] p-4 rounded-xl border border-white/5 space-y-1.5 mb-5 print-bg-transparent print-border">
                {business.warranty_policy && (
                  <p className="text-[9px] text-[#8B949E] font-bold leading-relaxed uppercase print-text-gray"><span className="text-white print-text-white">Warranty:</span> {business.warranty_policy}</p>
                )}
                {business.return_policy && (
                  <p className="text-[9px] text-[#8B949E] font-bold leading-relaxed uppercase print-text-gray"><span className="text-white print-text-white">Returns:</span> {business.return_policy}</p>
                )}
              </div>
            )}

            {/* VERIFICATION ID PILL (Pulled tightly under the content) */}
            <div className="flex justify-center w-full">
              <div className="flex items-center gap-2 bg-[#0A0C10] px-5 py-2.5 rounded-full border border-white/10 shadow-sm print-bg-transparent print-border">
                <ShieldCheck className="w-4 h-4" style={{ color: brandColor }} />
                <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest print-text-gray">ID: {receipt.verification_code}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

