"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { AnimatedCounter } from "@/components/animated-counter"

interface MetricCardProps {
  title: string
  value: number
  suffix?: string
  icon?: React.ReactNode
  color?: "blue" | "green" | "orange" | "purple" | "red"
  className?: string
}

export function MetricCard({ 
  title, 
  value, 
  suffix = "", 
  icon, 
  color = "blue",
  className 
}: MetricCardProps) {
  const colors = {
    blue: "from-blue-500/10 to-blue-600/5 border-blue-200/50 text-blue-700",
    green: "from-emerald-500/10 to-emerald-600/5 border-emerald-200/50 text-emerald-700",
    orange: "from-orange-500/10 to-orange-600/5 border-orange-200/50 text-orange-700",
    purple: "from-purple-500/10 to-purple-600/5 border-purple-200/50 text-purple-700",
    red: "from-red-500/10 to-red-600/5 border-red-200/50 text-red-700",
  }

  return (
    <motion.div
      className={cn(
        "relative p-6 rounded-2xl border backdrop-blur-sm bg-gradient-to-br",
        colors[color],
        className
      )}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
      
      <div className="relative space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {icon && <div className="text-current">{icon}</div>}
        </div>
        
        <div className="text-3xl font-bold">
          <AnimatedCounter value={value} suffix={suffix} duration={1.5} />
        </div>
      </div>
    </motion.div>
  )
}