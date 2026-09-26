'use server'

import { redirect } from 'next/navigation'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = 'Receipta Founder <support@magkk.receipta.cv>'

export async function handleLogin(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const founderEmail = process.env.NEXT_PUBLIC_FOUNDER_EMAIL?.toLowerCase() || 'MISSING_IN_VERCEL'

  const supabase = await createServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) redirect('/super-admin?error=Invalid admin credentials')
  
  if (email.toLowerCase() !== founderEmail) {
    await supabase.auth.signOut() 
    redirect(`/super-admin?error=Unauthorized account`)
  }
  redirect('/super-admin')
}

export async function handleLogout() {
  const supabase = await createServerClient()
  await supabase.auth.signOut()
  redirect('/super-admin')
}

// 🚀 SEND SINGLE EMAIL
export async function sendVendorEmail(to: string, subject: string, message: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      text: message, // Anti-spam fallback
      html: buildEmailTemplate(subject, message)
    })
    return { success: true }
  } catch (e: any) {
    return { error: e.message }
  }
}

// 🚀 SEND BULK BROADCAST EMAIL (Fixed with Batch API to prevent skipping)
export async function sendBroadcastEmail(emails: string[], subject: string, message: string) {
  try {
    // Resend Batch API allows up to 100 emails per request safely
    const BATCH_SIZE = 100;
    
    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);
      
      const payload = batch.map(email => ({
        from: FROM_EMAIL,
        to: email,
        subject,
        text: message, // Anti-spam fallback
        html: buildEmailTemplate(subject, message)
      }))

      await resend.batch.send(payload)
    }
    
    return { success: true }
  } catch (e: any) {
    return { error: e.message }
  }
}

// Beautiful HTML Wrapper with Anti-Spam Footer
function buildEmailTemplate(subject: string, message: string) {
  return `
    <div style="background-color: #0F1117; color: #EEEEF5; padding: 40px; font-family: sans-serif; border-radius: 12px; border: 1px solid #252733; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #00C896; margin-top: 0;">${subject}</h2>
      <p style="color: #EEEEF5; font-size: 16px; line-height: 1.6;">${message.replace(/\n/g, '<br/>')}</p>
      <br/>
      <div style="border-top: 1px solid #252733; padding-top: 20px; margin-top: 20px;">
        <p style="color: #737490; font-size: 14px; margin: 0;"><strong>IdanMagkk</strong></p>
        <p style="color: #737490; font-size: 12px; margin: 0;">Founder, Receipta</p>
        
        <p style="color: #5C6478; font-size: 10px; margin-top: 30px; line-height: 1.5;">
          You are receiving this email because you registered as a vendor on Receipta. 
          If you no longer wish to receive these updates, please reply to this email with "Unsubscribe".<br/>
          Receipta HQ, Lagos, Nigeria.
        </p>
      </div>
    </div>
  `
}