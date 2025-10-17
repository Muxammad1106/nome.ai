import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'nome.ai frontend',
  description: 'Minimal Next.js app scaffold.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
