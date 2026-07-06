'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'react-hot-toast'
import { Package, Plus, Search, Trash2, Tag, Lock, Layers } from 'lucide-react'
import Link from 'next/link'

// Shadcn UI Imports
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function ProductsPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [business, setBusiness] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Added 'stock' to the new product state
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: biz } = await supabase.from('businesses').select('*').eq('user_id', user.id).single()
    if (biz) {
      setBusiness(biz)
      
      const { data: prodData } = await supabase
        .from('products')
        .select('*')
        .eq('business_id', biz.id)
        .order('created_at', { ascending: false })
      
      if (prodData) setProducts(prodData)
    }
    setLoading(false)
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault()
    // Validating the new stock field
    if (!newProduct.name || !newProduct.price || !newProduct.stock) return toast.error("Please fill all fields")

    setSaving(true)
    try {
      const { data, error } = await supabase.from('products').insert({
        business_id: business.id,
        name: newProduct.name,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock) // Pushing stock count to DB
      }).select().single()

      if (error) throw error

      toast.success('Product added to inventory! 📦', { 
        style: { background: '#1C1E28', color: '#FF6B4A', border: '1px solid #252733' } 
      })
      
      setProducts([data, ...products])
      // Resetting form including stock
      setNewProduct({ name: '', price: '', stock: '' })
    } catch (error: any) {
      toast.error(error.message || "Failed to add product")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      
      setProducts(products.filter(p => p.id !== id))
      toast.success("Product deleted.")
    } catch (error: any) {
      toast.error("Failed to delete product.")
    }
  }

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const inputTheme = "bg-[#15171F] border-[#252733] text-[#EEEEF5] placeholder:text-[#737490] focus-visible:ring-[#FF6B4A] focus-visible:border-[#FF6B4A] h-11"
  const labelTheme = "text-[11px] font-bold text-[#EEEEF5] uppercase tracking-wider mb-1.5 block"

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh] text-[#FF6B4A] animate-pulse font-bold tracking-widest text-sm">
      LOADING INVENTORY...
    </div>
  )

  // 🛑 THE PREMIUM FIREWALL (Client-Side)
  if (business?.subscription_tier === 'free') {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center px-4 relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F4C542] rounded-full blur-[200px] opacity-10 pointer-events-none"></div>
        <div className="w-20 h-20 bg-[#F4C542]/10 rounded-[2rem] flex items-center justify-center mb-6 border border-[#F4C542]/20 shadow-[0_0_30px_rgba(244,197,66,0.15)] relative z-10">
          <Lock className="w-10 h-10 text-[#F4C542]" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight relative z-10">Inventory is a Pro Feature</h2>
        <p className="text-[#737490] max-w-md mb-8 leading-relaxed relative z-10">
          Upgrade to Receipta Pro to manage your product inventory, track stock levels, and speed up your receipt generation.
        </p>
        <Link href="/dashboard/settings" className="relative z-10 px-8 py-4 bg-gradient-to-r from-[#F4C542] to-[#F59E0B] text-[#0F1117] font-black rounded-xl hover:opacity-90 transition-all shadow-[0_0_20px_rgba(244,197,66,0.3)]">
          UPGRADE TO PRO
        </Link>
      </div>
    )
  }

  // ✅ IF PRO, SHOW THE CATALOG
  return (
    <div className="min-h-full bg-[#0F1117] rounded-3xl border border-[#252733] shadow-2xl relative overflow-hidden pb-10">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF6B4A] rounded-full blur-[150px] opacity-5 pointer-events-none"></div>

      <div className="relative z-10 p-4 md:p-8 space-y-8">
        <div className="border-b border-[#252733] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Product Catalog</h1>
            <p className="text-[#737490] mt-1 text-sm font-medium">Manage your items and track available stock levels.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-[#1C1E28] border border-[#252733] px-4 py-2 rounded-xl">
            <Package className="w-5 h-5 text-[#FF6B4A]" />
            <span className="text-white font-bold">{products.length} <span className="text-[#737490] font-medium text-sm">Items saved</span></span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Add New Product Form */}
          <div className="xl:col-span-1">
            <Card className="bg-[#1C1E28] border-[#252733] shadow-xl overflow-hidden sticky top-8">
              <CardHeader className="bg-[#15171F] border-b border-[#252733] pb-4">
                <CardTitle className="flex items-center text-white text-lg">
                  <div className="p-2 bg-[#FF6B4A]/10 rounded-lg mr-3"><Tag className="w-5 h-5 text-[#FF6B4A]" /></div>
                  Add New Item
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleAddProduct} className="space-y-5">
                  <div>
                    <Label className={labelTheme}>Product / Gadget Name <span className="text-[#FB7185]">*</span></Label>
                    <Input required placeholder="e.g. MacBook Pro M3" className={inputTheme} value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                  </div>
                  <div>
                    <Label className={labelTheme}>Default Price ({business?.currency || '₦'}) <span className="text-[#FB7185]">*</span></Label>
                    <Input required type="number" min="0" placeholder="e.g. 1500000" className={inputTheme} value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                  </div>
                  
                  {/* NEW STOCK FIELD */}
                  <div>
                    <Label className={labelTheme}>Available Stock <span className="text-[#FB7185]">*</span></Label>
                    <div className="relative">
                      <Layers className="absolute left-3 top-3.5 w-4 h-4 text-[#737490]" />
                      <Input required type="number" min="0" placeholder="e.g. 50" className={`${inputTheme} pl-10`} value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={saving} className="w-full h-12 mt-2 bg-[#FF6B4A] hover:bg-[#E05535] text-white font-bold rounded-xl shadow-[0_0_15px_rgba(255,107,74,0.2)] transition-all">
                    <Plus className="w-4 h-4 mr-2" />
                    {saving ? 'SAVING...' : 'SAVE TO INVENTORY'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Product List */}
          <div className="xl:col-span-2 space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#737490]" />
              <Input 
                placeholder="Search inventory..." 
                className="w-full h-12 pl-12 bg-[#1C1E28] border-[#252733] text-white placeholder:text-[#737490] focus-visible:ring-[#FF6B4A] focus-visible:border-[#FF6B4A] rounded-xl shadow-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="bg-[#1C1E28] border border-[#252733] rounded-2xl overflow-hidden shadow-xl">
              {filteredProducts.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center bg-[#15171F]">
                  <Package className="w-12 h-12 text-[#737490] mb-4 opacity-20" />
                  <h3 className="text-white font-bold text-lg">No products found</h3>
                  <p className="text-[#737490] text-sm mt-1">Add items to your catalog to generate receipts faster.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#252733]">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="p-4 md:p-6 flex items-center justify-between gap-4 hover:bg-[#15171F]/50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#60A5FA]/20 to-[#60A5FA]/5 border border-[#60A5FA]/20 flex items-center justify-center text-[#60A5FA]">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-base">{product.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="text-sm font-bold text-[#FF6B4A]">
                              {business?.currency || '₦'}{Number(product.price).toLocaleString()}
                            </div>
                            <span className="text-[#4b5563] text-[10px]">•</span>
                            
                            {/* NEW STOCK BADGE */}
                            <div className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                              Number(product.stock) > 0 
                                ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' 
                                : 'bg-[#FB7185]/10 text-[#FB7185] border border-[#FB7185]/20'
                            }`}>
                              {product.stock || 0} IN STOCK
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 rounded-lg text-[#737490] hover:bg-[#FB7185]/10 hover:text-[#FB7185] transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
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
