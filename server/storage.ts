import { db } from "@db";
import { 
  learningResources, 
  wasteTypes, 
  recyclingCenters, 
  recyclingCenterWasteTypes 
} from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { calculateDistance } from "../client/src/lib/utils";

export const storage = {
  // Learning Resources
  async getAllLearningResources() {
    return await db.query.learningResources.findMany({
      orderBy: (resources) => resources.id,
    });
  },

  async getLearningResourceById(id: number) {
    return await db.query.learningResources.findFirst({
      where: eq(learningResources.id, id),
    });
  },

  // Waste Types
  async getAllWasteTypes() {
    return await db.query.wasteTypes.findMany({
      orderBy: (types) => types.name,
    });
  },

  async getWasteTypeByName(name: string) {
    return await db.query.wasteTypes.findFirst({
      where: eq(wasteTypes.name, name),
    });
  },

  // Recycling Centers
  async getNearbyRecyclingCenters(latitude: number, longitude: number, type?: string) {
    const allCenters = await db.query.recyclingCenters.findMany({
      with: {
        wasteTypes: {
          with: {
            wasteType: true,
          },
        },
      },
    });

    // Filter by waste type if provided
    const filteredCenters = type && type !== 'all'
      ? allCenters.filter(center => 
          center.wasteTypes.some(wt => 
            wt.wasteType.category.toLowerCase() === type.toLowerCase()
          )
        )
      : allCenters;

    // Calculate distance for each center and add formatted waste types
    return filteredCenters.map(center => {
      const distance = calculateDistance(
        latitude,
        longitude,
        center.latitude,
        center.longitude
      );

      return {
        id: center.id,
        name: center.name,
        address: center.address,
        latitude: center.latitude,
        longitude: center.longitude,
        distance,
        wasteTypes: center.wasteTypes.map(wt => ({
          name: wt.wasteType.name,
          color: wt.wasteType.colorClass,
        })),
      };
    }).sort((a, b) => a.distance - b.distance);
  },

  async getRecyclingCenterById(id: number) {
    return await db.query.recyclingCenters.findFirst({
      where: eq(recyclingCenters.id, id),
      with: {
        wasteTypes: {
          with: {
            wasteType: true,
          },
        },
      },
    });
  },
};
