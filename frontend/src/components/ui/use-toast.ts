import { useEffect, useState } from "react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

type Toast = ToastProps & {
  id: string
  open: boolean
}

type ToastActionType = {
  toast: (props: ToastProps) => void
  dismiss: (id: string) => void
  dismissAll: () => void
}

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 1000

const toasts: Toast[] = []
let listeners: Array<(toasts: Toast[]) => void> = []

const emitChange = () => {
  listeners.forEach((listener) => {
    listener([...toasts])
  })
}

const addToast = (toast: ToastProps) => {
  const id = Math.random().toString(36).substring(2, 9)

  toasts.push({
    ...toast,
    id,
    open: true,
    duration: toast.duration || 5000,
  })

  if (toasts.length > TOAST_LIMIT) {
    toasts.shift()
  }

  emitChange()

  return id
}

const dismissToast = (id: string) => {
  const index = toasts.findIndex((toast) => toast.id === id)

  if (index !== -1) {
    toasts[index].open = false
    emitChange()

    setTimeout(() => {
      toasts.splice(index, 1)
      emitChange()
    }, TOAST_REMOVE_DELAY)
  }
}

const dismissAllToasts = () => {
  toasts.forEach((toast) => {
    toast.open = false
  })
  emitChange()

  setTimeout(() => {
    toasts.splice(0, toasts.length)
    emitChange()
  }, TOAST_REMOVE_DELAY)
}

export function useToast(): ToastActionType {
  const [, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setToasts([...newToasts])
    }

    listeners.push(listener)

    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])

  return {
    toast: addToast,
    dismiss: dismissToast,
    dismissAll: dismissAllToasts,
  }
}

// Exportar a função toast diretamente para uso em componentes
export const toast = (props: ToastProps) => {
  return addToast(props);
}

export { type Toast, type ToastProps } 