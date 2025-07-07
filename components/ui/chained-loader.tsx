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
    <div className={cn("relative", className)}>
      {/* Continuous Flow Background */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700">
        <motion.div
          className="w-full bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500"
          initial={{ height: 0 }}
          animate={{ 
            height: `${(steps.filter(s => s.status === "completed").length / steps.length) * 100}%`
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>

      {/* Flowing Particles */}
      <motion.div
        className="absolute left-6 w-0.5 h-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            animate={{
              y: ["-10px", "100%"],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 1,
              ease: "linear"
            }}
          />
        ))}
      </motion.div>

      {/* Steps */}
      <div className="space-y-0">
        {steps.map((step, index) => {
          const isActive = step.status === "processing"
          const isCompleted = step.status === "completed"
          const isPending = step.status === "pending"

          return (
            <motion.div
              key={step.id}
              className="relative flex items-center gap-4 py-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Step Icon */}
              <motion.div
                className={cn(
                  "relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                  isActive && "bg-blue-500 text-white shadow-lg shadow-blue-500/30",
                  isCompleted && "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30",
                  isPending && "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                )}
                animate={isActive ? {
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(59, 130, 246, 0.4)",
                    "0 0 0 15px rgba(59, 130, 246, 0)",
                    "0 0 0 0 rgba(59, 130, 246, 0.4)"
                  ]
                } : {}}
                transition={{
                  duration: 2,
                  repeat: isActive ? Infinity : 0,
                  ease: "easeInOut"
                }}
              >
                {/* Pulsing Ring for Active Step */}
                {isActive && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-blue-300"
                      animate={{
                        scale: [1, 1.8],
                        opacity: [0.8, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-blue-400"
                      animate={{
                        scale: [1, 1.5],
                        opacity: [0.6, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: 0.3,
                        ease: "easeOut"
                      }}
                    />
                  </>
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
              <div className="flex-1 min-w-0">
                <motion.div
                  className={cn(
                    "px-4 py-3 rounded-xl transition-all duration-300",
                    isActive && "bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/50",
                    isCompleted && "bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-700/50",
                    isPending && "bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30"
                  )}
                  animate={isActive ? {
                    scale: [1, 1.02, 1]
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: isActive ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <motion.h3
                        className={cn(
                          "font-semibold text-lg",
                          isActive && "text-blue-700 dark:text-blue-300",
                          isCompleted && "text-emerald-700 dark:text-emerald-300",
                          isPending && "text-gray-500 dark:text-gray-400"
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
                      
                      <motion.p
                        className={cn(
                          "text-sm mt-1",
                          isActive && "text-blue-600 dark:text-blue-400",
                          isCompleted && "text-emerald-600 dark:text-emerald-400",
                          isPending && "text-gray-400 dark:text-gray-500"
                        )}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {isActive && "Processing..."}
                        {isCompleted && "Completed successfully"}
                        {isPending && "Waiting to start"}
                      </motion.p>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center gap-2">
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
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}