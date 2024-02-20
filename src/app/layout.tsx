import React from 'react'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import localFont from 'next/font/local'
import DarkThemeProvider from '@/components/theme/DarkThemeProvider'

const rootFont = localFont({
  src: './fonts/Pretendard/PretendardVariable.woff2',
  display: 'swap',
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
    <html lang="ko">
      <head>
        <meta httpEquiv={'pragma'} content={'-1'} />
        <meta httpEquiv={'expires'} content={'no-cache'} />
      </head>
      <body className={rootFont.className}>
        <DarkThemeProvider>{children}</DarkThemeProvider>
      </body>
    </html>
  )
}
