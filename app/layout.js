import { Inter, Space_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceMono = Space_Mono({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono' 
});

export const metadata = {
  title: 'Mosaic Lens | CX Intelligence',
  description: 'Revenue-weighted complaint analysis dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
