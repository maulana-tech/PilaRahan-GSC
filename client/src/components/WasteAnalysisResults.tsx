import { useState, useEffect } from "react";
import { Check, Tags, Lightbulb, Globe, MapPin, RotateCw, BarChart, Award, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getRecyclingRecommendations } from "@/lib/gemini";
import { ClassificationResult } from "@/lib/tensorflow";
import { Link } from "wouter";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface WasteAnalysisResultsProps {
  classificationResult: ClassificationResult;
  onScanAgain: () => void;
}

export default function WasteAnalysisResults({
  classificationResult,
  onScanAgain,
}: WasteAnalysisResultsProps) {
  const [showImpactSection, setShowImpactSection] = useState(false);
  const [showMaterialsSection, setShowMaterialsSection] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(false);

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['/api/recommendations', classificationResult.type],
    queryFn: async () => {
      return await getRecyclingRecommendations(classificationResult.type);
    },
    enabled: !!classificationResult.type,
  });

  useEffect(() => {
    // Staggered animation for smoother UX
    const timer1 = setTimeout(() => {
      setAnimateProgress(true);
    }, 300);
    
    const timer2 = setTimeout(() => {
      setShowMaterialsSection(true);
    }, 600);
    
    const timer3 = setTimeout(() => {
      setShowImpactSection(true);
    }, 900);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Get badge color based on recyclability score
  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    if (score >= 40) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  // Get progress color based on recyclability score
  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="neumorphic p-6 bg-background">
      <div className="text-center mb-4">
        <div className="inline-block p-3 rounded-full bg-primary bg-opacity-20 mb-4">
          <Check className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-2xl font-bold font-poppins text-text">Waste Analysis Results</h3>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Classification Result with Recyclability Score */}
        <div className="p-4 bg-white rounded-xl shadow">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white mr-3">
              <Tags className="h-5 w-5" />
            </div>
            <h4 className="text-lg font-bold font-poppins">Classification</h4>
            <div className="ml-auto">
              <Badge 
                className={`px-2 py-1 ${getScoreBadgeColor(classificationResult.recyclabilityScore)}`}
              >
                {classificationResult.isRecyclable ? "Recyclable" : "Non-Recyclable"}
              </Badge>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <p className="text-gray-600">Material Type:</p>
              <span className="font-semibold text-text">{classificationResult.type}</span>
            </div>
            
            <div className="flex justify-between mb-1">
              <p className="text-gray-600">Confidence:</p>
              <span className="font-semibold text-text">{Math.round(classificationResult.confidence * 100)}%</span>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <BarChart className="h-4 w-4 mr-1 text-secondary" />
                  <span className="text-sm font-medium">Recyclability Score</span>
                </div>
                <span className="text-sm font-semibold">{classificationResult.recyclabilityScore}/100</span>
              </div>
              <Progress 
                value={animateProgress ? classificationResult.recyclabilityScore : 0} 
                max={100} 
                className={`h-2 transition-all duration-1000 ease-out ${getProgressColor(classificationResult.recyclabilityScore)}`}
              />
              <p className="text-xs mt-1 text-gray-500">{classificationResult.recyclabilityDetails}</p>
            </div>
          </div>
        </div>

        {/* Material Composition Section */}
        {showMaterialsSection && classificationResult.materialComposition && (
          <div className="p-4 bg-white rounded-xl shadow animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
                <Layers className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-bold font-poppins">Material Composition</h4>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {classificationResult.materialComposition.map((property, index) => (
                <div key={index} className="py-2 px-3 bg-blue-50 rounded-lg text-blue-800 flex items-center">
                  <Award className="h-4 w-4 mr-2 text-blue-500" />
                  {property}
                </div>
              ))}
            </div>
          </div>
        )}

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
