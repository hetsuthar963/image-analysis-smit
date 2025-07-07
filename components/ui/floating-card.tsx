"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface FloatingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hover?: boolean
}

export function FloatingCard({ 
  className, 
  children, 
  hover = true,
  ...props 
}: FloatingCardProps) {
  return (
    <motion.div
      className={cn(
        "relative rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/10",
        className
      )}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={hover ? { y: -5, scale: 1.02 } : undefined}
      transition={{ duration: 0.3, ease: "easeOut" }}
      {...props}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-white/20 to-transparent" />
      <div className="relative">{children}</div>
    </motion.div>
  )
}