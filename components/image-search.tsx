"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, Upload, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"

interface ImageSearchProps {
  isOpen: boolean
  onClose: () => void
  onResult: (file: File) => void
}

export function ImageSearch({ isOpen, onClose, onResult }: ImageSearchProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSearch = async () => {
    if (selectedImage) {
      setIsProcessing(true)
      try {
        await onResult(selectedImage)
      } catch (error) {
        console.error("Image search failed:", error)
        // You could add error handling UI here
      } finally {
        setIsProcessing(false)
        handleClose()
      }
    }
  }

  const handleClose = () => {
    setSelectedImage(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    setIsProcessing(false)
    onClose()
  }

  const clearImage = () => {
    setSelectedImage(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>Tìm kiếm bằng hình ảnh</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!selectedImage ? (
            <div className="space-y-4">
              <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-4">Tải lên hình ảnh sản phẩm để tìm kiếm</p>
                    <div className="space-y-2">
                      <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Chọn từ thiết bị
                      </Button>
                      <Button variant="outline" onClick={() => cameraInputRef.current?.click()} className="w-full">
                        <Camera className="h-4 w-4 mr-2" />
                        Chụp ảnh
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="relative">
                    <img
                      src={previewUrl! || "/placeholder.svg"}
                      alt="Selected image"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={clearImage}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </CardContent>
              </Card>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Mẹo:</strong> Hệ thống sẽ phân tích hình ảnh và tìm kiếm các sản phẩm tương tự dựa trên:
                </p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• Màu sắc và hình dáng</li>
                  <li>• Loại sản phẩm</li>
                  <li>• Đặc điểm thị giác</li>
                </ul>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
              Hủy
            </Button>
            <Button onClick={handleSearch} disabled={!selectedImage || isProcessing} className="flex-1">
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Tìm kiếm
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
