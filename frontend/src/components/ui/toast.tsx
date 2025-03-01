import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Toast, ToastProps } from "./use-toast"

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  React.useEffect(() => {
    const handleToast = (event: CustomEvent<Toast>) => {
      const { detail } = event
      setToasts((prev) => [...prev, detail])

      if (detail.duration) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((toast) => toast.id !== detail.id))
        }, detail.duration)
      }
    }

    const handleDismiss = (event: CustomEvent<{ id: string }>) => {
      const { detail } = event
      setToasts((prev) => prev.filter((toast) => toast.id !== detail.id))
    }

    const handleDismissAll = () => {
      setToasts([])
    }

    window.addEventListener("toast", handleToast as EventListener)
    window.addEventListener("toast-dismiss", handleDismiss as EventListener)
    window.addEventListener("toast-dismiss-all", handleDismissAll)

    return () => {
      window.removeEventListener("toast", handleToast as EventListener)
      window.removeEventListener("toast-dismiss", handleDismiss as EventListener)
      window.removeEventListener("toast-dismiss-all", handleDismissAll)
    }
  }, [])

  return (
    <>
      {children}
      <div className="fixed top-0 right-0 z-50 flex flex-col gap-2 p-4 max-h-screen overflow-hidden">
        {toasts.map((toast) => (
          <ToastComponent key={toast.id} {...toast} />
        ))}
      </div>
    </>
  )
}

const ToastComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & Toast
>(({ className, title, description, variant = "default", ...props }, ref) => {
  const handleDismiss = () => {
    window.dispatchEvent(
      new CustomEvent("toast-dismiss", { detail: { id: props.id } })
    )
  }

  return (
    <div
      ref={ref}
      className={cn(
        "group pointer-events-auto relative flex w-full max-w-md items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-top-full",
        variant === "destructive"
          ? "destructive border-destructive bg-destructive text-destructive-foreground"
          : "border-border bg-background text-foreground",
        className
      )}
      {...props}
    >
      <div className="grid gap-1">
        {title && <div className="text-sm font-semibold">{title}</div>}
        {description && (
          <div className="text-sm opacity-90">{description}</div>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  )
})
ToastComponent.displayName = "Toast"

export { ToastProvider, ToastComponent } 