import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Camera, BookOpen } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6 text-white">
            Join the Movement for a Cleaner Planet
          </h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
            Start using WasteWise today and become part of the solution to global waste challenges.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="default" size="lg" className="bg-white text-primary hover:bg-gray-100 rounded-full">
              <Link href="/scan">
                <Camera className="mr-2 h-4 w-4" /> Scan Waste Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-full">
              <Link href="/learning">
                <BookOpen className="mr-2 h-4 w-4" /> Explore Resources
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4 text-text">
              Making an Impact Together
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Through collaborative efforts, we're creating a more sustainable future.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center neumorphic">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">10M+</div>
                <p className="text-gray-600">Items Classified</p>
              </CardContent>
            </Card>
            <Card className="text-center neumorphic">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-secondary mb-2">5K+</div>
                <p className="text-gray-600">Recycling Centers</p>
              </CardContent>
            </Card>
            <Card className="text-center neumorphic">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-accent mb-2">2M+</div>
                <p className="text-gray-600">Active Users</p>
              </CardContent>
            </Card>
            <Card className="text-center neumorphic">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <p className="text-gray-600">Countries Served</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
