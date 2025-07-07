"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface StatusBadgeProps {
  status: "pending" | "processing" | "completed" | "error"
  children: React.ReactNode
  className?: string
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  const variants = {
    pending: "bg-gray-100 text-gray-600 border-gray-200",
    processing: "bg-blue-100 text-blue-700 border-blue-200",
    completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    error: "bg-red-100 text-red-700 border-red-200",
  }

  const pulseVariants = {
    processing: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
    },
  }

  return (
    <motion.div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border",
        variants[status],
        className
      )}
      animate={status === "processing" ? pulseVariants.processing : undefined}
      transition={{
        duration: 2,
        repeat: status === "processing" ? Infinity : 0,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  )
}