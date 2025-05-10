import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-4 bg-background text-center">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <img
            src="/images/Pilarahan.png"
            alt="PilaRahan Logo"
            className="w-24 h-24 mx-auto mb-6"
          />
        </div>
        <h1
          className="text-4xl md:text-5xl font-medium mb-6 leading-tight 
             bg-shimmer bg-clip-text text-transparent 
             animate-shimmer bg-shimmer-size"
        >
          PilaRahan
        </h1>
        <p className="text-lg mb-8 text-foreground/70 max-w-xl mx-auto">
          PilaRahan is a smart AI-based application that helps sort waste
          easily, quickly, and environmentally friendly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline2" className="px-6 py-2 rounded-md">
            <Link href="/learning">Learn more</Link>
          </Button>
          <Button asChild className="px-6 py-2 rounded-md">
            <Link href="/scan">Get Started</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
