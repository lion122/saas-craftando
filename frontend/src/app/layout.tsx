import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/providers/CartProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Craftando SaaS",
  description: "Plataforma de e-commerce como serviço",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <header className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                  <div className="flex items-center">
                    <Link href="/" className="flex items-center">
                      <span className="text-2xl font-bold text-indigo-600">CraftandoSaaS</span>
                    </Link>
                    <nav className="ml-10 flex items-center space-x-4">
                      <Link href="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                        Início
                      </Link>
                      <Link href="/products" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                        Produtos
                      </Link>
                    </nav>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link href="/auth/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                      Entrar
                    </Link>
                    <Link href="/auth/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                      Criar Conta
                    </Link>
                  </div>
                </div>
              </div>
            </header>
            {children}
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
