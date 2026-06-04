import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastContainer } from "@/components/Toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Valsy — Premium Fashion",
  description: "Discover premium fashion with Valsy. Shop the latest collections with style.",
  keywords: ["fashion", "ecommerce", "clothing", "premium"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-[#0a0a0f] text-slate-200 antialiased">
        <CartProvider>
          <Navbar />
          <main className="pt-16">{children}</main>
          <Footer />
          <ToastContainer />
        </CartProvider>
      </body>
    </html>
  );
}
