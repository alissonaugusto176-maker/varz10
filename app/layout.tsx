import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'VARZ10', description: 'A várzea em outro nível.' };

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
