import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider, UserButton,  } from '@clerk/nextjs';
import Head from 'next/head'; // Import Head component

import { ModalProvider } from '@/components/modal-provider';
import './globals.css';
import { ToasterProvider } from '@/components/toaster-porvider';
import { CrispProvider } from '@/components/crisp-provider';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { AppProps } from 'next/app';

const font = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Expel',
  description: 'AI Platform',
};

export default function RootLayout({
  children,
  pageProps, // Pass pageProps as a prop
}: {
  children: React.ReactNode;
  pageProps: AppProps; // Adjust the type of pageProps if needed
}) {
  return (
    <ClerkProvider {...pageProps} appearance={
      {
        variables: {
          borderRadius:"0.2rem"
        }
      }
    }>
      <html lang="en" suppressHydrationWarning>
        <Head>
          <link rel="icon" href="./favicon.ico" />
        </Head>
        <body className={`bg-[var(--background)] text-var(--foreground) ${font.className}`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ToasterProvider />
          <ModalProvider />
          {children}
          <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
