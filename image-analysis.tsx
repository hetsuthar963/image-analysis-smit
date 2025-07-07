"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Upload,
  CheckCircle,
  Circle,
  FileText,
  Play,
  X,
  Shield,
  Database,
  PenTool,
  Zap,
  Activity,
  Target,
  Brain,
  Cpu,
  Crop,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { MultiSelect } from "./components/multi-select"
import { ThreeBodyLoader } from "./components/three-body-loader"
import { AnimatedCounter } from "./components/animated-counter"
import { PulseRing } from "./components/pulse-ring"
import { SkeletonOverlay } from "./components/skeleton-overlay"
import { ImageCropper } from "./components/image-cropper"

type AnalysisStep = {
  id: string
  name: string
  status: "pending" | "processing" | "completed"
  icon: React.ReactNode
}

type AnalysisOption = {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

type AppState = "upload" | "crop" | "ready" | "processing" | "result"

export default function Component() {
  const [state, setState] = useState<AppState>("upload")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [confidence, setConfidence] = useState(0)
  const [riskLevel, setRiskLevel] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<string[]>(["fraud", "text"])
  const [isUploading, setIsUploading] = useState(false)
  const [isStartingAnalysis, setIsStartingAnalysis] = useState(false)
  const [processingSpeed, setProcessingSpeed] = useState(0)
  const [accuracy, setAccuracy] = useState(0)

  const analysisOptions: AnalysisOption[] = [
    { label: "Fraud Detection", value: "fraud", icon: Shield },
    { label: "Text Extraction", value: "text", icon: FileText },
    { label: "Metadata Analysis", value: "metadata", icon: Database },
    { label: "Signature Verification", value: "signature", icon: PenTool },
  ]

  const [steps, setSteps] = useState<AnalysisStep[]>([
    { id: "upload", name: "Document Upload", status: "pending", icon: <CheckCircle className="w-5 h-5" /> },
    { id: "processing", name: "Image Processing", status: "pending", icon: <Cpu className="w-5 h-5" /> },
    { id: "extraction", name: "Text Extraction", status: "pending", icon: <Brain className="w-5 h-5" /> },
    { id: "fraud", name: "Fraud Detection", status: "pending", icon: <Target className="w-5 h-5" /> },
    { id: "report", name: "Final Report", status: "pending", icon: <Activity className="w-5 h-5" /> },
  ])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        // Simulate upload delay
        setTimeout(() => {
          setUploadedImage(e.target?.result as string)
          setIsUploading(false)
          setState("crop")
        }, 1500)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCropComplete = (croppedImageData: string) => {
    setCroppedImage(croppedImageData)
    setState("ready")
  }

  const handleCropCancel = () => {
    setState("upload")
    setUploadedImage(null)
  }

  const startAnalysis = () => {
    setIsStartingAnalysis(true)
    setTimeout(() => {
      setIsStartingAnalysis(false)
      setState("processing")
    }, 2000)
  }

  const removeImage = () => {
    setUploadedImage(null)
    setCroppedImage(null)
    setState("upload")
  }

  const recropImage = () => {
    setState("crop")
  }

  useEffect(() => {
    if (state === "processing") {
      const processSteps = async () => {
        setSteps((prev) => prev.map((step, index) => (index === 0 ? { ...step, status: "completed" } : step)))

        for (let i = 1; i < steps.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 2000))

          setSteps((prev) =>
            prev.map((step, index) => {
              if (index === i - 1) return { ...step, status: "completed" }
              if (index === i) return { ...step, status: "processing" }
              return step
            }),
          )

          setCurrentStep(i)
          setConfidence((prev) => Math.min(prev + 20, 95))
          setRiskLevel((prev) => Math.min(prev + 15, 75))
          setProcessingSpeed((prev) => Math.min(prev + 25, 100))
          setAccuracy((prev) => Math.min(prev + 18, 94))
        }

        await new Promise((resolve) => setTimeout(resolve, 2000))
        setSteps((prev) =>
          prev.map((step, index) => (index === steps.length - 1 ? { ...step, status: "completed" } : step)),
        )

        setConfidence(98)
        setRiskLevel(23)
        setProcessingSpeed(100)
        setAccuracy(96)
        setTimeout(() => setState("result"), 1000)
      }

      processSteps()
    }
  }, [state, steps.length])

  const getStepIcon = (step: AnalysisStep) => {
    switch (step.status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />
      case "processing":
        return <PulseRing size={20} color="#3b82f6" intensity="high" />
      default:
        return <Circle className="w-5 h-5 text-gray-300" />
    }
  }

  const mockResults = [
    { field: "Document Type", value: "Government ID", confidence: "98%" },
    { field: "Text Quality", value: "High", confidence: "95%" },
    { field: "Fraud Indicators", value: "None Detected", confidence: "92%" },
    { field: "Signature Present", value: "Yes", confidence: "89%" },
    { field: "Security Features", value: "Valid", confidence: "96%" },
  ]

  const displayImage = croppedImage || uploadedImage

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {state === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-center min-h-screen p-4"
          >
            <div className="w-full max-w-lg mx-auto">
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <div className="mx-auto w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center">
                    {isUploading ? (
                      <ThreeBodyLoader size="md" color="#6366f1" />
                    ) : (
                      <Upload className="w-10 h-10 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {isUploading ? "Uploading..." : "Upload Document"}
                    </h1>
                    <p className="text-gray-500 text-lg">
                      {isUploading ? "Processing your image..." : "Select an image to begin analysis"}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Options</h3>
                    <MultiSelect
                      options={analysisOptions}
                      onValueChange={setSelectedOptions}
                      defaultValue={selectedOptions}
                      placeholder="Select analysis options"
                      variant="default"
                    />
                  </div>

                  {isUploading ? (
                    <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 bg-blue-50/30">
                      <div className="text-center space-y-4">
                        <ThreeBodyLoader size="lg" color="#3b82f6" />
                        <div>
                          <p className="text-lg font-medium text-blue-700">Uploading your document...</p>
                          <p className="text-sm text-blue-600">Please wait while we process your file</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="text-center space-y-3">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div>
                            <p className="text-lg font-medium text-gray-700">Click to upload</p>
                            <p className="text-sm text-gray-500">or drag and drop your image here</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {state === "crop" && uploadedImage && (
          <motion.div
            key="crop"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-center min-h-screen p-4"
          >
            <div className="w-full max-w-4xl mx-auto">
              <ImageCropper imageSrc={uploadedImage} onCropComplete={handleCropComplete} onCancel={handleCropCancel} />
            </div>
          </motion.div>
        )}

        {state === "ready" && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-center min-h-screen p-4"
          >
            <div className="w-full max-w-lg mx-auto">
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <div className="mx-auto w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Ready for Analysis</h1>
                    <p className="text-gray-500 text-lg">Your document has been cropped and is ready to analyze</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Options</h3>
                    <MultiSelect
                      options={analysisOptions}
                      onValueChange={setSelectedOptions}
                      defaultValue={selectedOptions}
                      placeholder="Select analysis options"
                      variant="default"
                    />
                  </div>

                  <div className="space-y-4">
                    {/* Cropped Image Preview */}
                    <div className="flex justify-center">
                      <div className="relative">
                        <img
                          src={croppedImage || "/placeholder.svg"}
                          alt="Cropped document"
                          className="max-w-md w-full h-auto rounded-xl shadow-lg"
                        />
                        {!isStartingAnalysis && (
                          <div className="absolute -top-3 -right-3 flex gap-2">
                            <button
                              onClick={recropImage}
                              className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors"
                              title="Re-crop image"
                            >
                              <Crop className="w-4 h-4" />
                            </button>
                            <button
                              onClick={removeImage}
                              className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                              title="Remove image"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Start Analysis Button */}
                    <div className="flex justify-center">
                      {isStartingAnalysis ? (
                        <div className="flex items-center gap-3 px-8 py-3 text-lg text-blue-600">
                          <ThreeBodyLoader size="sm" color="#3b82f6" />
                          <span>Starting Analysis...</span>
                        </div>
                      ) : (
                        <Button
                          onClick={startAnalysis}
                          className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                        >
                          <Play className="w-5 h-5" />
                          Start Analysis
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {state === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen p-6 lg:p-12"
          >
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                {/* Left side - Centered Image */}
                <div className="flex justify-center items-center min-h-[500px]">
                  <div className="relative w-full max-w-lg">
                    {displayImage && (
                      <img
                        src={displayImage || "/placeholder.svg"}
                        alt="Document being analyzed"
                        className="w-full h-auto max-h-[500px] object-contain rounded-xl shadow-lg"
                      />
                    )}

                    {/* Skeleton overlay when processing */}
                    <SkeletonOverlay />
                  </div>
                </div>

                {/* Right side - Progress */}
                <div className="space-y-8">
                  {/* Progress Component */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <Zap className="w-6 h-6 text-blue-600" />
                      </motion.div>
                      <h2 className="text-2xl font-bold text-gray-900">Analysis Progress</h2>
                    </div>

                    <div className="space-y-4">
                      {steps.map((step, index) => (
                        <motion.div
                          key={step.id}
                          className="relative overflow-hidden"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                          <motion.div
                            className="flex items-center gap-4 p-4 rounded-lg bg-gray-50/50 relative z-10"
                            animate={{
                              backgroundColor:
                                step.status === "processing" ? "rgb(239 246 255)" : "rgb(249 250 251 / 0.5)",
                              scale: step.status === "processing" ? 1.02 : 1,
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            {getStepIcon(step)}
                            <span
                              className={`font-medium text-lg ${
                                step.status === "completed"
                                  ? "text-emerald-700"
                                  : step.status === "processing"
                                    ? "text-blue-700"
                                    : "text-gray-400"
                              }`}
                            >
                              {step.name}
                            </span>
                          </motion.div>

                          {/* Animated background for processing step */}
                          {step.status === "processing" && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-blue-100/50 to-blue-100/0 rounded-lg"
                              animate={{ x: ["-100%", "100%"] }}
                              transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                              }}
                            />
                          )}
                        </motion.div>
                      ))}
                    </div>

                    {/* Status Indicator */}
                    <motion.div
                      className="flex items-center gap-3 text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100/50 px-6 py-3 rounded-xl border border-gray-200/50"
                      animate={{
                        boxShadow: [
                          "0 0 0 rgba(59, 130, 246, 0)",
                          "0 0 20px rgba(59, 130, 246, 0.3)",
                          "0 0 0 rgba(59, 130, 246, 0)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    >
                      <PulseRing size={16} color="#6b7280" intensity="low" />
                      <span className="font-medium">
                        Processing step <AnimatedCounter value={currentStep + 1} duration={0.5} /> of {steps.length}
                      </span>
                    </motion.div>
                  </motion.div>
                </div>
              </div>

              {/* Minimal Stats Component - Full Width Below */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mt-8 bg-gray-50/30 rounded-xl p-4 border border-gray-100/50"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Confidence */}
                  <div className="text-center space-y-1">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Confidence</span>
                    <div className="text-lg font-bold text-emerald-600">
                      <AnimatedCounter value={confidence} suffix="%" duration={1.5} />
                    </div>
                  </div>

                  {/* Risk */}
                  <div className="text-center space-y-1">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Risk Level</span>
                    <div className="text-lg font-bold text-orange-600">
                      <AnimatedCounter value={riskLevel} suffix="%" duration={1.5} />
                    </div>
                  </div>

                  {/* Speed */}
                  <div className="text-center space-y-1">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Speed</span>
                    <div className="text-lg font-bold text-blue-600">
                      <AnimatedCounter value={processingSpeed} suffix="%" duration={1.2} />
                    </div>
                  </div>

                  {/* Accuracy */}
                  <div className="text-center space-y-1">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Accuracy</span>
                    <div className="text-lg font-bold text-purple-600">
                      <AnimatedCounter value={accuracy} suffix="%" duration={1.8} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {state === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen p-4 lg:p-8"
          >
            <div className="max-w-5xl mx-auto space-y-12">
              {/* Header */}
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-gray-900">Analysis Complete</h1>
                <p className="text-xl text-gray-600">Your document has been successfully analyzed</p>
              </div>

              {/* Uploaded Image */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex justify-center"
              >
                {displayImage && (
                  <img
                    src={displayImage || "/placeholder.svg"}
                    alt="Analyzed document"
                    className="max-w-sm h-auto rounded-xl shadow-lg"
                  />
                )}
              </motion.div>

              {/* Results Table */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
                </div>

                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-t-xl font-semibold text-gray-900">
                      <div>Field</div>
                      <div>Value</div>
                      <div>Confidence</div>
                    </div>
                    {mockResults.map((result, index) => (
                      <motion.div
                        key={result.field}
                        className="grid grid-cols-3 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <div className="font-medium text-gray-900">{result.field}</div>
                        <div className="text-gray-700">{result.value}</div>
                        <div>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                            {result.confidence}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="flex flex-col sm:flex-row justify-center gap-4"
              >
                <Button
                  onClick={() => {
                    setState("upload")
                    setUploadedImage(null)
                    setCroppedImage(null)
                    setCurrentStep(0)
                    setConfidence(0)
                    setRiskLevel(0)
                    setProcessingSpeed(0)
                    setAccuracy(0)
                    setIsUploading(false)
                    setIsStartingAnalysis(false)
                    setSteps((prev) => prev.map((step) => ({ ...step, status: "pending" })))
                  }}
                  className="px-8 py-3 text-lg"
                >
                  Analyze Another Document
                </Button>
                <Button variant="outline" className="px-8 py-3 text-lg bg-transparent">
                  Download Report
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
