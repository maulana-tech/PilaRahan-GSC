import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, Camera, Image, FileImage, MoveUpRight, ChevronsUp, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useMobile } from "@/hooks/use-mobile";

interface ImageUploaderProps {
  onImageCaptured: (imageSrc: string, imageElement: HTMLImageElement) => void;
  className?: string;
}

export default function ImageUploader({ onImageCaptured, className }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [streamActive, setStreamActive] = useState(false);
  const isMobile = useMobile();
  const dropZoneRef = useRef<HTMLDivElement>(null);
  
  // Check if device has camera
  useEffect(() => {
    const checkCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoInput = devices.some(device => device.kind === 'videoinput');
        setHasCamera(hasVideoInput);
      } catch (err) {
        console.log('Error checking for camera:', err);
        setHasCamera(false);
      }
    };
    
    checkCamera();
  }, []);
  
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

    // Simulate upload progress for better UX
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(Math.min(progress, 99));
      if (progress >= 100) clearInterval(interval);
    }, 150);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const img = new Image();
        img.onload = () => {
          clearInterval(interval);
          setUploadProgress(100);
          
          // Short delay to show 100% before completing
          setTimeout(() => {
            onImageCaptured(img.src, img);
            setIsUploading(false);
            setUploadProgress(0);
          }, 300);
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
        video: { 
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }, 
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
        
        // Flash effect
        const flashElement = document.createElement('div');
        flashElement.style.position = 'absolute';
        flashElement.style.top = '0';
        flashElement.style.left = '0';
        flashElement.style.right = '0';
        flashElement.style.bottom = '0';
        flashElement.style.backgroundColor = 'white';
        flashElement.style.opacity = '0.8';
        flashElement.style.zIndex = '10';
        flashElement.style.animation = 'flash 0.6s';
        
        const container = videoRef.current.parentElement;
        if (container) {
          container.style.position = 'relative';
          container.appendChild(flashElement);
          
          setTimeout(() => {
            container.removeChild(flashElement);
          }, 600);
        }
        
        const img = new Image();
        img.onload = () => {
          // Animate capture success
          toast({
            title: "Image captured",
            description: "Processing your waste item...",
          });
          
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
    <div className={cn("neumorphic p-6 bg-background relative", className)}>
      {!isCapturing ? (
        <div 
          ref={dropZoneRef}
          className={cn(
            "neumorphic-inset p-8 bg-background flex flex-col items-center justify-center min-h-[400px] cursor-pointer relative overflow-hidden transition-all duration-300",
            (isDragging || isHovering) && "bg-primary bg-opacity-5 scale-[0.99]"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Animated background shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary opacity-5 rounded-full"></div>
            <div className="absolute bottom-10 -left-20 w-40 h-40 bg-secondary opacity-5 rounded-full"></div>
          </div>
          
          {isUploading ? (
            <div className="flex flex-col items-center justify-center w-full z-10">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full border-4 border-gray-200 flex items-center justify-center">
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent" 
                    style={{ 
                      transform: `rotate(${uploadProgress * 3.6}deg)`,
                      transition: 'transform 0.3s ease-out'
                    }}
                  ></div>
                  <FileImage className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-text mb-2">Uploading Image</h3>
              <p className="text-gray-600 mb-4">Processing your waste item...</p>
              <div className="w-full max-w-xs h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-out" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-500">{uploadProgress}% complete</p>
            </div>
          ) : (
            <>
              <div className="relative">
                <div className={cn(
                  "absolute inset-0 bg-primary bg-opacity-10 rounded-full scale-100 opacity-0 transition-all duration-500",
                  (isDragging || isHovering) && "scale-[1.5] opacity-100"
                )}></div>
                <div className={cn(
                  "relative z-10 p-6 rounded-full bg-primary bg-opacity-10 transition-all duration-300", 
                  (isDragging || isHovering) && "bg-opacity-20 scale-95"
                )}>
                  <Upload className={cn(
                    "h-12 w-12 text-primary transition-all duration-300",
                    (isDragging || isHovering) && "scale-110"
                  )} />
                </div>
              </div>
              <p className="text-lg mt-6 mb-6 text-center text-gray-600 max-w-xs">
                {isDragging ? 
                  <span className="text-primary font-medium">Drop your image here!</span> :
                  "Drag & drop an image here or tap to browse"
                }
              </p>
              <Button 
                className={cn(
                  "rounded-full font-poppins font-medium transition-all duration-300", 
                  (isDragging || isHovering) && "bg-opacity-90 scale-105"
                )}
              >
                <MoveUpRight className="mr-2 h-4 w-4" />
                Upload Waste Image
              </Button>
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              
              {hasCamera && (
                <>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-px w-20 bg-gray-300"></div>
                    <span className="text-gray-500">or</span>
                    <div className="h-px w-20 bg-gray-300"></div>
                  </div>
                  
                  <Button 
                    variant="secondary"
                    className="mt-4 rounded-full font-poppins font-medium transition-all duration-300 hover:scale-105"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCamera();
                    }}
                  >
                    <Camera className="mr-2 h-4 w-4" /> Use Camera
                  </Button>
                </>
              )}
              
              {/* Floating animation elements for enhanced UI */}
              <div className="absolute -bottom-10 -right-10 opacity-10 animate-pulse">
                <RefreshCw className="h-20 w-20 text-primary" />
              </div>
              {!isMobile && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 flex items-center animate-bounce">
                  <ChevronsUp className="h-4 w-4 mr-1" /> Upload for analysis
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="neumorphic-inset p-4 bg-background flex flex-col items-center justify-center min-h-[400px]">
          <div className="relative w-full mb-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-[320px] object-cover rounded-lg"
            />
            <div className="absolute left-0 top-0 p-2 text-xs text-white bg-black bg-opacity-50 rounded-tl-lg rounded-br-lg">
              Camera Active
            </div>
          </div>
          <div className="flex space-x-4">
            <Button 
              variant="default" 
              className="rounded-full"
              onClick={handleCaptureImage}
            >
              <Check className="mr-2 h-4 w-4" /> Capture Photo
            </Button>
            <Button 
              variant="outline" 
              className="rounded-full"
              onClick={handleCancelCapture}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      {/* CSS for flash animation */}
      <style jsx global>{`
        @keyframes flash {
          0% { opacity: 0.8; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
