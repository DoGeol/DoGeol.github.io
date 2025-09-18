import React from 'react'
import type { Metadata, Viewport } from 'next'
import '@/shared/styles/globals.css'
import localFont from 'next/font/local'
import DarkThemeProvider from '@/features/theme-provider'
import GlobalHeader from '@/features/global-header'

const rootFont = localFont({
  src: '../shared/fonts/Pretendard/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
})

export const metadata: Metadata = {
  title: 'PDG Playground',
  description: 'PDG Playground',
  icons: {
    icon: `/favicon.ico`,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${rootFont.className} text-gray-700 dark:bg-neutral-900 dark:text-gray-300`}
      >
        <DarkThemeProvider>
          <GlobalHeader />
          {children}
        </DarkThemeProvider>
      </body>
    </html>
  )
}
