import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      console.error("Camera access error:", error);
      toast.error("Unable to access camera. Please grant permission and try again.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setIsStreaming(false);
    }
  }, []);

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/jpeg", 0.95);
    setCapturedImage(imageData);
    stopCamera();
    toast.success("Image captured successfully");
  }, [stopCamera]);

  const retake = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const confirmCapture = useCallback(() => {
    if (capturedImage) {
      onCapture(capturedImage);
      setCapturedImage(null);
    }
  }, [capturedImage, onCapture]);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          {!isStreaming && !capturedImage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button onClick={startCamera} size="lg" className="gap-2">
                <Camera className="w-5 h-5" />
                Start Camera
              </Button>
            </div>
          )}

          {isStreaming && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          )}

          {capturedImage && (
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {isStreaming && (
          <div className="flex gap-3">
            <Button variant="outline" onClick={stopCamera} className="flex-1">
              <XCircle className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={captureImage} className="flex-1">
              <Camera className="w-4 h-4 mr-2" />
              Capture
            </Button>
          </div>
        )}

        {capturedImage && (
          <div className="flex gap-3">
            <Button variant="outline" onClick={retake} className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake
            </Button>
            <Button onClick={confirmCapture} className="flex-1">
              <CheckCircle className="w-4 h-4 mr-2" />
              Analyze
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
