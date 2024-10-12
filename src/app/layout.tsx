import React from 'react'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import localFont from 'next/font/local'
import DarkThemeProvider from '@/components/theme/DarkThemeProvider'
import GlobalNavigation from '@/components/nav'

const rootFont = localFont({
  src: './fonts/Pretendard/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
})

export const metadata: Metadata = {
  title: "DoGeol's Playground",
  description: "DoGeol's Playground",
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
      <head>
        <meta httpEquiv={'pragma'} content={'-1'} />
        <meta httpEquiv={'expires'} content={'no-cache'} />
      </head>
      <body
        suppressHydrationWarning
        className={`${rootFont.className} text-gray-700 dark:bg-neutral-900 dark:text-gray-300`}
      >
        <DarkThemeProvider>
          <GlobalNavigation />
          {children}
        </DarkThemeProvider>
      </body>
    </html>
  )
}
