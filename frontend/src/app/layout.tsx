// src/app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'BibliON Campus', template: '%s | BibliON Campus' },
  description: 'Plataforma colaborativa de materiais acadêmicos com IA',
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    siteName: 'BibliON Campus',
    title: 'BibliON Campus',
    description: 'Compartilhe e descubra materiais acadêmicos com auxílio de IA',
  },
}

// themeColor foi movido para `viewport` no Next.js 14
export const viewport: Viewport = {
  themeColor: '#2563eb',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
