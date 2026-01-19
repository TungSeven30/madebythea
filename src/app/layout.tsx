import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AudioProvider } from '@/providers/AudioProvider';

export const metadata: Metadata = {
  title: 'Made by Thea',
  description: 'Create and sell! A creative maker game for kids.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Made by Thea',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <AudioProvider>{children}</AudioProvider>
      </body>
    </html>
  );
}
