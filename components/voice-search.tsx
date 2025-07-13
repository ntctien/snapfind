"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, MicOff, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"

interface VoiceSearchProps {
  isOpen: boolean
  onClose: () => void
  onResult: (transcript: string) => void
}

export function VoiceSearch({ isOpen, onClose, onResult }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [error, setError] = useState("")
  const recognitionRef = useRef<any | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      recognitionRef.current = new SpeechRecognition()

      const recognition = recognitionRef.current
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "vi-VN"

      recognition.onstart = () => {
        setIsListening(true)
        setError("")
      }

      recognition.onresult = (event) => {
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        setTranscript((prev) => prev + finalTranscript)
        setInterimTranscript(interimTranscript)
      }

      recognition.onerror = (event) => {
        setError(`Lỗi nhận diện giọng nói: ${event.error}`)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }
    } else {
      setError("Trình duyệt không hỗ trợ nhận diện giọng nói")
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript("")
      setInterimTranscript("")
      setError("")
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const handleSearch = () => {
    if (transcript.trim()) {
      onResult(transcript.trim())
      setTranscript("")
      setInterimTranscript("")
    }
  }

  const handleClose = () => {
    if (isListening) {
      stopListening()
    }
    setTranscript("")
    setInterimTranscript("")
    setError("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Volume2 className="h-5 w-5" />
            <span>Tìm kiếm bằng giọng nói</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </CardContent>
            </Card>
          )}

          <div className="text-center">
            <Button
              size="lg"
              variant={isListening ? "destructive" : "default"}
              onClick={isListening ? stopListening : startListening}
              className="w-24 h-24 rounded-full"
              disabled={!!error}
            >
              {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
            </Button>
            <p className="mt-2 text-sm text-gray-600">{isListening ? "Đang nghe..." : "Nhấn để bắt đầu nói"}</p>
          </div>

          {(transcript || interimTranscript) && (
            <Card>
              <CardContent className="p-4">
                <p className="text-sm font-medium mb-2">Nội dung nhận diện:</p>
                <p className="text-gray-900">
                  {transcript}
                  <span className="text-gray-500 italic">{interimTranscript}</span>
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
              Hủy
            </Button>
            <Button onClick={handleSearch} disabled={!transcript.trim()} className="flex-1">
              Tìm kiếm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
