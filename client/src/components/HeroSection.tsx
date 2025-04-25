import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="pt-28 pb-16 md:pt-32 md:pb-24 px-4 bg-gradient-to-br from-background to-green-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0 pr-0 md:pr-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins mb-6 leading-tight text-text">
            Smart Waste <span className="text-primary">Classification</span> for a Better Planet
          </h1>
          <p className="text-lg mb-8 text-gray-600">
            WasteWise uses AI to analyze your waste, provide recycling recommendations, and help you
            find nearby recycling centers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="px-8 py-6 rounded-full neumorphic">
              <Link href="/scan">Classify Waste</Link>
            </Button>
            <Button asChild variant="outline" className="px-8 py-6 rounded-full neumorphic bg-white">
              <Link href="/learning">Learn More</Link>
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 relative">
          <div className="organic-shape bg-white p-3 neumorphic">
            <img
              src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
              alt="Person recycling waste"
              className="rounded-2xl organic-shape"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 z-10 bg-white p-3 rounded-xl neumorphic">
            <div className="flex items-center gap-2 p-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium font-poppins text-sm">AI-Powered</p>
                <p className="text-xs text-gray-500">100% Accurate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
