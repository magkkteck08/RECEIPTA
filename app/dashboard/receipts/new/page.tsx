'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'react-hot-toast'
import { Receipt, User, Plus, Trash2, Calculator, Save, Smartphone, ChevronDown, ChevronUp } from 'lucide-react'

// Shadcn Overrides
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function CreateReceiptPage() {
  const supabase = createClient()
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [business, setBusiness] = useState<any>(null)

  // Form State
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '' })
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer')
  
  // Shipping initialized as empty string for smooth UX
  const [shipping, setShipping] = useState<number | string>('')
  
  // Dynamic Items State with <any[]> to satisfy TypeScript
  const [items, setItems] = useState<any[]>([
    { 
      id: 1, 
      name: '', 
      serial_number: '', 
      quantity: 1, 
      price: '', // Empty by default so there's no "0" to delete
      showGadgetMode: false,
      condition: 'Brand New',
      specs: '',
      color: '',
      imei1: '',
      imei2: '',
      sn: ''
    }
  ])

  // Fetch Business Defaults on Load
  useEffect(() => {
    async function loadDefaults() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('businesses').select('*').eq('user_id', user.id).single()
        if (data) setBusiness(data)
      }
      setLoading(false)
    }
    loadDefaults()
  }, [])

  // 🧮 LIVE MATH ENGINE 
  const subtotal = items.reduce((sum, item) => sum + ((Number(item.quantity) || 1) * (Number(item.price) || 0)), 0)
  const taxRate = business?.default_tax || 0
  const discountRate = business?.default_discount || 0
  
  const taxAmount = (subtotal * taxRate) / 100
  const discountAmount = (subtotal * discountRate) / 100
  const grandTotal = subtotal + taxAmount - discountAmount + (Number(shipping) || 0)

  // Handle Dynamic Items
  const addItem = () => {
    setItems([
      ...items, 
      { 
        id: Date.now(), 
        name: '', 
        serial_number: '', 
        quantity: 1, 
        price: '', 
        showGadgetMode: false, 
        condition: 'Brand New', 
        specs: '', 
        color: '', 
        imei1: '', 
        imei2: '', 
        sn: '' 
      }
    ])
  }

  const removeItem = (id: number) => {
    if (items.length === 1) return toast.error("You need at least one item!")
    setItems(items.filter(item => item.id !== id))
  }

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  // 🚀 SAVE TO DATABASE 
  async function handleGenerateReceipt(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      // Validate that at least a name is provided. Price can be 0 (Free/Bonus).
      if (items.some(i => !i.name)) {
        throw new Error("Please provide an Item Name for all products.")
      }

      const receiptNumber = `${business.receipt_prefix}-${business.receipt_start_number + Math.floor(Math.random() * 1000)}`
      const verificationCode = `VRF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`

      // Insert Receipt Master Record
      const { data: receipt, error: receiptError } = await supabase.from('receipts').insert({
        business_id: business.id,
        receipt_number: receiptNumber,
        verification_code: verificationCode,
        payment_method: paymentMethod,
        subtotal: subtotal,
        tax_percentage: taxRate,
        tax_amount: taxAmount,
        discount_percentage: discountRate,
        discount_amount: discountAmount,
        shipping_fee: Number(shipping) || 0,
        grand_total: grandTotal,
        amount_paid: grandTotal, 
        warranty_days: business.default_warranty_days || 0,
      }).select().single()

      if (receiptError) throw receiptError

      // Format Line Items beautifully for the DB
      const lineItems = items.map(item => {
        let finalItemName = item.name
        let finalSerialNumber = item.serial_number ? `S/N: ${item.serial_number}` : '' 
        
        // Build the Gadget Strings if Gadget Mode is active
        if (item.showGadgetMode) {
          const specsArray = []
          if (item.condition) specsArray.push(item.condition)
          if (item.specs) specsArray.push(item.specs)
          if (item.color) specsArray.push(item.color)
          
          if (specsArray.length > 0) {
            finalItemName = `${item.name} (${specsArray.join(' | ')})`
          }

          const serialArray = []
          if (item.imei1) serialArray.push(`IMEI 1: ${item.imei1}`)
          if (item.imei2) serialArray.push(`IMEI 2: ${item.imei2}`)
          if (item.sn) serialArray.push(`S/N: ${item.sn}`)
          
          if (serialArray.length > 0) {
            finalSerialNumber = serialArray.join('\n') // Stacks them neatly
          }
        }

        return {
          receipt_id: receipt.id,
          item_name: finalItemName,
          serial_number: finalSerialNumber,
          quantity: Number(item.quantity) || 1,
          unit_price: Number(item.price) || 0, // Fallback to 0 if left blank
          total_price: (Number(item.quantity) || 1) * (Number(item.price) || 0)
        }
      })

      const { error: itemsError } = await supabase.from('receipt_items').insert(lineItems)
      if (itemsError) throw itemsError

      toast.success('Receipt Generated Successfully! 🎉', { 
        style: { background: '#1C1E28', color: '#FF6B4A', border: '1px solid #252733' } 
      })
      
      router.push(`/dashboard/receipts/${receipt.id}`) 

    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  // UI Themes
  const inputTheme = "bg-[#15171F] border-[#252733] text-[#EEEEF5] placeholder:text-[#737490] focus-visible:ring-[#FF6B4A] focus-visible:border-[#FF6B4A]"
  const labelTheme = "text-[11px] font-bold text-[#EEEEF5] uppercase tracking-wider mb-1.5 block"

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-[#FF6B4A] animate-pulse font-bold tracking-widest text-sm flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-[#FF6B4A] border-t-transparent rounded-full animate-spin mb-4"></div>
        INITIALIZING SECURE TERMINAL...
      </div>
    </div>
  )

  return (
    <div className="min-h-full bg-[#0F1117] rounded-3xl border border-[#252733] shadow-2xl overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF6B4A] rounded-full blur-[150px] opacity-5 pointer-events-none"></div>

      <form onSubmit={handleGenerateReceipt} className="relative z-10 p-4 md:p-8">
        
        {/* Header */}
        <div className="border-b border-[#252733] pb-6 mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">Create Receipt</h1>
          <p className="text-[#737490] mt-1 text-sm">Fill in the transaction details to generate a secure invoice.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Inputs */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Customer Information Card */}
            <Card className="bg-[#1C1E28] border-[#252733] shadow-xl overflow-hidden">
              <CardHeader className="bg-[#15171F] border-b border-[#252733] pb-4">
                <CardTitle className="flex items-center text-white text-lg">
                  <div className="p-2 bg-[#60A5FA]/10 rounded-lg mr-3">
                    <User className="w-5 h-5 text-[#60A5FA]" />
                  </div>
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <Label className={labelTheme}>Customer Name (Optional)</Label>
                  <Input 
                    placeholder="e.g. Chioma Obi" 
                    className={inputTheme} 
                    value={customer.name} 
                    onChange={(e) => setCustomer({...customer, name: e.target.value})} 
                  />
                </div>
                <div>
                  <Label className={labelTheme}>Phone Number</Label>
                  <Input 
                    placeholder="090..." 
                    className={inputTheme} 
                    value={customer.phone} 
                    onChange={(e) => setCustomer({...customer, phone: e.target.value})} 
                  />
                </div>
                <div>
                  <Label className={labelTheme}>Email Address</Label>
                  <Input 
                    type="email" 
                    placeholder="client@email.com" 
                    className={inputTheme} 
                    value={customer.email} 
                    onChange={(e) => setCustomer({...customer, email: e.target.value})} 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Line Items Card */}
            <Card className="bg-[#1C1E28] border-[#252733] shadow-xl overflow-hidden">
              <CardHeader className="bg-[#15171F] border-b border-[#252733] pb-4 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center text-white text-lg">
                  <div className="p-2 bg-[#F4C542]/10 rounded-lg mr-3">
                    <Receipt className="w-5 h-5 text-[#F4C542]" />
                  </div>
                  Purchased Items
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                
                {items.map((item, index) => (
                  <div key={item.id} className="p-5 bg-[#15171F] border border-[#252733] rounded-xl relative group transition-all">
                    
                    {/* Delete Item Button */}
                    <div className="absolute -top-3 -right-3 z-10">
                      <button 
                        type="button" 
                        onClick={() => removeItem(item.id)} 
                        className="bg-[#1C1E28] border border-[#252733] text-[#FB7185] p-2 rounded-full hover:bg-[#FB7185] hover:text-white transition-all shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Basic Item Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                      <div className="sm:col-span-6">
                        <Label className={labelTheme}>Item / Device Name <span className="text-[#FB7185]">*</span></Label>
                        <Input 
                          required 
                          placeholder="e.g. MacBook Pro M2" 
                          className={inputTheme} 
                          value={item.name} 
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)} 
                        />
                      </div>
                      
                      <div className="sm:col-span-2">
                        <Label className={labelTheme}>Qty <span className="text-[#FB7185]">*</span></Label>
                        <Input 
                          required 
                          type="text" 
                          inputMode="numeric"
                          className={inputTheme} 
                          value={item.quantity === '' ? '' : item.quantity} 
                          onChange={(e) => {
                            const rawNumericText = e.target.value.replace(/[^0-9]/g, '')
                            updateItem(item.id, 'quantity', rawNumericText === '' ? '' : Number(rawNumericText))
                          }} 
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <Label className={labelTheme}>Unit Price ({business?.currency || '₦'}) (Optional)</Label>
                        <Input 
                          type="text" 
                          inputMode="numeric"
                          placeholder="e.g. 150,000"
                          className={`${inputTheme} font-mono font-bold`} 
                          value={item.price === '' || item.price === 0 ? '' : Number(item.price).toLocaleString('en-US')} 
                          onChange={(e) => {
                            const rawNumericText = e.target.value.replace(/[^0-9]/g, '')
                            updateItem(item.id, 'price', rawNumericText === '' ? '' : Number(rawNumericText))
                          }} 
                        />
                      </div>
                    </div>

                    {/* Gadget Mode Toggle */}
                    <div className="mt-4 border-t border-[#252733] pt-4">
                      <button 
                        type="button" 
                        onClick={() => updateItem(item.id, 'showGadgetMode', !item.showGadgetMode)} 
                        className={`text-xs font-bold flex items-center transition-colors ${item.showGadgetMode ? 'text-[#FF6B4A]' : 'text-[#737490] hover:text-white'}`}
                      >
                        <Smartphone className="w-4 h-4 mr-1.5" /> 
                        {item.showGadgetMode ? 'Hide Gadget Specs' : 'Add Gadget Specs (Phones, Laptops)'}
                        {item.showGadgetMode ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                      </button>
                    </div>

                    {/* Gadget Mode Expanded UI */}
                    {item.showGadgetMode ? (
                      <div className="mt-4 p-4 bg-[#1C1E28] border-l-2 border-[#FF6B4A] rounded-r-lg grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in slide-in-from-top-2 duration-200">
                        <div className="space-y-1.5">
                          <Label className={labelTheme}>Condition</Label>
                          <select 
                            className={`flex h-10 w-full rounded-md px-3 py-2 text-sm appearance-none ${inputTheme}`} 
                            value={item.condition} 
                            onChange={(e) => updateItem(item.id, 'condition', e.target.value)}
                          >
                            <option value="Brand New">Brand New</option>
                            <option value="UK Used">UK Used</option>
                            <option value="Nigerian Used">Nigerian Used</option>
                            <option value="Refurbished">Refurbished</option>
                            <option value="Open Box">Open Box</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className={labelTheme}>Specs (RAM/ROM)</Label>
                          <Input 
                            placeholder="e.g. 16GB / 512GB" 
                            className={inputTheme} 
                            value={item.specs} 
                            onChange={(e) => updateItem(item.id, 'specs', e.target.value)} 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className={labelTheme}>Color</Label>
                          <Input 
                            placeholder="e.g. Space Gray" 
                            className={inputTheme} 
                            value={item.color} 
                            onChange={(e) => updateItem(item.id, 'color', e.target.value)} 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className={labelTheme}>IMEI 1</Label>
                          <Input 
                            placeholder="15-digit code..." 
                            className={inputTheme} 
                            value={item.imei1} 
                            onChange={(e) => updateItem(item.id, 'imei1', e.target.value)} 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className={labelTheme}>IMEI 2 (Optional)</Label>
                          <Input 
                            placeholder="15-digit code..." 
                            className={inputTheme} 
                            value={item.imei2} 
                            onChange={(e) => updateItem(item.id, 'imei2', e.target.value)} 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className={labelTheme}>Serial Number (S/N)</Label>
                          <Input 
                            placeholder="Alphanumeric S/N..." 
                            className={inputTheme} 
                            value={item.sn} 
                            onChange={(e) => updateItem(item.id, 'sn', e.target.value)} 
                          />
                        </div>
                      </div>
                    ) : (
                      // Basic Serial Number input if Gadget Mode is off
                      <div className="mt-4 relative">
                         <Label className={labelTheme}>Serial Number (Optional)</Label>
                         <Input 
                           placeholder="Simple S/N" 
                           className={`${inputTheme} pl-8`} 
                           value={item.serial_number} 
                           onChange={(e) => updateItem(item.id, 'serial_number', e.target.value)} 
                         />
                         <Smartphone className="w-4 h-4 absolute bottom-3 left-3 text-[#737490]" />
                      </div>
                    )}
                  </div>
                ))}
                
                <Button 
                  type="button" 
                  onClick={addItem} 
                  variant="outline" 
                  className="w-full mt-2 border-dashed border-[#252733] bg-transparent text-[#FF6B4A] hover:bg-[#FF6B4A]/10 hover:border-[#FF6B4A] h-12 rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" /> ADD ANOTHER ITEM
                </Button>
              </CardContent>
            </Card>

            {/* Payment & Shipping Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <Label className={labelTheme}>Payment Method</Label>
                  <select 
                    className={`flex h-10 w-full rounded-md px-3 py-2 text-sm appearance-none ${inputTheme}`} 
                    value={paymentMethod} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="POS / Card">POS / Card</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className={labelTheme}>Shipping / Delivery Fee</Label>
                  <Input 
                    type="text" 
                    inputMode="numeric" 
                    className={`${inputTheme} font-mono font-bold`} 
                    value={shipping === '' ? '' : Number(shipping).toLocaleString('en-US')} 
                    onChange={(e) => { 
                      const rawNumericText = e.target.value.replace(/[^0-9]/g, ''); 
                      setShipping(rawNumericText === '' ? '' : Number(rawNumericText)) 
                    }} 
                  />
                </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Summary Sticky Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="bg-[#1C1E28] border-[#252733] shadow-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-br from-[#FF6B4A]/10 to-transparent border-b border-[#252733] pb-4">
                  <CardTitle className="flex items-center text-white text-lg">
                    <Calculator className="w-5 h-5 text-[#FF6B4A] mr-3" /> 
                    Live Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  
                  <div className="flex justify-between text-[#EEEEF5] text-sm">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">{business?.currency || '₦'}{subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-[#EEEEF5] text-sm">
                    <span>Tax ({taxRate}%)</span>
                    <span className="text-[#FB7185] font-medium">+{business?.currency || '₦'}{taxAmount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-[#EEEEF5] text-sm">
                    <span>Discount ({discountRate}%)</span>
                    <span className="text-[#FF6B4A] font-medium">-{business?.currency || '₦'}{discountAmount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-[#EEEEF5] text-sm pb-4 border-b border-[#252733]">
                    <span>Shipping</span>
                    <span className="text-white font-medium">+{business?.currency || '₦'}{(Number(shipping) || 0).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-end pt-2">
                    <span className="text-white font-bold text-lg">Grand Total</span>
                    <span className="text-3xl font-black text-[#FF6B4A]">{business?.currency || '₦'}{grandTotal.toLocaleString()}</span>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={saving} 
                    className="w-full h-14 mt-6 bg-gradient-to-r from-[#FF6B4A] to-[#E05535] text-[#0F1117] hover:from-[#E05535] hover:to-[#10B981] font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(110,231,183,0.2)] hover:shadow-[0_0_30px_rgba(110,231,183,0.4)] transition-all"
                  >
                    <Save className="w-5 h-5 mr-2" /> 
                    {saving ? 'GENERATING...' : 'ISSUE RECEIPT'}
                  </Button>
                  
                  <p className="text-center text-[10px] text-[#737490] uppercase tracking-widest mt-4">
                    Secure 256-bit encryption
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
        </div>
      </form>
    </div>
  )
}