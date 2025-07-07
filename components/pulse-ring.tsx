"use client"

import { motion } from "framer-motion"

interface PulseRingProps {
  size?: number
  color?: string
  intensity?: "low" | "medium" | "high"
}

export function PulseRing({ size = 20, color = "#3b82f6", intensity = "medium" }: PulseRingProps) {
  const pulseVariants = {
    low: { scale: [1, 1.1, 1], opacity: [0.7, 0.3, 0.7] },
    medium: { scale: [1, 1.3, 1], opacity: [0.8, 0.2, 0.8] },
    high: { scale: [1, 1.5, 1], opacity: [1, 0.1, 1] },
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2"
          style={{
            borderColor: color,
            width: size,
            height: size,
          }}
          animate={pulseVariants[intensity]}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}
      <div
        className="absolute rounded-full"
        style={{
          backgroundColor: color,
          width: size * 0.3,
          height: size * 0.3,
        }}
      />
    </div>
  )
}
