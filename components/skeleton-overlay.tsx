"use client"

import { motion } from "framer-motion"

interface SkeletonOverlayProps {
  className?: string
}

export function SkeletonOverlay({ className }: SkeletonOverlayProps) {
  return (
    <div className={`absolute inset-0 rounded-xl overflow-hidden ${className}`}>
      {/* Semi-transparent overlay to show image underneath */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Main scanning wave effect only */}
      <motion.div
        className="absolute inset-y-0 w-32"
        style={{
          background: `linear-gradient(90deg, 
            transparent 0%, 
            rgba(255,255,255,0.1) 25%, 
            rgba(255,255,255,0.4) 50%, 
            rgba(255,255,255,0.1) 75%, 
            transparent 100%
          )`,
          filter: "blur(1px)",
        }}
        initial={{ x: "-128px" }}
        animate={{
          x: ["calc(-128px)", "calc(100vw)"],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
          repeatDelay: 0.5,
        }}
      />

      {/* Subtle grid overlay to enhance scanning effect */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Animated scanning lines for additional effect */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: ["0px 0px", "40px 40px"],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.05) 50%, transparent 52%)
          `,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  )
}
