import { useState, useRef, useCallback } from "react";
import { Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  onImageCaptured: (imageSrc: string, imageElement: HTMLImageElement) => void;
  className?: string;
}

export default function ImageUploader({ onImageCaptured, className }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [streamActive, setStreamActive] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const img = new Image();
        img.onload = () => {
          onImageCaptured(img.src, img);
        };
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleOpenCamera = async () => {
    try {
      setIsCapturing(true);
      
      // Stop any existing stream
      if (streamActive && videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" }, 
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreamActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera access failed",
        description: "Please make sure you have granted camera permissions.",
        variant: "destructive",
      });
      setIsCapturing(false);
    }
  };

  const handleCaptureImage = () => {
    if (videoRef.current && streamActive) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        const img = new Image();
        img.onload = () => {
          onImageCaptured(img.src, img);
          
          // Stop the stream after capturing
          if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
            setStreamActive(false);
            setIsCapturing(false);
          }
        };
        img.src = canvas.toDataURL("image/png");
      }
    }
  };

  const handleCancelCapture = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setStreamActive(false);
    }
    setIsCapturing(false);
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={cn("neumorphic p-6 bg-background", className)}>
      {!isCapturing ? (
        <div 
          className={cn(
            "neumorphic-inset p-8 bg-background flex flex-col items-center justify-center min-h-[400px] cursor-pointer",
            isDragging && "bg-primary bg-opacity-5"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <Upload className="h-12 w-12 text-primary mb-6" />
          <p className="text-lg mb-6 text-center text-gray-600">
            Drag & drop an image here or click to browse
          </p>
          <Button className="rounded-full font-poppins font-medium">
            Upload Image
          </Button>
          <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          
          <div className="mt-4 flex items-center gap-3">
            <div className="h-px w-28 bg-gray-300"></div>
            <span className="text-gray-500">or</span>
            <div className="h-px w-28 bg-gray-300"></div>
          </div>
          
          <Button 
            variant="secondary"
            className="mt-4 rounded-full font-poppins font-medium"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenCamera();
            }}
          >
            <Camera className="mr-2 h-4 w-4" /> Use Camera
          </Button>
        </div>
      ) : (
        <div className="neumorphic-inset p-4 bg-background flex flex-col items-center justify-center min-h-[400px]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-[320px] object-cover rounded-lg mb-4"
          />
          <div className="flex space-x-4">
            <Button variant="secondary" onClick={handleCaptureImage}>
              Capture Photo
            </Button>
            <Button variant="outline" onClick={handleCancelCapture}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
