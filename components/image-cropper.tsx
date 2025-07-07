"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Crop, RotateCcw, Check, X } from "lucide-react"

interface ImageCropperProps {
  imageSrc: string
  onCropComplete: (croppedImage: string) => void
  onCancel: () => void
}

interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

export function ImageCropper({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [cropArea, setCropArea] = useState<CropArea>({ x: 50, y: 50, width: 200, height: 200 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)

  const drawCropArea = useCallback(() => {
    const canvas = canvasRef.current
    const image = imageRef.current
    if (!canvas || !image || !imageLoaded) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

    // Draw overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Clear crop area
    ctx.clearRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height)

    // Draw crop border
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height)

    // Draw corner handles
    const handleSize = 8
    ctx.fillStyle = "#3b82f6"
    const corners = [
      { x: cropArea.x - handleSize / 2, y: cropArea.y - handleSize / 2 },
      { x: cropArea.x + cropArea.width - handleSize / 2, y: cropArea.y - handleSize / 2 },
      { x: cropArea.x - handleSize / 2, y: cropArea.y + cropArea.height - handleSize / 2 },
      { x: cropArea.x + cropArea.width - handleSize / 2, y: cropArea.y + cropArea.height - handleSize / 2 },
    ]
    corners.forEach((corner) => {
      ctx.fillRect(corner.x, corner.y, handleSize, handleSize)
    })
  }, [cropArea, imageLoaded])

  useEffect(() => {
    drawCropArea()
  }, [drawCropArea])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDragging(true)
    setDragStart({ x: x - cropArea.x, y: y - cropArea.y })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newX = Math.max(0, Math.min(x - dragStart.x, canvas.width - cropArea.width))
    const newY = Math.max(0, Math.min(y - dragStart.y, canvas.height - cropArea.height))

    setCropArea((prev) => ({ ...prev, x: newX, y: newY }))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleCrop = () => {
    const canvas = canvasRef.current
    const image = imageRef.current
    if (!canvas || !image) return

    // Create a new canvas for the cropped image
    const cropCanvas = document.createElement("canvas")
    const cropCtx = cropCanvas.getContext("2d")
    if (!cropCtx) return

    // Calculate scale factors
    const scaleX = image.naturalWidth / canvas.width
    const scaleY = image.naturalHeight / canvas.height

    // Set crop canvas size
    cropCanvas.width = cropArea.width * scaleX
    cropCanvas.height = cropArea.height * scaleY

    // Draw cropped portion
    cropCtx.drawImage(
      image,
      cropArea.x * scaleX,
      cropArea.y * scaleY,
      cropArea.width * scaleX,
      cropArea.height * scaleY,
      0,
      0,
      cropCanvas.width,
      cropCanvas.height,
    )

    // Convert to data URL
    const croppedDataUrl = cropCanvas.toDataURL("image/jpeg", 0.9)
    onCropComplete(croppedDataUrl)
  }

  const resetCrop = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    setCropArea({
      x: canvas.width * 0.1,
      y: canvas.height * 0.1,
      width: canvas.width * 0.8,
      height: canvas.height * 0.8,
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Crop className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Crop Your Document</h3>
        </div>
        <p className="text-gray-600">Drag the blue box to select the area you want to analyze</p>
      </div>

      <div className="flex justify-center">
        <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
          <img
            ref={imageRef}
            src={imageSrc || "/placeholder.svg"}
            alt="Image to crop"
            className="hidden"
            onLoad={() => {
              const canvas = canvasRef.current
              const image = imageRef.current
              if (canvas && image) {
                // Set canvas size to match display size
                const maxWidth = 600
                const maxHeight = 400
                const aspectRatio = image.naturalWidth / image.naturalHeight

                let displayWidth = maxWidth
                let displayHeight = maxWidth / aspectRatio

                if (displayHeight > maxHeight) {
                  displayHeight = maxHeight
                  displayWidth = maxHeight * aspectRatio
                }

                canvas.width = displayWidth
                canvas.height = displayHeight

                // Set initial crop area
                setCropArea({
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
            className="cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={resetCrop} className="flex items-center gap-2 bg-transparent">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex items-center gap-2 bg-transparent">
          <X className="w-4 h-4" />
          Cancel
        </Button>
        <Button onClick={handleCrop} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
          <Check className="w-4 h-4" />
          Apply Crop
        </Button>
      </div>
    </div>
  )
}
