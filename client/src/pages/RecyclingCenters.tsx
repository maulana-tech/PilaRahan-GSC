import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import RecyclingCenterMap from "@/components/RecyclingCenterMap";
import RecyclingCenterCard from "@/components/RecyclingCenterCard";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecyclingCenters() {
  const [facilityType, setFacilityType] = useState("all");

  const { data: recyclingCenters, isLoading } = useQuery({
    queryKey: ['/api/recycling-centers', facilityType],
  });

  return (
    <section className="pt-32 py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4 text-text">
            Recycling Centers Near You
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find facilities that can properly process your waste items and contribute to a circular economy.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Map Container */}
          <div className="lg:w-2/3">
            <RecyclingCenterMap />
          </div>

          {/* Facilities List */}
          <div className="lg:w-1/3">
            <Card className="neumorphic p-4 bg-background h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold font-poppins text-text">Nearby Facilities</h3>
                <div className="relative">
                  <Select
                    defaultValue="all"
                    onValueChange={(value) => setFacilityType(value)}
                  >
                    <SelectTrigger className="w-[180px] bg-white rounded-full">
                      <SelectValue placeholder="All Facilities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Facilities</SelectItem>
                      <SelectItem value="recycling">Recycling Centers</SelectItem>
                      <SelectItem value="composting">Composting Facilities</SelectItem>
                      <SelectItem value="ewaste">E-Waste Collection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[352px]">
                {isLoading ? (
                  // Loading skeletons
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="p-4 bg-white rounded-lg mb-3">
                      <div className="flex justify-between mb-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-3 w-full mb-3" />
                      <div className="flex gap-1">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                    </div>
                  ))
                ) : (
                  (recyclingCenters as any[])?.map((center: any) => (
                    <RecyclingCenterCard
                      key={center.id}
                      name={center.name}
                      address={center.address}
                      distance={center.distance}
                      wasteTypes={center.wasteTypes}
                      onClick={() => {
                        // This would zoom to the center on the map in a real implementation
                        console.log(`Clicked on center: ${center.name}`);
                      }}
                    />
                  )) || (
                    <>
                      <RecyclingCenterCard
                        name="EcoCycle Recycling Center"
                        address="123 Green Street, Eco City"
                        distance={1.2}
                        wasteTypes={[
                          { name: "Plastics", color: "primary" },
                          { name: "Paper", color: "secondary" },
                          { name: "Glass", color: "accent" },
                        ]}
                      />
                      <RecyclingCenterCard
                        name="GreenTech Composting"
                        address="456 Earth Avenue, Eco City"
                        distance={2.5}
                        wasteTypes={[
                          { name: "Organic", color: "primary" },
                          { name: "Yard Waste", color: "accent" },
                        ]}
                      />
                      <RecyclingCenterCard
                        name="TechRecycle Solutions"
                        address="789 Circuit Drive, Eco City"
                        distance={3.8}
                        wasteTypes={[
                          { name: "E-Waste", color: "secondary" },
                          { name: "Batteries", color: "accent" },
                        ]}
                      />
                    </>
                  )
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
