import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Joey AI Agent',
  description: 'Web Frontend for Joey AI Agent - Build websites with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
