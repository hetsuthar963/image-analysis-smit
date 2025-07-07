"use client"

import { motion } from "framer-motion"

interface ScanningOverlayProps {
  className?: string
}

export function ScanningOverlay({ className }: ScanningOverlayProps) {
  return (
    <div className={`absolute inset-0 rounded-xl overflow-hidden ${className}`}>
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/5 dark:bg-white/5" />

      {/* Main scanning beam */}
      <motion.div
        className="absolute inset-y-0 w-32"
        style={{
          background: `linear-gradient(90deg, 
            transparent 0%, 
            rgba(59, 130, 246, 0.1) 25%, 
            rgba(59, 130, 246, 0.4) 50%, 
            rgba(59, 130, 246, 0.1) 75%, 
            transparent 100%
          )`,
          filter: "blur(1px)",
        }}
        initial={{ x: "-128px" }}
        animate={{
          x: ["calc(-128px)", "calc(100% + 128px)"],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
          repeatDelay: 0.5,
        }}
      />

      {/* Secondary scanning line */}
      <motion.div
        className="absolute inset-y-0 w-1 bg-blue-500/60"
        initial={{ x: "-4px" }}
        animate={{
          x: ["calc(-4px)", "calc(100% + 4px)"],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
          repeatDelay: 0.5,
        }}
      />

      {/* Grid overlay for tech effect */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Animated scanning lines */}
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
            linear-gradient(45deg, transparent 48%, rgba(59, 130, 246, 0.05) 50%, transparent 52%)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Corner scanning indicators */}
      {[
        { top: "10px", left: "10px", rotate: "0deg" },
        { top: "10px", right: "10px", rotate: "90deg" },
        { bottom: "10px", right: "10px", rotate: "180deg" },
        { bottom: "10px", left: "10px", rotate: "270deg" },
      ].map((corner, index) => (
        <motion.div
          key={index}
          className="absolute w-6 h-6"
          style={corner}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: index * 0.5,
            ease: "easeInOut",
          }}
        >
          <div 
            className="w-full h-full border-l-2 border-t-2 border-blue-500"
            style={{ transform: `rotate(${corner.rotate})` }}
          />
        </motion.div>
      ))}

      {/* Pulse effect */}
      <motion.div
        className="absolute inset-0 border-2 border-blue-500/30 rounded-xl"
        animate={{
          opacity: [0, 0.5, 0],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}