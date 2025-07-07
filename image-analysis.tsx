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
  Download,
  RotateCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { MultiSelect } from "./components/multi-select"
import { ThreeBodyLoader } from "./components/three-body-loader"
import { AnimatedCounter } from "./components/animated-counter"
import { PulseRing } from "./components/pulse-ring"
import { SkeletonOverlay } from "./components/skeleton-overlay"
import { ImageCropper } from "./components/image-cropper"
import { AnimatedBackground } from "./components/ui/animated-background"
import { GradientCard } from "./components/ui/gradient-card"
import { FloatingCard } from "./components/ui/floating-card"
import { GlassButton } from "./components/ui/glass-button"
import { ProgressRing } from "./components/ui/progress-ring"
import { StatusBadge } from "./components/ui/status-badge"
import { MetricCard } from "./components/ui/metric-card"
import { UploadZone } from "./components/ui/upload-zone"
import { ChainedLoader } from "./components/ui/chained-loader"

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

  const handleFileSelect = (file: File) => {
    setIsUploading(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      setTimeout(() => {
        setUploadedImage(e.target?.result as string)
        setIsUploading(false)
        setState("crop")
      }, 1500)
    }
    reader.readAsDataURL(file)
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

  const resetAnalysis = () => {
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

  const mockResults = [
    { field: "Document Type", value: "Government ID", confidence: "98%" },
    { field: "Text Quality", value: "High", confidence: "95%" },
    { field: "Fraud Indicators", value: "None Detected", confidence: "92%" },
    { field: "Signature Present", value: "Yes", confidence: "89%" },
    { field: "Security Features", value: "Valid", confidence: "96%" },
  ]

  const displayImage = croppedImage || uploadedImage

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <AnimatePresence mode="wait">
        {state === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-center min-h-screen p-4"
          >
            <FloatingCard className="w-full max-w-2xl p-8">
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <motion.div
                    className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center"
                    animate={isUploading ? { rotate: 360 } : {}}
                    transition={{ duration: 2, repeat: isUploading ? Infinity : 0, ease: "linear" }}
                  >
                    {isUploading ? (
                      <ThreeBodyLoader size="md" color="#6366f1" />
                    ) : (
                      <Upload className="w-10 h-10 text-blue-600" />
                    )}
                  </motion.div>
                  
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                      {isUploading ? "Uploading..." : "Document Analysis"}
                    </h1>
                    <p className="text-gray-600 text-lg">
                      {isUploading ? "Processing your image..." : "Upload and analyze your documents with AI"}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <GradientCard gradient="blue" className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Options</h3>
                    <MultiSelect
                      options={analysisOptions}
                      onValueChange={setSelectedOptions}
                      defaultValue={selectedOptions}
                      placeholder="Select analysis options"
                      variant="default"
                    />
                  </GradientCard>

                  <UploadZone 
                    onFileSelect={handleFileSelect}
                    isUploading={isUploading}
                  />
                </div>
              </div>
            </FloatingCard>
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
            <FloatingCard className="w-full max-w-5xl p-8">
              <ImageCropper imageSrc={uploadedImage} onCropComplete={handleCropComplete} onCancel={handleCropCancel} />
            </FloatingCard>
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
            <FloatingCard className="w-full max-w-2xl p-8">
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                  </div>
                  
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                      Ready for Analysis
                    </h1>
                    <p className="text-gray-600 text-lg">Your document has been cropped and is ready to analyze</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <GradientCard gradient="green" className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Options</h3>
                    <MultiSelect
                      options={analysisOptions}
                      onValueChange={setSelectedOptions}
                      defaultValue={selectedOptions}
                      placeholder="Select analysis options"
                      variant="default"
                    />
                  </GradientCard>

                  <div className="space-y-6">
                    <div className="flex justify-center">
                      <div className="relative">
                        <img
                          src={croppedImage || "/placeholder.svg"}
                          alt="Cropped document"
                          className="max-w-md w-full h-auto rounded-2xl shadow-2xl"
                        />
                        {!isStartingAnalysis && (
                          <div className="absolute -top-3 -right-3 flex gap-2">
                            <GlassButton
                              size="sm"
                              variant="secondary"
                              onClick={recropImage}
                              className="w-10 h-10 p-0"
                            >
                              <Crop className="w-4 h-4" />
                            </GlassButton>
                            <GlassButton
                              size="sm"
                              variant="danger"
                              onClick={removeImage}
                              className="w-10 h-10 p-0"
                            >
                              <X className="w-4 h-4" />
                            </GlassButton>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-center">
                      {isStartingAnalysis ? (
                        <StatusBadge status="processing">
                          <ThreeBodyLoader size="sm" color="#3b82f6" />
                          <span>Starting Analysis...</span>
                        </StatusBadge>
                      ) : (
                        <GlassButton
                          onClick={startAnalysis}
                          size="lg"
                          variant="primary"
                        >
                          <Play className="w-5 h-5" />
                          Start Analysis
                        </GlassButton>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </FloatingCard>
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
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                {/* Left side - Image */}
                <div className="flex justify-center items-center min-h-[500px]">
                  <FloatingCard className="relative w-full max-w-lg p-4">
                    {displayImage && (
                      <img
                        src={displayImage || "/placeholder.svg"}
                        alt="Document being analyzed"
                        className="w-full h-auto max-h-[500px] object-contain rounded-xl"
                      />
                    )}
                    <SkeletonOverlay />
                  </FloatingCard>
                </div>

                {/* Right side - Chained Loading Progress */}
                <div className="space-y-8">
                  <FloatingCard className="p-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          <Zap className="w-6 h-6 text-blue-600" />
                        </motion.div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                          Analysis Progress
                        </h2>
                      </div>

                      {/* Chained Loading Animation */}
                      <ChainedLoader steps={steps} />

                      <StatusBadge status="processing">
                        <PulseRing size={16} color="#6b7280" intensity="low" />
                        <span>
                          Processing step <AnimatedCounter value={currentStep + 1} duration={0.5} /> of {steps.length}
                        </span>
                      </StatusBadge>
                    </div>
                  </FloatingCard>
                </div>
              </div>

              {/* Metrics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mt-8"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <MetricCard
                    title="Confidence"
                    value={confidence}
                    suffix="%"
                    color="green"
                    icon={<Target className="w-5 h-5" />}
                  />
                  <MetricCard
                    title="Risk Level"
                    value={riskLevel}
                    suffix="%"
                    color="orange"
                    icon={<Shield className="w-5 h-5" />}
                  />
                  <MetricCard
                    title="Speed"
                    value={processingSpeed}
                    suffix="%"
                    color="blue"
                    icon={<Zap className="w-5 h-5" />}
                  />
                  <MetricCard
                    title="Accuracy"
                    value={accuracy}
                    suffix="%"
                    color="purple"
                    icon={<Brain className="w-5 h-5" />}
                  />
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
            <div className="max-w-6xl mx-auto space-y-12">
              {/* Header */}
              <div className="text-center space-y-4">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                  Analysis Complete
                </h1>
                <p className="text-xl text-gray-600">Your document has been successfully analyzed with AI</p>
              </div>

              {/* Image and Summary */}
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <FloatingCard className="p-6">
                  {displayImage && (
                    <img
                      src={displayImage || "/placeholder.svg"}
                      alt="Analyzed document"
                      className="w-full h-auto rounded-xl"
                    />
                  )}
                </FloatingCard>

                <div className="space-y-6">
                  <FloatingCard className="p-6">
                    <div className="text-center space-y-4">
                      <ProgressRing progress={confidence} size={120}>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            <AnimatedCounter value={confidence} suffix="%" />
                          </div>
                          <div className="text-sm text-gray-600">Confidence</div>
                        </div>
                      </ProgressRing>
                      <h3 className="text-xl font-semibold text-gray-900">Overall Analysis Score</h3>
                    </div>
                  </FloatingCard>

                  <div className="grid grid-cols-2 gap-4">
                    <MetricCard
                      title="Risk Level"
                      value={riskLevel}
                      suffix="%"
                      color="orange"
                      icon={<Shield className="w-5 h-5" />}
                    />
                    <MetricCard
                      title="Accuracy"
                      value={accuracy}
                      suffix="%"
                      color="green"
                      icon={<Target className="w-5 h-5" />}
                    />
                  </div>
                </div>
              </div>

              {/* Results Table */}
              <FloatingCard className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Detailed Analysis Results</h2>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-gray-200">
                    <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-r from-gray-50 to-gray-100 font-semibold text-gray-900">
                      <div>Field</div>
                      <div>Value</div>
                      <div>Confidence</div>
                    </div>
                    {mockResults.map((result, index) => (
                      <motion.div
                        key={result.field}
                        className="grid grid-cols-3 gap-4 p-6 border-b border-gray-100 transition-colors"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <div className="font-medium text-gray-900">{result.field}</div>
                        <div className="text-gray-700">{result.value}</div>
                        <div>
                          <StatusBadge status="completed">
                            {result.confidence}
                          </StatusBadge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </FloatingCard>

              {/* Action Buttons */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="flex flex-col sm:flex-row justify-center gap-4"
              >
                <GlassButton onClick={resetAnalysis} size="lg" variant="primary">
                  <RotateCcw className="w-5 h-5" />
                  Analyze Another Document
                </GlassButton>
                <GlassButton variant="secondary" size="lg">
                  <Download className="w-5 h-5" />
                  Download Report
                </GlassButton>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}