"use client"

import { useEffect, useState } from "react"
import { ToastComponent } from "./toast"
import { useToast } from "./use-toast"
import { type Toast } from "./use-toast"

export function Toaster() {
  const { toast } = useToast()
  const [toasts, setToasts] = useState<Toast[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Aqui você pode adicionar lógica para gerenciar os toasts
    // Por exemplo, ouvir eventos personalizados para adicionar/remover toasts
    
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="fixed top-0 right-0 z-[100] flex flex-col gap-2 p-4 max-h-screen overflow-hidden">
      {toasts.map((toast) => (
        <ToastComponent 
          key={toast.id}
          id={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          open={toast.open}
        />
      ))}
    </div>
  )
} 