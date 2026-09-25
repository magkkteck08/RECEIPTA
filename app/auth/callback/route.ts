import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // Defaults to the onboarding setup page unless a specific ?next= parameter is provided
  const next = searchParams.get('next') ?? '/dashboard/setup'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.error('SUPABASE CALLBACK ERROR:', error.message)
    }
  }

  // If no code is present or the exchange fails, return them to login
  return NextResponse.redirect(`${origin}/login?message=Invalid or expired link`)
}