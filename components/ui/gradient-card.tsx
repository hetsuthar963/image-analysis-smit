"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: "blue" | "purple" | "green" | "orange" | "pink"
  children: React.ReactNode
}

export function GradientCard({ 
  className, 
  gradient = "blue", 
  children, 
  ...props 
}: GradientCardProps) {
  const gradients = {
    blue: "bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-blue-200/50",
    purple: "bg-gradient-to-br from-purple-50 via-white to-violet-50 border-purple-200/50",
    green: "bg-gradient-to-br from-emerald-50 via-white to-green-50 border-emerald-200/50",
    orange: "bg-gradient-to-br from-orange-50 via-white to-amber-50 border-orange-200/50",
    pink: "bg-gradient-to-br from-pink-50 via-white to-rose-50 border-pink-200/50",
  }

  return (
    <motion.div
      className={cn(
        "relative rounded-2xl border backdrop-blur-sm shadow-lg shadow-black/5",
        gradients[gradient],
        className
      )}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
      <div className="relative">{children}</div>
    </motion.div>
  )
}