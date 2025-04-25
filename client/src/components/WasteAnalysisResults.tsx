import { useState, useEffect } from "react";
import { Check, Tags, Lightbulb, Globe, MapPin, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getRecyclingRecommendations } from "@/lib/gemini";
import { ClassificationResult } from "@/lib/tensorflow";
import { Link } from "wouter";

interface WasteAnalysisResultsProps {
  classificationResult: ClassificationResult;
  onScanAgain: () => void;
}

export default function WasteAnalysisResults({
  classificationResult,
  onScanAgain,
}: WasteAnalysisResultsProps) {
  const [showImpactSection, setShowImpactSection] = useState(false);

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['/api/recommendations', classificationResult.type],
    queryFn: async () => {
      return await getRecyclingRecommendations(classificationResult.type);
    },
    enabled: !!classificationResult.type,
  });

  useEffect(() => {
    // Add a slight delay to show impact section for a smoother UX
    const timer = setTimeout(() => {
      setShowImpactSection(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="neumorphic p-6 bg-background">
      <div className="text-center mb-4">
        <div className="inline-block p-3 rounded-full bg-primary bg-opacity-20 mb-4">
          <Check className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-2xl font-bold font-poppins text-text">Waste Analysis Results</h3>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Classification Result */}
        <div className="p-4 bg-white rounded-xl shadow">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white mr-3">
              <Tags className="h-5 w-5" />
            </div>
            <h4 className="text-lg font-bold font-poppins">Classification</h4>
          </div>
          <p className="text-gray-600 mb-2">This item is classified as:</p>
          <div className="bg-secondary bg-opacity-10 p-3 rounded-lg text-center">
            <span className="text-xl font-bold text-secondary">
              {classificationResult.isRecyclable ? "Recyclable - " : ""}{classificationResult.type}
            </span>
          </div>
        </div>

        {/* Recommendation */}
        <div className="p-4 bg-white rounded-xl shadow">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white mr-3">
              <Lightbulb className="h-5 w-5" />
            </div>
            <h4 className="text-lg font-bold font-poppins">Recommendation</h4>
          </div>
          <p className="text-gray-600 mb-2">Proper disposal method:</p>
          <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
            {isLoading ? (
              <p className="text-primary animate-pulse">Loading recommendations...</p>
            ) : (
              <p className="text-primary">
                {recommendations?.recommendation || classificationResult.disposalMethod}
              </p>
            )}
          </div>
        </div>

        {/* Impact Information - conditionally rendered */}
        {showImpactSection && (
          <div className="p-4 bg-white rounded-xl shadow animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white mr-3">
                <Globe className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-bold font-poppins">Environmental Impact</h4>
            </div>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              {isLoading ? (
                <>
                  <li className="animate-pulse">Loading environmental impact data...</li>
                  <li className="animate-pulse">Please wait...</li>
                </>
              ) : (
                recommendations?.environmentalImpact?.map((impact, index) => (
                  <li key={index}>{impact}</li>
                )) || (
                  <>
                    <li>Proper disposal helps reduce landfill waste</li>
                    <li>Prevents harmful chemicals from leaching into soil and waterways</li>
                    <li>Conserves natural resources by recycling materials</li>
                  </>
                )
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
        <Button asChild variant="secondary" className="rounded-full">
          <Link href="/recycling-centers">
            <MapPin className="mr-2 h-4 w-4" /> Find Nearby Facilities
          </Link>
        </Button>
        <Button
          variant="outline"
          className="rounded-full border border-gray-300"
          onClick={onScanAgain}
        >
          <RotateCw className="mr-2 h-4 w-4" /> Scan Again
        </Button>
      </div>
    </div>
  );
}
