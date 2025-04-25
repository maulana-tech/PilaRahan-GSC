import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ImageUploader from "@/components/ImageUploader";
import WasteAnalysisResults from "@/components/WasteAnalysisResults";
import { Card, CardContent } from "@/components/ui/card";
import { classifyImage, ClassificationResult } from "@/lib/tensorflow";
import { Scan as ScanIcon } from "lucide-react";

export default function Scan() {
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [classificationResult, setClassificationResult] = useState<ClassificationResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleImageCaptured = async (imageSrc: string, imgElement: HTMLImageElement) => {
    setImageElement(imgElement);
    setIsAnalyzing(true);
    
    try {
      const result = await classifyImage(imgElement);
      setClassificationResult(result);
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
    <section className="pt-32 pb-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4 text-text">Classify Your Waste</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Take a photo or upload an image to identify your waste and get personalized recycling recommendations.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
            {!imageElement ? (
              <ImageUploader onImageCaptured={handleImageCaptured} />
            ) : (
              <div className="neumorphic p-6 bg-background">
                <div className="neumorphic-inset p-4 bg-background flex flex-col items-center justify-center min-h-[400px]">
                  {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-lg text-center text-gray-600">Analyzing your waste...</p>
                    </div>
                  ) : (
                    <img
                      src={imageElement.src}
                      alt="Uploaded waste"
                      className="max-w-full max-h-[350px] object-contain rounded-lg"
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="md:w-1/2">
            {classificationResult ? (
              <WasteAnalysisResults
                classificationResult={classificationResult}
                onScanAgain={handleScanAgain}
              />
            ) : (
              <Card className="neumorphic p-6 bg-background">
                <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[400px]">
                  <img
                    src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                    alt="AI waste classification illustration"
                    className="w-48 h-48 object-cover rounded-full mb-6"
                  />
                  <h3 className="text-2xl font-bold font-poppins mb-3 text-text">
                    AI-Powered Analysis
                  </h3>
                  <p className="text-gray-600 text-center max-w-md">
                    Our advanced image recognition technology identifies waste items with 100% accuracy
                    and provides tailored recycling guidance.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
