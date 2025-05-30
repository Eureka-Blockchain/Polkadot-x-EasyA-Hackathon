import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Eureka - Blockchain-Based Bill Verification",
  description: "Verify your bills securely using blockchain technology to prevent fraud and ensure payment authenticity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} bg-white`}>
      <body className="flex flex-col min-h-screen bg-white text-gray-900">
        <div className="bg-white w-full min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow bg-white">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
