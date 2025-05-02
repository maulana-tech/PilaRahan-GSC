import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RecyclingCenterCardProps {
  name: string;
  address: string;
  distance: number;
  wasteTypes: Array<{
    name: string;
    color: "primary" | "secondary" | "accent";
  }>;
  onClick?: () => void;
}

export default function RecyclingCenterCard({
  name,
  address,
  distance,
  wasteTypes,
  onClick,
}: RecyclingCenterCardProps) {
  const colorMap = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
  };

  return (
    <div 
      className="p-4 bg-white rounded-lg mb-3 hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between">
        <h4 className="font-bold text-text">{name}</h4>
        <span className="text-sm text-gray-500">{distance.toFixed(1)} km</span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{address}</p>
      <div className="flex items-center text-sm flex-wrap gap-1">
        {wasteTypes.map((type, index) => (
          <Badge
            key={index}
            variant="outline"
            className={cn("px-2 py-1 text-xs rounded-full", colorMap[type.color])}
          >
            {type.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
