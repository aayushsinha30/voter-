import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'VoteWise | Your AI-Powered Civic Command Center',
  description: 'The smartest way to prepare for elections. AI-powered voting roadmaps, misinformation detection, manifesto decoding, and civic education — all personalized for your country.',
  keywords: 'voting, elections, civic education, fact-checking, voter registration, democracy, AI, Google Gemini',
  openGraph: {
    title: 'VoteWise | AI-Powered Civic Command Center',
    description: 'AI-powered voting roadmaps, fact-checking, and civic education personalized for your country.',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {/* Google Analytics via gtag.js */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VOTEWISE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VOTEWISE');
          `}
        </Script>
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen">
        <div className="animated-bg" aria-hidden="true" />
        {children}
        <Toaster />
      </body>
    </html>
  );
}