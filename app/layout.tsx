import type { Metadata } from "next";
import { AuthProvider } from '@/components/providers/AuthProvider';
import "./globals.css";

export const metadata: Metadata = {
  title: "DockChain - Blockchain Document Verification",
  description: "Verify and Issue Documents Securely with Blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
