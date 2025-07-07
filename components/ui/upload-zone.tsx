"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Upload, FileImage } from "lucide-react"
import { useState } from "react"

interface UploadZoneProps {
  onFileSelect: (file: File) => void
  isUploading?: boolean
  className?: string
}

export function UploadZone({ onFileSelect, isUploading = false, className }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile) {
      onFileSelect(imageFile)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <motion.div
      className={cn(
        "relative group cursor-pointer",
        className
      )}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        disabled={isUploading}
      />
      
      <div
        className={cn(
          "relative rounded-2xl border-2 border-dashed p-12 transition-all duration-300",
          "bg-gradient-to-br from-blue-50/50 via-white/50 to-indigo-50/50 backdrop-blur-sm",
          isDragOver || isUploading
            ? "border-blue-400 bg-blue-50/80"
            : "border-gray-300 hover:border-blue-300 hover:bg-blue-50/30"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
        
        <div className="relative text-center space-y-6">
          <motion.div
            className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center"
            animate={isUploading ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: isUploading ? Infinity : 0, ease: "linear" }}
          >
            {isUploading ? (
              <motion.div
                className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <Upload className="w-8 h-8 text-blue-600" />
            )}
          </motion.div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              {isUploading ? "Uploading..." : "Upload Document"}
            </h3>
            <p className="text-gray-600">
              {isUploading 
                ? "Processing your image..." 
                : "Drag and drop your image here, or click to browse"
              }
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <FileImage className="w-4 h-4" />
            <span>Supports JPG, PNG, WebP</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}