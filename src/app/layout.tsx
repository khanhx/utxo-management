import type { Metadata } from 'next'
import { DM_Sans, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ToastProvider } from '@/components/ui/toast'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans'
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk'
})

export const metadata: Metadata = {
  title: 'Bitcoin UTXO Manager',
  description: 'Manage your Bitcoin UTXOs, build transactions, and use RBF',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${dmSans.variable} ${spaceGrotesk.variable} min-h-screen font-sans transition-colors duration-300 bg-gradient-to-br dark:from-[#0F172A] dark:to-[#1E293B] dark:text-[#F8FAFC] light:from-gray-50 light:to-white light:text-gray-900`}>
        <ThemeProvider>
          <ToastProvider>
            <div className="min-h-screen">
              <Navbar />
              <main className="container mx-auto px-4 py-8 pt-24">
                {children}
              </main>
            </div>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
