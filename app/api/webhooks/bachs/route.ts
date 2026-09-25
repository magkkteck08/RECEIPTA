import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-bachs-signature')
    const secret = process.env.BACHS_WEBHOOK_SECRET || ''
    
    const hash = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')

    // 🔒 STRICT PRODUCTION SECURITY: Reject invalid webhooks immediately
    if (hash !== signature) {
      console.error('❌ Security Alert: Webhook signature mismatch. Blocked.')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    let payload;
    try {
      payload = JSON.parse(rawBody)
    } catch (parseError) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
    }

    if (payload.type === 'collection.succeeded' || payload.type === 'checkout.completed') {
      const userId = payload.data?.metadata?.user_id || payload.metadata?.user_id
      const planType = payload.data?.metadata?.plan_type || payload.metadata?.plan_type
      const customerEmail = payload.data?.customer?.email || payload.customer?.email
      
      if (userId && planType) {
        const targetTier = planType.split('_')[0] 
        const isPremium = targetTier === 'premium'
        
        const { error: dbError } = await supabaseAdmin
          .from('businesses') 
          .update({ subscription_tier: targetTier }) 
          .eq('user_id', userId)

        if (dbError) throw new Error('Database update failed')

        if (customerEmail) {
          const rawAmount = parseFloat(payload.data?.amount || '0')
          const formattedAmount = rawAmount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://receipta.cv'
          const planName = isPremium ? 'Serious Business (Premium)' : 'Growing Business (Basic)'
          
          try {
            await resend.emails.send({
              from: 'Receipta <support@magkk.receipta.cv>',
              to: customerEmail,
              subject: `Account Upgraded - Welcome to ${planName}`,
              html: `<div style="background-color: #0F1117; color: #EEEEF5; padding: 40px; font-family: sans-serif; border-radius: 12px; border: 1px solid #252733;">
                      <h2 style="color: #00C896; margin-top: 0;">Payment Successful</h2>
                      <p style="color: #737490; font-size: 16px;">Your subscription payment of <strong>${formattedAmount}</strong> was successfully processed.</p>
                      <p style="color: #EEEEF5; font-size: 16px; line-height: 1.5;">Your Receipta account is officially upgraded to the <strong>${planName}</strong> plan.</p>
                      <div style="margin-top: 30px;"><a href="${siteUrl}/dashboard" style="background-color: #00C896; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Go to Dashboard</a></div>
                     </div>`
            })
          } catch (emailError: any) {
            console.error("Welcome Email Failed to send:", emailError.message)
          }
        }
      }
    }
    return NextResponse.json({ received: true })
    
  } catch (err: any) {
    return NextResponse.json({ error: 'Webhook handler failed', details: err.message }, { status: 500 })
  }
}