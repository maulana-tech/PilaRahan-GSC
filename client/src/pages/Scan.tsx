import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import ImageUploader from "@/components/ImageUploader";
import WasteAnalysisResults from "@/components/WasteAnalysisResults";
import { Card, CardContent } from "@/components/ui/card";
import { classifyImage, ClassificationResult, loadModel } from "@/lib/tensorflow";
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

  // Load TensorFlow model on component mount
  useEffect(() => {
    const loadTensorFlowModel = async () => {
      try {
        // Mock loading progress since we can't get actual progress from loadModel
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
          await loadModel();
          console.log("TensorFlow.js loaded successfully");
        } catch (err) {
          // Continue with mock analysis even if model fails to load
          console.error("Error loading TensorFlow model:", err);
          toast({
            title: "Using simulation mode",
            description: "AI model could not be loaded. Using simulated analysis for demo purposes.",
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

    loadTensorFlowModel();
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
      
      const result = await classifyImage(imgElement);
      setClassificationResult(result);
      setScanCount(prev => prev + 1);
      
      // Show prompt toast for first-time users
      if (scanCount === 0) {
        toast({
          title: "Analysis complete!",
          description: "Scroll down to see detailed results and recommendations.",
        });
      }
    } catch (error) {
      console.error("Error classifying image:", error);
      toast({
        title: "Classification failed",
        description: error instanceof Error ? error.message : "Failed to analyze the image. Please try again.",
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
              Identify & Recycle
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Our AI instantly identifies waste items and provides personalized recycling guidance.
              Just snap a photo or upload an image to get started.
            </p>
          </div>

          {modelLoading ? (
            <div className="w-full max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-lg">
              <div className="flex flex-col items-center justify-center min-h-[300px]">
                <Bot className="h-16 w-16 text-primary animate-pulse mb-6" />
                <h3 className="text-xl font-bold font-poppins mb-3 text-text">
                  Loading AI Model...
                </h3>
                <div className="w-full max-w-md mb-4">
                  <Progress value={modelLoadingProgress} max={100} className="h-2" />
                </div>
                <p className="text-gray-600 text-center">
                  Preparing our advanced waste classification technology
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
                    
                    {/* Feature badges */}
                    <div className="absolute -right-12 top-1/3 transform -translate-y-1/2 hidden lg:block">
                      <div className="flex flex-col gap-3">
                        <div className="bg-white p-2 rounded-full shadow-lg flex items-center justify-center w-12 h-12">
                          <Camera className="h-6 w-6 text-primary" />
                        </div>
                        <div className="bg-white p-2 rounded-full shadow-lg flex items-center justify-center w-12 h-12">
                          <Upload className="h-6 w-6 text-secondary" />
                        </div>
                        <div className="bg-white p-2 rounded-full shadow-lg flex items-center justify-center w-12 h-12">
                          <Recycle className="h-6 w-6 text-accent" />
                        </div>
                      </div>
                    </div>
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
                    <CardContent className="pt-6 flex flex-col items-center justify-center h-full">
                      <div className="relative w-48 h-48 mb-6">
                        <img
                          src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                          alt="AI waste classification illustration"
                          className="w-full h-full object-cover rounded-full"
                        />
                        <div className="absolute -right-4 -bottom-4 bg-primary text-white p-3 rounded-full shadow-lg">
                          <Bot className="h-6 w-6" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold font-poppins mb-3 text-text">
                        AI-Powered Waste Analysis
                      </h3>
                      <p className="text-gray-600 text-center max-w-md mb-6">
                        Our advanced image recognition technology identifies waste items with high accuracy
                        and provides tailored recycling guidance.
                      </p>
                      
                      {!isMobile && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="flex items-center">
                            <div className="p-2 rounded-full bg-primary/10 mr-3">
                              <Recycle className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-sm">Precise Classification</span>
                          </div>
                          <div className="flex items-center">
                            <div className="p-2 rounded-full bg-secondary/10 mr-3">
                              <Leaf className="h-5 w-5 text-secondary" />
                            </div>
                            <span className="text-sm">Eco-Friendly Tips</span>
                          </div>
                          <div className="flex items-center">
                            <div className="p-2 rounded-full bg-accent/10 mr-3">
                              <FileQuestion className="h-5 w-5 text-accent" />
                            </div>
                            <span className="text-sm">Disposal Guidelines</span>
                          </div>
                          <div className="flex items-center">
                            <div className="p-2 rounded-full bg-blue-500/10 mr-3">
                              <Info className="h-5 w-5 text-blue-500" />
                            </div>
                            <span className="text-sm">Impact Insights</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
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
                How Our AI Scanner Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Advanced technology that makes waste identification simple and accurate
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 border-none shadow-lg hover:shadow-xl transition-all">
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-poppins mb-3">Image Capture</h3>
                <p className="text-gray-600">
                  Take a photo of any waste item using your camera or upload an existing image from your device.
                </p>
              </Card>
              
              <Card className="p-6 border-none shadow-lg hover:shadow-xl transition-all">
                <div className="bg-secondary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <Bot className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold font-poppins mb-3">AI Analysis</h3>
                <p className="text-gray-600">
                  Our machine learning algorithm analyzes the image to identify the waste type with high accuracy.
                </p>
              </Card>
              
              <Card className="p-6 border-none shadow-lg hover:shadow-xl transition-all">
                <div className="bg-accent/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <Recycle className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold font-poppins mb-3">Smart Recommendations</h3>
                <p className="text-gray-600">
                  Get personalized disposal instructions, recyclability assessment, and environmental impact information.
                </p>
              </Card>
            </div>
            
            <div className="mt-16 text-center">
              <Button 
                className="rounded-full text-lg py-6 px-8"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <ScanIcon className="mr-2 h-5 w-5" /> Try Waste Scanner
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
