import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LearningResourceCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  categoryColor: "primary" | "secondary" | "accent";
  link: string;
}

export default function LearningResourceCard({
  id,
  title,
  description,
  image,
  category,
  categoryColor = "primary",
  link,
}: LearningResourceCardProps) {
  const categoryColorMap = {
    primary: "bg-primary/20 text-primary",
    secondary: "bg-secondary/20 text-secondary",
    accent: "bg-accent/20 text-accent",
  };

  return (
    <Card className="neumorphic bg-background overflow-hidden transition-all hover:translate-y-[-5px]">
      <div className="w-full h-48 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center mb-3">
          <Badge
            variant="outline"
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full",
              categoryColorMap[categoryColor]
            )}
          >
            {category}
          </Badge>
        </div>
        <h3 className="text-xl font-bold font-poppins mb-3 text-text">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-0">
        <Link
          href={`/learning/${id}`}
          className="text-primary font-medium flex items-center hover:text-primary-dark"
        >
          Read More <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
