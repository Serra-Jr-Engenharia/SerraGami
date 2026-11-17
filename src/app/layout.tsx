import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Serra Jr Gamificação',
  description: 'Sistema de Gamificação da Serra Jr',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
