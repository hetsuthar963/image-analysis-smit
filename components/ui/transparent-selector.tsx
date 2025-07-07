"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, X, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface TransparentSelectorProps {
  imageSrc: string
  onSelectionComplete: (croppedImage: string) => void
  onCancel: () => void
}

interface SelectionArea {
  x: number
  y: number
  width: number
  height: number
}

export function TransparentSelector({ imageSrc, onSelectionComplete, onCancel }: TransparentSelectorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [selectionArea, setSelectionArea] = useState<SelectionArea>({ x: 50, y: 50, width: 200, height: 200 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)

  const drawSelection = useCallback(() => {
    const canvas = canvasRef.current
    const image = imageRef.current
    if (!canvas || !image || !imageLoaded) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

    // Create transparent overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Clear selected area (make it transparent)
    ctx.globalCompositeOperation = "destination-out"
    ctx.fillRect(selectionArea.x, selectionArea.y, selectionArea.width, selectionArea.height)

    // Reset composite operation
    ctx.globalCompositeOperation = "source-over"

    // Draw selection border with glow effect
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 3
    ctx.shadowColor = "#3b82f6"
    ctx.shadowBlur = 10
    ctx.strokeRect(selectionArea.x, selectionArea.y, selectionArea.width, selectionArea.height)

    // Reset shadow
    ctx.shadowBlur = 0

    // Draw corner handles
    const handleSize = 12
    ctx.fillStyle = "#3b82f6"
    ctx.shadowColor = "#3b82f6"
    ctx.shadowBlur = 5
    
    const corners = [
      { x: selectionArea.x - handleSize / 2, y: selectionArea.y - handleSize / 2 },
      { x: selectionArea.x + selectionArea.width - handleSize / 2, y: selectionArea.y - handleSize / 2 },
      { x: selectionArea.x - handleSize / 2, y: selectionArea.y + selectionArea.height - handleSize / 2 },
      { x: selectionArea.x + selectionArea.width - handleSize / 2, y: selectionArea.y + selectionArea.height - handleSize / 2 },
    ]
    
    corners.forEach((corner) => {
      ctx.fillRect(corner.x, corner.y, handleSize, handleSize)
    })

    ctx.shadowBlur = 0
  }, [selectionArea, imageLoaded])

  useEffect(() => {
    drawSelection()
  }, [drawSelection])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDragging(true)
    setDragStart({ x: x - selectionArea.x, y: y - selectionArea.y })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newX = Math.max(0, Math.min(x - dragStart.x, canvas.width - selectionArea.width))
    const newY = Math.max(0, Math.min(y - dragStart.y, canvas.height - selectionArea.height))

    setSelectionArea((prev) => ({ ...prev, x: newX, y: newY }))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleApplySelection = () => {
    const canvas = canvasRef.current
    const image = imageRef.current
    if (!canvas || !image) return

    // Create a new canvas for the selected area
    const cropCanvas = document.createElement("canvas")
    const cropCtx = cropCanvas.getContext("2d")
    if (!cropCtx) return

    // Calculate scale factors
    const scaleX = image.naturalWidth / canvas.width
    const scaleY = image.naturalHeight / canvas.height

    // Set crop canvas size
    cropCanvas.width = selectionArea.width * scaleX
    cropCanvas.height = selectionArea.height * scaleY

    // Draw selected portion
    cropCtx.drawImage(
      image,
      selectionArea.x * scaleX,
      selectionArea.y * scaleY,
      selectionArea.width * scaleX,
      selectionArea.height * scaleY,
      0,
      0,
      cropCanvas.width,
      cropCanvas.height,
    )

    // Convert to data URL
    const croppedDataUrl = cropCanvas.toDataURL("image/jpeg", 0.9)
    onSelectionComplete(croppedDataUrl)
  }

  const resetSelection = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    setSelectionArea({
      x: canvas.width * 0.1,
      y: canvas.height * 0.1,
      width: canvas.width * 0.8,
      height: canvas.height * 0.8,
    })
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <motion.div
          className="flex items-center justify-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-sm" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Select Document Area
          </h3>
        </motion.div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Drag the selection area to choose the region you want to analyze
        </p>
      </div>

      <div className="flex justify-center">
        <motion.div
          className="relative border-2 border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <img
            ref={imageRef}
            src={imageSrc || "/placeholder.svg"}
            alt="Image to select"
            className="hidden"
            onLoad={() => {
              const canvas = canvasRef.current
              const image = imageRef.current
              if (canvas && image) {
                // Set canvas size to match display size
                const maxWidth = 700
                const maxHeight = 500
                const aspectRatio = image.naturalWidth / image.naturalHeight

                let displayWidth = maxWidth
                let displayHeight = maxWidth / aspectRatio

                if (displayHeight > maxHeight) {
                  displayHeight = maxHeight
                  displayWidth = maxHeight * aspectRatio
                }

                canvas.width = displayWidth
                canvas.height = displayHeight

                // Set initial selection area
                setSelectionArea({
                  x: displayWidth * 0.1,
                  y: displayHeight * 0.1,
                  width: displayWidth * 0.8,
                  height: displayHeight * 0.8,
                })

                setImageLoaded(true)
              }
            }}
          />
          <canvas
            ref={canvasRef}
            className={cn(
              "cursor-move transition-all duration-200",
              isDragging && "cursor-grabbing"
            )}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </motion.div>
      </div>

      <motion.div
        className="flex justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button 
          variant="outline" 
          onClick={resetSelection} 
          className="flex items-center gap-2 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
        <Button 
          variant="outline" 
          onClick={onCancel} 
          className="flex items-center gap-2 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <X className="w-4 h-4" />
          Cancel
        </Button>
        <Button 
          onClick={handleApplySelection} 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Check className="w-4 h-4" />
          Apply Selection
        </Button>
      </motion.div>
    </div>
  )
}