// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css"; 

export const metadata: Metadata = {
  title: "Perfume Store - Order Form",
  description: "Place your order for payment upon delivery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}