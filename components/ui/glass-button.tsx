"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { forwardRef } from "react"

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variants = {
      primary: "bg-blue-500/20 border-blue-300/30 text-blue-700 dark:bg-blue-400/20 dark:border-blue-400/30 dark:text-blue-300 hover:bg-blue-500/30 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/20",
      secondary: "bg-gray-500/20 border-gray-300/30 text-gray-700 dark:bg-gray-400/20 dark:border-gray-400/30 dark:text-gray-300 hover:bg-gray-500/30 hover:border-gray-400/50 hover:shadow-lg hover:shadow-gray-500/20",
      success: "bg-emerald-500/20 border-emerald-300/30 text-emerald-700 dark:bg-emerald-400/20 dark:border-emerald-400/30 dark:text-emerald-300 hover:bg-emerald-500/30 hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-500/20",
      danger: "bg-red-500/20 border-red-300/30 text-red-700 dark:bg-red-400/20 dark:border-red-400/30 dark:text-red-300 hover:bg-red-500/30 hover:border-red-400/50 hover:shadow-lg hover:shadow-red-500/20",
    }

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    }

    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative rounded-xl border backdrop-blur-sm font-medium transition-all duration-300",
          "shadow-lg shadow-black/5 dark:shadow-white/5",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
          "active:scale-95",
          variants[variant],
          sizes[size],
          className
        )}
        whileHover={{ 
          scale: 1.05,
          y: -2
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent dark:from-white/10" />
        <span className="relative flex items-center justify-center gap-2">{children}</span>
      </motion.button>
    )
  }
)

GlassButton.displayName = "GlassButton"