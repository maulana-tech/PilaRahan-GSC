import { Camera, Bot, MapPin } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBgColor: string;
}

function FeatureCard({ icon, title, description, iconBgColor }: FeatureCardProps) {
  return (
    <div className="p-6 neumorphic bg-background transition-all hover:translate-y-[-5px]">
      <div className={`w-16 h-16 ${iconBgColor} rounded-full flex items-center justify-center text-white mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold font-poppins mb-3 text-text">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default function FeaturesSection() {
  const features = [
    {
      icon: <Camera className="h-6 w-6" />,
      title: "Image Recognition",
      description: "Upload a photo or use your camera to instantly identify and classify waste items.",
      iconBgColor: "bg-primary",
    },
    {
      icon: <Bot className="h-6 w-6" />,
      title: "AI Analysis",
      description:
        "Our advanced AI provides 100% accurate waste classification and customized recommendations.",
      iconBgColor: "bg-secondary",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Recycling Centers",
      description: "Find nearby recycling facilities to properly dispose of your waste items.",
      iconBgColor: "bg-accent",
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4 text-text">
            How PilaRahan Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform makes waste management simple with powerful features designed to help you make a
            difference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              iconBgColor={feature.iconBgColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
