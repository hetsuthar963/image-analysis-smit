"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlowingProgressProps {
  value: number
  className?: string
  color?: string
  glowIntensity?: "low" | "medium" | "high"
}

export function GlowingProgress({
  value,
  className,
  color = "#10b981",
  glowIntensity = "medium",
}: GlowingProgressProps) {
  const glowStyles = {
    low: "drop-shadow-sm",
    medium: "drop-shadow-md",
    high: "drop-shadow-lg",
  }

  return (
    <div className={cn("relative w-full bg-gray-200 rounded-full h-3 overflow-hidden", className)}>
      <motion.div
        className={cn("h-full rounded-full relative", glowStyles[glowIntensity])}
        style={{
          background: `linear-gradient(90deg, ${color}aa, ${color})`,
          boxShadow: `0 0 10px ${color}66, inset 0 1px 0 rgba(255,255,255,0.3)`,
        }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Animated shine effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
          }}
          animate={{ x: ["-100%", "100%"] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 1,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  )
}
