import type { Metadata } from 'next';
import Script from 'next/script';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Footer, NavBar } from '@/app/components';
import { createThemeBootstrapScript } from '@/app/lib';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Matias — Software Developer",
  description:
    "Personal website of Matias — showcasing projects across web, app, game, and embedded system development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {createThemeBootstrapScript()}
        </Script>
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
