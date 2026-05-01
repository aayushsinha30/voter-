import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'VoteWise | Your AI-Powered Civic Command Center',
  description: 'The smartest way to prepare for elections. AI-powered voting roadmaps, misinformation detection, manifesto decoding, and civic education — all personalized for your country.',
  keywords: 'voting, elections, civic education, fact-checking, voter registration, democracy',
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
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen">
        <div className="animated-bg" />
        {children}
        <Toaster />
      </body>
    </html>
  );
}