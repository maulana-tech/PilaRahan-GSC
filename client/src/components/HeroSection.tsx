import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-4 bg-background text-center">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <img 
            src="/logo.png" 
            alt="WasteWise Logo" 
            className="w-16 h-16 mx-auto mb-6"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-medium mb-6 leading-tight text-foreground">
          WasteWise
        </h1>
        <p className="text-lg mb-8 text-foreground/70 max-w-xl mx-auto">
          WasteWise sedang dalam pengembangan. Kami sedang membangun solusi pengelolaan sampah yang lebih cerdas dan ramah lingkungan.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="px-6 py-2 rounded-md">
            <Link href="/learning">Learn more</Link>
          </Button>
          <Button asChild variant="outline" className="px-6 py-2 rounded-md">
            <Link href="/scan">Get Started</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
