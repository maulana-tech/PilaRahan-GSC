import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import ImageUploader from "@/components/ImageUploader";
import WasteAnalysisResults from "@/components/WasteAnalysisResults";
import { Card, CardContent } from "@/components/ui/card";
import { classifyWasteImage, ClassificationResult } from "@/lib/classify-waste-image";
import { 
  Scan as ScanIcon,
  Camera,
  Upload, 
  Recycle,
  Leaf,
  FileQuestion, 
  Info,
  Bot,
  RefreshCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useMobile } from "@/hooks/use-mobile";

export default function Scan() {
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [classificationResult, setClassificationResult] = useState<ClassificationResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [modelLoadingProgress, setModelLoadingProgress] = useState(0);
  const [showFeatures, setShowFeatures] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const featuresSectionRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useMobile();

  // Load AI model on component mount
  useEffect(() => {
    const loadAIModel = async () => {
      try {
        // Mock loading progress untuk UX yang lebih baik
        const interval = setInterval(() => {
          setModelLoadingProgress(prev => {
            if (prev >= 90) {
              clearInterval(interval);
              return 90;
            }
            return prev + 10;
          });
        }, 300);

        try {
          // Simulate model loading - no actual model loading needed anymore
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log("AI model loaded successfully");
        } catch (err) {
          console.error("Error loading AI model:", err);
          toast({
            title: "Menggunakan mode simulasi",
            description: "Model AI tidak dapat dimuat. Menggunakan analisis simulasi untuk tujuan demo.",
          });
        } finally {
          // Allow UI to progress regardless of model load success
          clearInterval(interval);
          setModelLoadingProgress(100);
          
          setTimeout(() => {
            setModelLoading(false);
            setShowFeatures(true);
          }, 500);
        }
      } catch (error) {
        console.error("Critical error in model loading process:", error);
        setModelLoading(false); // Still allow UI to progress
        setShowFeatures(true);
      }
    };

    loadAIModel();
  }, [toast]);

  // Scroll to features section when it's shown
  useEffect(() => {
    if (showFeatures && featuresSectionRef.current) {
      setTimeout(() => {
        featuresSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 1000);
    }
  }, [showFeatures]);

  const handleImageCaptured = async (imageSrc: string, imgElement: HTMLImageElement) => {
    setImageElement(imgElement);
    setIsAnalyzing(true);
    
    try {
      // Simulate longer analysis time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Konversi gambar ke data URI untuk Gemini API
      const canvas = document.createElement('canvas');
      canvas.width = imgElement.width;
      canvas.height = imgElement.height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(imgElement, 0, 0);
        const dataUri = canvas.toDataURL('image/jpeg');
        
        // Gunakan fungsi classifyWasteImage dari classify-waste-image.ts
        const wasteClassification = await classifyWasteImage({ photoDataUri: dataUri });
        
        // Konversi hasil klasifikasi ke format ClassificationResult
        const result: ClassificationResult = {
          type: wasteClassification.category,
          confidence: wasteClassification.confidence,
          isRecyclable: ['Plastic', 'Paper', 'Glass', 'Metal'].includes(wasteClassification.category),
          disposalMethod: getDisposalMethod(wasteClassification.category),
          materialComposition: getMaterialComposition(wasteClassification.category),
          recyclabilityScore: getRecyclabilityScore(wasteClassification.category, wasteClassification.confidence),
          recyclabilityDetails: getRecyclabilityDetails(wasteClassification.category),
        };
        
        setClassificationResult(result);
        setScanCount(prev => prev + 1);
        
        // Show prompt toast for first-time users
        if (scanCount === 0) {
          toast({
            title: "Analisis selesai!",
            description: "Gulir ke bawah untuk melihat hasil detail dan rekomendasi.",
          });
        }
      } else {
        throw new Error("Tidak dapat membuat canvas context");
      }
    } catch (error) {
      console.error("Error classifying image:", error);
      toast({
        title: "Klasifikasi gagal",
        description: error instanceof Error ? error.message : "Gagal menganalisis gambar. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleScanAgain = () => {
    setImageElement(null);
    setClassificationResult(null);
  };

  // Fungsi helper untuk mendapatkan metode pembuangan berdasarkan kategori
  const getDisposalMethod = (category: string): string => {
    switch (category) {
      case 'Plastic':
        return "Bersihkan dengan seksama, periksa kode daur ulang, tempatkan di tempat sampah daur ulang plastik. Lepaskan tutup dan label jika diperlukan.";
      case 'Paper':
        return "Jaga agar tetap kering dan bersih, lepaskan lampiran non-kertas, tempatkan di tempat sampah daur ulang kertas. Hancurkan dokumen sensitif.";
      case 'Glass':
        return "Bilas dengan seksama, lepaskan tutup, tempatkan di tempat sampah daur ulang kaca. Pisahkan berdasarkan warna jika diperlukan secara lokal.";
      case 'Metal':
        return "Bersihkan dengan seksama, lepaskan komponen non-logam, tempatkan di tempat sampah daur ulang logam. Hancurkan kaleng jika memungkinkan.";
      case 'Organic':
        return "Tempatkan di kompos atau pengumpulan limbah hijau. Hindari daging/susu dalam kompos rumah. Pertimbangkan pengomposan cacing.";
      case 'Electronic':
        return "Bawa ke pusat pengumpulan e-waste. Jangan tempatkan di tempat sampah biasa karena mengandung bahan berbahaya.";
      case 'Textile':
        return "Donasikan jika masih dalam kondisi baik, atau bawa ke pusat daur ulang tekstil. Beberapa toko pakaian menerima tekstil bekas untuk didaur ulang.";
      case 'Battery':
        return "Jangan buang di tempat sampah biasa. Bawa ke pusat pengumpulan baterai atau toko elektronik yang menerima baterai bekas.";
      default:
        return "Periksa pedoman otoritas pengelolaan sampah setempat untuk pembuangan yang tepat.";
    }
  };

  // Fungsi helper untuk mendapatkan komposisi material berdasarkan kategori
  const getMaterialComposition = (category: string): string[] => {
    const materialPropertiesMap: Record<string, string[]> = {
      "Plastic": ["Berbasis polimer", "Turunan minyak bumi", "Tidak dapat terurai secara alami", "Ringan"],
      "Paper": ["Serat selulosa", "Dapat terurai secara alami", "Pulp daur ulang", "Berbasis tanaman"],
      "Glass": ["Berbasis silika", "Material inert", "Dapat didaur ulang tanpa batas", "Tahan panas"],
      "Metal": ["Konduktif", "Dapat ditempa", "Nilai daur ulang tinggi", "Komposisi elemen"],
      "Organic": ["Dapat terurai secara alami", "Dapat dikompos", "Kaya karbon", "Material alami"],
      "Electronic": ["Papan sirkuit", "Material campuran", "Elemen langka", "Rakitan kompleks"],
      "Textile": ["Serat kain", "Biodegradabilitas bervariasi", "Sering kali material campuran"],
      "Battery": ["Mengandung logam berat", "Berpotensi beracun", "Memerlukan penanganan khusus"],
      "Other": ["Material tidak terklasifikasi", "Mungkin memerlukan pemrosesan khusus"],
    };
    
    return materialPropertiesMap[category] || materialPropertiesMap["Other"];
  };

  // Fungsi helper untuk mendapatkan skor daur ulang berdasarkan kategori dan kepercayaan
  const getRecyclabilityScore = (category: string, confidence: number): number => {
    const recyclableTypes = ["Plastic", "Paper", "Glass", "Metal"];
    const compostableTypes = ["Organic"];
    const specialHandlingTypes = ["Electronic", "Battery"];
    
    let recyclabilityBase = 0;
    if (recyclableTypes.includes(category)) {
      recyclabilityBase = Math.round(confidence * 100);
      if (category === "Paper") recyclabilityBase -= 5; // Risiko kontaminasi
      if (category === "Glass" || category === "Metal") recyclabilityBase += 5; // Daur ulang tinggi
    } else if (compostableTypes.includes(category)) {
      recyclabilityBase = 90; // Kompos tinggi
    } else if (specialHandlingTypes.includes(category)) {
      recyclabilityBase = 75; // Daur ulang khusus
    } else {
      recyclabilityBase = 20; // Daur ulang rendah
    }
    
    return Math.min(98, recyclabilityBase);
  };

  // Fungsi helper untuk mendapatkan detail daur ulang berdasarkan kategori
  const getRecyclabilityDetails = (category: string): string => {
    const recyclableTypes = ["Plastic", "Paper", "Glass", "Metal"];
    const compostableTypes = ["Organic"];
    const specialHandlingTypes = ["Electronic", "Battery"];
    
    if (recyclableTypes.includes(category)) {
      if (category === "Glass" || category === "Metal") {
        return "Sangat dapat didaur ulang dengan proses standar";
      }
      return "Dapat didaur ulang dengan proses standar";
    } else if (compostableTypes.includes(category)) {
      return "Dapat dikompos dengan mudah di fasilitas pengomposan";
    } else if (specialHandlingTypes.includes(category)) {
      return "Dapat didaur ulang tetapi memerlukan penanganan khusus";
    } else {
      return "Sulit didaur ulang dengan metode standar";
    }
  };

  // Fungsi helper untuk mendapatkan label kategori berdasarkan kategori
  const getCategoryLabel = (category: string): string => {
    const recyclableTypes = ["Plastic", "Paper", "Glass", "Metal"];
    const compostableTypes = ["Organic"];
    const specialHandlingTypes = ["Electronic", "Battery"];
    
    if (recyclableTypes.includes(category)) {
      return "Recycle";
    } else if (compostableTypes.includes(category)) {
      return "Organik";
    } else if (specialHandlingTypes.includes(category)) {
      return "Penanganan Khusus";
    } else {
      return "Unknown";
    }
  };

  // Fungsi helper untuk mendapatkan dampak lingkungan berdasarkan kategori
  const getEnvironmentalImpact = (category: string): { carbonFootprintKg: number; energyRecoveryPotentialMJ: number } => {
    const environmentalImpactMap: Record<string, { carbonFootprintKg: number; energyRecoveryPotentialMJ: number }> = {
      "Plastic": { carbonFootprintKg: 2.5, energyRecoveryPotentialMJ: 20 },
      "Paper": { carbonFootprintKg: 1.0, energyRecoveryPotentialMJ: 15 },
      "Glass": { carbonFootprintKg: 0.8, energyRecoveryPotentialMJ: 10 },
      "Metal": { carbonFootprintKg: 1.5, energyRecoveryPotentialMJ: 25 },
      "Organic": { carbonFootprintKg: 0.3, energyRecoveryPotentialMJ: 5 },
      "Electronic": { carbonFootprintKg: 5.0, energyRecoveryPotentialMJ: 30 },
      "Battery": { carbonFootprintKg: 4.0, energyRecoveryPotentialMJ: 15 },
      "Textile": { carbonFootprintKg: 1.8, energyRecoveryPotentialMJ: 18 },
      "Unknown": { carbonFootprintKg: 2.0, energyRecoveryPotentialMJ: 10 },
    };
    
    return environmentalImpactMap[category] || environmentalImpactMap["Unknown"];
  };

  return (
    <div className="bg-gradient-to-b from-primary/5 to-background">
      {/* Hero Section with Scan Feature */}
      <section className="min-h-screen pt-20 px-4 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-40 -left-32 w-64 h-64 bg-primary opacity-10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 -right-20 w-80 h-80 bg-secondary opacity-10 rounded-full filter blur-3xl"></div>
        
        <div className="max-w-7xl w-full mx-auto z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
              <ScanIcon className="h-6 w-6 text-primary mr-2" />
              <span className="text-sm font-medium text-primary">PilaRahan Scanner</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-poppins mb-4 text-text bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Identifikasi & Daur Ulang
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              AI kami secara instan mengidentifikasi sampah dan memberikan panduan daur ulang yang dipersonalisasi.
              Cukup ambil foto atau unggah gambar untuk memulai.
            </p>
          </div>

          {modelLoading ? (
            <div className="w-full max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-lg">
              <div className="flex flex-col items-center justify-center min-h-[300px]">
                <Bot className="h-16 w-16 text-primary animate-pulse mb-6" />
                <h3 className="text-xl font-bold font-poppins mb-3 text-text">
                  Memuat Model AI...
                </h3>
                <div className="w-full max-w-md mb-4">
                  <Progress value={modelLoadingProgress} max={100} className="h-2" />
                </div>
                <p className="text-gray-600 text-center">
                  Menyiapkan teknologi klasifikasi sampah canggih kami
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
              <div className="lg:w-1/2">
                {!imageElement ? (
                  <div className="relative">
                    <ImageUploader 
                      onImageCaptured={handleImageCaptured} 
                      className="transition-all hover:scale-[1.01]"
                    />
                  </div>
                ) : (
                  <div className="neumorphic p-6 bg-background">
                    <div className="neumorphic-inset p-4 bg-background flex flex-col items-center justify-center min-h-[400px]">
                      {isAnalyzing ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <div className="relative mb-6">
                            <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <Bot className="h-8 w-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                          </div>
                          <h3 className="text-xl font-bold text-text mb-2">AI Analysis in Progress</h3>
                          <p className="text-gray-600">Our smart algorithm is analyzing your waste item...</p>
                        </div>
                      ) : (
                        <img
                          src={imageElement.src}
                          alt="Uploaded waste"
                          className="max-w-full max-h-[350px] object-contain rounded-lg shadow-lg"
                        />
                      )}
                    </div>
                    
                    {!isAnalyzing && !classificationResult && (
                      <div className="mt-4 flex justify-center">
                        <Button onClick={handleScanAgain} variant="outline" className="rounded-full">
                          <RefreshCcw className="mr-2 h-4 w-4" /> Retake Photo
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="lg:w-1/2">
                {classificationResult ? (
                  <WasteAnalysisResults
                    classificationResult={classificationResult}
                    onScanAgain={handleScanAgain}
                  />
                ) : (
                  <Card className="neumorphic p-6 bg-background h-full">
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Feature Highlights Section */}
      {showFeatures && (
        <section 
          ref={featuresSectionRef}
          className="py-20 px-4 bg-white animate-in fade-in"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4 text-text">
                Bagaimana AI Scanner Kami Bekerja
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Teknologi canggih yang membuat identifikasi sampah menjadi sederhana dan akurat
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 border-none shadow-lg hover:shadow-xl transition-all">
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-poppins mb-3">Pengambilan Gambar</h3>
                <p className="text-gray-600">
                  Ambil foto sampah menggunakan kamera atau unggah gambar yang sudah ada dari perangkat Anda.
                </p>
              </Card>
              
              <Card className="p-6 border-none shadow-lg hover:shadow-xl transition-all">
                <div className="bg-secondary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <Bot className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold font-poppins mb-3">Analisis AI</h3>
                <p className="text-gray-600">
                  Algoritma pembelajaran mesin kami menganalisis gambar untuk mengidentifikasi jenis sampah dengan akurasi tinggi.
                </p>
              </Card>
              
              <Card className="p-6 border-none shadow-lg hover:shadow-xl transition-all">
                <div className="bg-accent/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <Recycle className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold font-poppins mb-3">Rekomendasi Cerdas</h3>
                <p className="text-gray-600">
                  Dapatkan instruksi pembuangan yang dipersonalisasi, penilaian daur ulang, dan informasi dampak lingkungan.
                </p>
              </Card>
            </div>
            
            <div className="mt-16 text-center">
              <Button 
                className="rounded-full text-lg py-6 px-8"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <ScanIcon className="mr-2 h-5 w-5" /> Coba Scanner Sampah
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
