import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// We'll use Leaflet for the map functionality
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface Location {
  lat: number;
  lng: number;
}

export default function RecyclingCenterMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const { toast } = useToast();

  // Fetch recycling centers when we have the user's location
  const { data: recyclingCenters, isLoading: isLoadingCenters } = useQuery({
    queryKey: ["/api/recycling-centers", userLocation?.lat, userLocation?.lng],
    enabled: !!userLocation,
  });

  useEffect(() => {
    // Initialize map if mapRef is available and map isn't already initialized
    if (mapRef.current && !map) {
      // Fix for Leaflet marker icon issues in bundled environments
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      });

      // Create map instance
      const newMap = L.map(mapRef.current).setView([0, 0], 2);

      // Add tile layer (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(newMap);

      setMap(newMap);
    }
  }, [mapRef, map]);

  // Update map when user location changes
  useEffect(() => {
    if (map && userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 13);

      // Add marker for user location
      const userMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: new L.Icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      }).addTo(map);

      userMarker.bindPopup("Your Location").openPopup();

      // Add markers for recycling centers when data is available
      if (recyclingCenters && recyclingCenters.length > 0) {
        recyclingCenters.forEach((center: any) => {
          if (center.latitude && center.longitude) {
            const marker = L.marker([center.latitude, center.longitude], {
              icon: new L.Icon({
                iconUrl:
                  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
                shadowUrl:
                  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
              }),
            }).addTo(map);

            marker.bindPopup(`
              <strong>${center.name}</strong><br>
              ${center.address}<br>
              <em>${center.distance.toFixed(1)} miles away</em>
            `);
          }
        });
      }
    }
  }, [map, userLocation, recyclingCenters]);

  const getUserLocation = () => {
    setIsLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsLoadingLocation(false);

        toast({
          title: "Location access failed",
          description:
            "Please make sure you have granted location permissions.",
          variant: "destructive",
        });
      }
    );
  };

  return (
    <Card className="neumorphic p-4 bg-background">
      <div
        ref={mapRef}
        className="bg-gray-200 rounded-lg w-full h-[400px] overflow-hidden"
      >
        {!userLocation && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-10 w-10 text-gray-400 mb-4 mx-auto" />
              <p className="text-gray-500 mb-4">
                Map loading... Please allow location access to see recycling
                centers near you.
              </p>
              <Button
                variant="secondary"
                className="rounded-full"
                onClick={getUserLocation}
                disabled={isLoadingLocation}
              >
                {isLoadingLocation ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 h-4 w-4" />
                    Allow Location Access
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
