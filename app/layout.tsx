import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Receipta | Verified Digital Receipts',
  description: 'Generate, verify, and manage professional digital receipts instantly. Bank-grade security for modern businesses.',
  keywords: ['receipt generator', 'digital receipts', 'business invoice', 'receipta', 'business management'],
  
  // 📱 Added this so the "Add to Home Screen" mobile app feature works perfectly!
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Receipta',
  },
  
  openGraph: {
    title: 'Receipta | Verified Digital Receipts',
    description: 'View and verify this secure digital transaction. Powered by Receipta.',
    url: 'https://receipta.com',
    siteName: 'Receipta',
    images: [
      {
        // Premium placeholder image for WhatsApp/Twitter previews
        url: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=1200&auto=format&fit=crop', 
        width: 1200,
        height: 630,
        alt: 'Receipta Secure Transaction',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Receipta | Verified Digital Receipts',
    description: 'View and verify this secure digital transaction. Powered by Receipta.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* 🎨 Added the dark theme background here so it doesn't flash white on load */}
      <body className="bg-[#0F1117] text-[#EEEEF5] antialiased">
        
        {/* Renders whatever page you are currently on */}
        {children}
        
        {/* Themed the toaster so the success/error popups match your dark UI */}
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: '#1C1E28',
              color: '#EEEEF5',
              border: '1px solid #252733',
            }
          }}
        />
      </body>
    </html>
  )
}