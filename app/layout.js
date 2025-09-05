"use client";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-900 text-white">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
