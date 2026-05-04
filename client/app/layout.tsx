import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '../components/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'PitchPerfect Analytics',
  description: 'National cricket team operations dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-dashboard-light text-dashboard-dark font-sans antialiased min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
