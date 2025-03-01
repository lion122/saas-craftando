"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartContext } from '@/providers/CartProvider';
import { formatPrice } from '@/utils/format';
import { ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

// Componentes UI
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, subtotal, clearCart } = useCartContext();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Verificar se o usuário está autenticado
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirecionar para a página de login com parâmetro de redirecionamento
      router.push('/auth/login?redirect=/checkout');
    } else {
      setIsLoading(false);
    }
  }, [router]);
  
  // Verificar se o carrinho está vazio
  useEffect(() => {
    if (cartItems.length === 0 && !isLoading) {
      toast.error("Adicione produtos ao carrinho antes de finalizar a compra.");
      router.push('/cart');
    }
  }, [cartItems, router, isLoading]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Finalizar pedido (versão simplificada)
  const handlePlaceOrder = async () => {
    toast.success("Pedido finalizado com sucesso!");
    clearCart();
    router.push('/');
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Esta é uma versão simplificada da página de checkout.</p>
              <p>Clique em "Finalizar Compra" para simular a conclusão do pedido.</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Resumo do pedido */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Itens */}
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                {/* Total */}
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg" 
                onClick={handlePlaceOrder}
              >
                Finalizar Compra
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 