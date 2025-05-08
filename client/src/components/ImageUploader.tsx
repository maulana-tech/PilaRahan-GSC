import { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload,
  Camera,
  FileImage,
  MoveUpRight,
  RefreshCw,
  Check,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useMobile } from "@/hooks/use-mobile";

interface ImageUploaderProps {
  onImageCaptured: (imageSrc: string, imageElement: HTMLImageElement) => void;
  className?: string;
}

export default function ImageUploader({
  onImageCaptured,
  className,
}: ImageUploaderProps) {
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
        const hasVideoInput = devices.some(
          (device) => device.kind === "videoinput"
        );
        setHasCamera(hasVideoInput);
      } catch (err) {
        console.log("Error checking for camera:", err);
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
    if (!file.type.match("image.*")) {
      toast({
        title: "Tipe file tidak valid",
        description: "Silakan unggah file gambar (JPEG, PNG, dll)",
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
        const img = document.createElement("img");
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
        tracks.forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        // video: {
        //   facingMode: "environment",
        //   width: { ideal: 1920 },
        //   height: { ideal: 1080 },
        // },
        video: true,
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreamActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Akses kamera gagal",
        description: "Pastikan Anda telah memberikan izin kamera.",
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
        const flashElement = document.createElement("div");
        flashElement.style.position = "absolute";
        flashElement.style.top = "0";
        flashElement.style.left = "0";
        flashElement.style.right = "0";
        flashElement.style.bottom = "0";
        flashElement.style.backgroundColor = "white";
        flashElement.style.opacity = "0.8";
        flashElement.style.zIndex = "10";
        flashElement.style.animation = "flash 0.6s";

        const container = videoRef.current.parentElement;
        if (container) {
          container.style.position = "relative";
          container.appendChild(flashElement);

          setTimeout(() => {
            container.removeChild(flashElement);
          }, 600);
        }

        const img = document.createElement("img");
        img.onload = () => {
          // Animate capture success
          toast({
            title: "Gambar berhasil diambil",
            description: "Memproses item sampah Anda...",
          });

          onImageCaptured(img.src, img);

          // Stop the stream after capturing
          if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (
              videoRef.current.srcObject as MediaStream
            ).getTracks();
            tracks.forEach((track) => track.stop());
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
      tracks.forEach((track) => track.stop());
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
    <div className={cn("bg-white rounded-xl shadow-sm overflow-hidden", className)}>
      {!isCapturing ? (
        <div
          ref={dropZoneRef}
          className={cn(
            "p-6 flex flex-col items-center justify-center min-h-[350px] cursor-pointer relative overflow-hidden transition-all duration-300 border-2 border-dashed border-gray-200 rounded-lg mx-4 my-4",
            (isDragging || isHovering) && "border-primary bg-primary/5"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Simplified background */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-5 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary opacity-5 rounded-full"></div>
          </div>

          {isUploading ? (
            <div className="flex flex-col items-center justify-center w-full z-10">
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center">
                  <div
                    className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
                    style={{
                      transform: `rotate(${uploadProgress * 3.6}deg)`,
                      transition: "transform 0.3s ease-out",
                    }}
                  ></div>
                  <FileImage className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Mengunggah Gambar
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Memproses gambar sampah Anda...
              </p>
              <div className="w-full max-w-xs h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {uploadProgress}% selesai
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 p-4 bg-primary/10 rounded-full">
                <ImageIcon className="h-8 w-8 text-primary" />
              </div>
              
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Unggah Gambar Sampah
              </h3>
              
              <p className="text-sm text-center text-gray-600 mb-6 max-w-xs">
                {isDragging ? (
                  <span className="text-primary font-medium">
                    Letakkan gambar di sini!
                  </span>
                ) : (
                  "Seret & letakkan gambar di sini atau ketuk untuk memilih file"
                )}
              </p>
              
              <Button
                className="rounded-full font-medium transition-all duration-300 mb-2 px-6"
              >
                <Upload className="mr-2 h-4 w-4" />
                Pilih File
              </Button>
              
              <p className="text-xs text-gray-500 mb-4">
                Format: JPG, PNG, GIF (Maks. 10MB)
              </p>
              
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
                  <div className="flex items-center gap-3 my-2">
                    <div className="h-px w-16 bg-gray-200"></div>
                    <span className="text-xs text-gray-500">atau</span>
                    <div className="h-px w-16 bg-gray-200"></div>
                  </div>

                  <Button
                    variant="outline"
                    className="rounded-full font-medium transition-all duration-300 hover:bg-primary/10 hover:text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCamera();
                    }}
                  >
                    <Camera className="mr-2 h-4 w-4" /> Gunakan Kamera
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="p-4 flex flex-col items-center justify-center">
          <div className="relative w-full mb-3 bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-[300px] object-cover"
            />
            <div className="absolute left-0 top-0 p-2 text-xs text-white bg-black bg-opacity-50 rounded-br-lg flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
              Kamera Aktif
            </div>
            <div className="absolute right-2 top-2">
              <Button 
                size="sm" 
                variant="ghost" 
                className="rounded-full w-8 h-8 p-0 bg-black bg-opacity-50 hover:bg-opacity-70"
                onClick={handleCancelCapture}
              >
                <X className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4 text-center">
            Posisikan sampah di tengah frame dan pastikan pencahayaan cukup
          </p>
          
          <Button
            variant="default"
            className="rounded-full px-6"
            onClick={handleCaptureImage}
          >
            <Check className="mr-2 h-4 w-4" /> Ambil Foto
          </Button>
        </div>
      )}
    </div>
  );
}
