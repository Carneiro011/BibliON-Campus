// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'BibliON Campus', template: '%s | BibliON Campus' },
  description: 'Plataforma colaborativa de materiais acadêmicos com IA',
  manifest: '/manifest.json',
  themeColor: '#2563eb',
  openGraph: {
    type: 'website',
    siteName: 'BibliON Campus',
    title: 'BibliON Campus',
    description: 'Compartilhe e descubra materiais acadêmicos com auxílio de IA',
  },
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
