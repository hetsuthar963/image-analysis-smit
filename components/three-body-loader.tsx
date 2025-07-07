"use client"

import { cn } from "@/lib/utils"

interface ThreeBodyLoaderProps {
  size?: "sm" | "md" | "lg"
  color?: string
  className?: string
}

export function ThreeBodyLoader({ size = "md", color = "#5D3FD3", className }: ThreeBodyLoaderProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-9 h-9", // 35px equivalent
    lg: "w-12 h-12",
  }

  return (
    <div
      className={cn("relative inline-block animate-spin", sizeClasses[size], className)}
      style={{
        animationDuration: "2s",
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
      }}
    >
      {/* Dot 1 */}
      <div
        className="absolute h-full w-[30%] bottom-[5%] left-0"
        style={{
          transform: "rotate(60deg)",
          transformOrigin: "50% 85%",
        }}
      >
        <div
          className="absolute bottom-0 left-0 w-full pb-[100%] rounded-full animate-pulse"
          style={{
            backgroundColor: color,
            animation: "wobble1 0.8s infinite ease-in-out",
            animationDelay: "-0.24s",
          }}
        />
      </div>

      {/* Dot 2 */}
      <div
        className="absolute h-full w-[30%] bottom-[5%] right-0"
        style={{
          transform: "rotate(-60deg)",
          transformOrigin: "50% 85%",
        }}
      >
        <div
          className="absolute bottom-0 left-0 w-full pb-[100%] rounded-full"
          style={{
            backgroundColor: color,
            animation: "wobble1 0.8s infinite ease-in-out",
            animationDelay: "-0.12s",
          }}
        />
      </div>

      {/* Dot 3 */}
      <div
        className="absolute h-full w-[30%] bottom-[-5%] left-0"
        style={{
          transform: "translateX(116.666%)",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full pb-[100%] rounded-full"
          style={{
            backgroundColor: color,
            animation: "wobble2 0.8s infinite ease-in-out",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes wobble1 {
          0%, 100% {
            transform: translateY(0%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(-66%) scale(0.65);
            opacity: 0.8;
          }
        }

        @keyframes wobble2 {
          0%, 100% {
            transform: translateY(0%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(66%) scale(0.65);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  )
}
