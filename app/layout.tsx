// import './globals.css'
// import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
// import { ClerkProvider } from '@clerk/nextjs'

// import { ModalProvider } from '@/components/modal-provider'

// const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'Expel',
//   description: 'AI Platfrom',
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <ClerkProvider>
//       <html lang="en">
//         <body className={inter.className}>
//           {children}
//           <ModalProvider />
//           </body>
//       </html>
//     </ClerkProvider>
//   )
// }


import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

import { ModalProvider } from '@/components/modal-provider'

import './globals.css'
import { ToasterProvider } from '@/components/toaster-porvider'
import { CrispProvider } from '@/components/crisp-provider'

const font = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Expel',
  description: 'AI Platform',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <CrispProvider/>
        <body className={font.className}>
          <ToasterProvider/>
          <ModalProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}