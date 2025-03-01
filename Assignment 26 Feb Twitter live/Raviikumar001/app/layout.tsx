import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'book store',
  description: 'library book',
  generator: 'book',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
