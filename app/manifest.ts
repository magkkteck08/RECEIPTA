import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Receipta App',
    short_name: 'Receipta',
    description: 'Professional Digital Receipt Generator',
    start_url: '/dashboard',
    display: 'standalone', // This is the magic word that removes the browser URL bar!
    background_color: '#0F1117',
    theme_color: '#FF6B4A',
    icons: [
      {
        src: '/icon.png', // We need to add an icon to your 'public' folder
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}