'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { CartProvider } from "@/context/CartContext";
import Navigation from "@/components/common/Navigation";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider>
          <CartProvider>
            <NavigationWrapper>{children}</NavigationWrapper>
          </CartProvider>
        </AppProvider>
      </body>
    </html>
  );
}

function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCustomerPage = pathname.startsWith('/menu') || pathname.startsWith('/confirmation');

  return (
    <>
      <Navigation />
      <main className={isCustomerPage ? '' : 'pt-16 lg:pl-64'}>
        {children}
      </main>
    </>
  );
}
