"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ChainedLoaderProps {
  steps: Array<{
    id: string
    name: string
    status: "pending" | "processing" | "completed"
    icon: React.ReactNode
  }>
  className?: string
}

export function ChainedLoader({ steps, className }: ChainedLoaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {steps.map((step, index) => {
        const isActive = step.status === "processing"
        const isCompleted = step.status === "completed"
        const isPending = step.status === "pending"

        return (
          <div key={step.id} className="relative">
            {/* Connection Line */}
            {index < steps.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200">
                <motion.div
                  className="w-full bg-blue-500"
                  initial={{ height: 0 }}
                  animate={{ 
                    height: isCompleted ? "100%" : isActive ? "50%" : "0%" 
                  }}
                  transition={{ duration: 0.5, delay: isCompleted ? 0 : 0.5 }}
                />
              </div>
            )}

            {/* Step Item */}
            <motion.div
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl transition-all duration-300",
                isActive && "bg-blue-50/80 border border-blue-200/50",
                isCompleted && "bg-emerald-50/80 border border-emerald-200/50",
                isPending && "bg-gray-50/50 border border-gray-200/30"
              )}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Icon Container */}
              <motion.div
                className={cn(
                  "relative w-12 h-12 rounded-full flex items-center justify-center",
                  isActive && "bg-blue-500 text-white",
                  isCompleted && "bg-emerald-500 text-white",
                  isPending && "bg-gray-300 text-gray-500"
                )}
                animate={isActive ? {
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(59, 130, 246, 0.4)",
                    "0 0 0 10px rgba(59, 130, 246, 0)",
                    "0 0 0 0 rgba(59, 130, 246, 0.4)"
                  ]
                } : {}}
                transition={{
                  duration: 2,
                  repeat: isActive ? Infinity : 0,
                  ease: "easeInOut"
                }}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-blue-300"
                    animate={{
                      scale: [1, 1.5],
                      opacity: [1, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                )}
                
                <motion.div
                  animate={isActive ? { rotate: 360 } : {}}
                  transition={{
                    duration: 2,
                    repeat: isActive ? Infinity : 0,
                    ease: "linear"
                  }}
                >
                  {step.icon}
                </motion.div>
              </motion.div>

              {/* Step Content */}
              <div className="flex-1">
                <motion.h3
                  className={cn(
                    "font-semibold text-lg",
                    isActive && "text-blue-700",
                    isCompleted && "text-emerald-700",
                    isPending && "text-gray-400"
                  )}
                  animate={isActive ? {
                    opacity: [0.7, 1, 0.7]
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: isActive ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  {step.name}
                </motion.h3>
                
                {/* Status Text */}
                <motion.p
                  className={cn(
                    "text-sm",
                    isActive && "text-blue-600",
                    isCompleted && "text-emerald-600",
                    isPending && "text-gray-400"
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {isActive && "Processing..."}
                  {isCompleted && "Completed"}
                  {isPending && "Waiting"}
                </motion.p>
              </div>

              {/* Processing Animation */}
              {isActive && (
                <motion.div
                  className="flex space-x-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                      animate={{
                        y: [0, -8, 0],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </motion.div>
              )}

              {/* Completion Checkmark */}
              {isCompleted && (
                <motion.div
                  className="text-emerald-500"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 15,
                    delay: 0.2 
                  }}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}