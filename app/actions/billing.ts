'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function createSubscriptionCheckout(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/login?message=Please log in to upgrade')
  }

  const plan = formData.get('plan') as string 
  const cycle = formData.get('cycle') as string 

  // IMPORTANT: Replace these with your actual Product IDs from the Bachs dashboard
  let productId = ''
  if (plan === 'premium' && cycle === 'yearly') productId = 'prod_caf5a18dd91741c599fe'
  else if (plan === 'premium' && cycle === 'monthly') productId = 'prod_2e40940594624c7298f9'
  else if (plan === 'basic' && cycle === 'yearly') productId = 'prod_6ae585b993554a67902d'
  else if (plan === 'basic' && cycle === 'monthly') productId = 'prod_e235736d41034d16b007'

  if (!productId) {
    redirect('/dashboard/upgrade?message=Invalid plan selected')
  }

  // 🚀 THE FIX: Dynamically grab domain, but FORCE Ngrok if on localhost
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  
  const origin = host.includes('localhost')
    ? 'https://voncile-accommodable-radically.ngrok-free.dev' // Your active Ngrok URL
    : `https://${host}` // Your live production URL (e.g., receipta.cv)

  let sessionUrl = ''

  
  try {
    const payload = {
      product_cart: [
        { product_id: productId, quantity: 1 }
      ],
      customer: { 
        email: user.email 
      },
      return_url: `${origin}/dashboard?payment=success`,
      cancel_url: `${origin}/dashboard/upgrade?payment=cancelled`,
      metadata: {
        user_id: user.id,             
        plan_type: `${plan}_${cycle}` // We will parse this in the webhook!
      }
    }

    // Ping the Bachs SANDBOX endpoint
    const response = await fetch('https://sandbox-api.bachs.io/v1/checkout-sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.BACHS_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Bachs API Rejected Request:", data)
      throw new Error(data.message || "Failed to initialize payment gateway")
    }

    // Extract the URL exactly as specified by the Bachs docs
    sessionUrl = data.checkout_url

    if (!sessionUrl) {
      throw new Error("No checkout_url returned from Bachs")
    }

  } catch (error) {
    console.error("Native Fetch Checkout Error:", error)
    redirect('/dashboard/upgrade?message=Payment gateway temporarily unavailable')
  }

  redirect(sessionUrl)
}