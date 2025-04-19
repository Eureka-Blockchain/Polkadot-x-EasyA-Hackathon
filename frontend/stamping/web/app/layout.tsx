import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Eureka - Secure PDF Stamping Service",
  description: "Upload your PDFs for secure stamping using blockchain technology to prevent fraud and ensure document authenticity.",
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
          <AuthProvider>
            <Header />
            <main className="flex-grow bg-white">{children}</main>
            <Footer />
          </AuthProvider>
        </div>
      </body>
    </html>
  );
} 