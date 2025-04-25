import { db } from "./index";
import * as schema from "@shared/schema";

async function seed() {
  try {
    console.log("Starting database seeding...");

    // Seed Waste Types
    console.log("Seeding waste types...");
    const wasteTypeData = [
      {
        name: "Plastic",
        description: "Various plastic items including bottles, containers, and packaging.",
        isRecyclable: true,
        disposalInstructions: "Clean and place in recycling bin. Check resin identification code (1-7) to verify recyclability.",
        category: "Recycling",
        colorClass: "primary",
      },
      {
        name: "Paper",
        description: "Paper products including cardboard, newspapers, magazines, and office paper.",
        isRecyclable: true,
        disposalInstructions: "Remove any plastic or metal components. Flatten cardboard boxes.",
        category: "Recycling",
        colorClass: "secondary",
      },
      {
        name: "Glass",
        description: "Glass bottles and jars of various colors.",
        isRecyclable: true,
        disposalInstructions: "Rinse containers and remove lids or caps. Sort by color if required.",
        category: "Recycling",
        colorClass: "accent",
      },
      {
        name: "Metal",
        description: "Metal cans, aluminum foil, and other metal items.",
        isRecyclable: true,
        disposalInstructions: "Clean and remove labels if possible. Separate different metal types.",
        category: "Recycling",
        colorClass: "secondary",
      },
      {
        name: "Organic",
        description: "Food scraps, yard waste, and other biodegradable materials.",
        isRecyclable: true,
        disposalInstructions: "Compost in a home system or municipal collection program.",
        category: "Composting",
        colorClass: "primary",
      },
      {
        name: "Electronic",
        description: "Electronic devices, batteries, and components.",
        isRecyclable: true,
        disposalInstructions: "Take to designated e-waste collection centers or retailer take-back programs.",
        category: "E-Waste",
        colorClass: "secondary",
      },
      {
        name: "Hazardous",
        description: "Chemicals, paints, solvents, and other potentially dangerous materials.",
        isRecyclable: false,
        disposalInstructions: "Take to hazardous waste facilities. Never dispose in regular trash.",
        category: "Hazardous",
        colorClass: "accent",
      },
      {
        name: "Yard Waste",
        description: "Leaves, branches, grass clippings, and other garden waste.",
        isRecyclable: true,
        disposalInstructions: "Compost or use municipal yard waste collection services.",
        category: "Composting",
        colorClass: "accent",
      },
      {
        name: "Batteries",
        description: "Household batteries including alkaline, lithium, and rechargeable types.",
        isRecyclable: true,
        disposalInstructions: "Take to battery recycling collection points. Do not dispose in regular trash.",
        category: "E-Waste",
        colorClass: "accent",
      },
    ];

    for (const wasteType of wasteTypeData) {
      // Check if waste type already exists
      const existingWasteType = await db.query.wasteTypes.findFirst({
        where: (types, { eq }) => eq(types.name, wasteType.name),
      });

      if (!existingWasteType) {
        await db.insert(schema.wasteTypes).values(wasteType);
      }
    }

    // Seed Learning Resources
    console.log("Seeding learning resources...");
    const learningResourceData = [
      {
        title: "Plastic Recycling Guide",
        description: "Learn about different types of plastic and how to properly recycle each type based on the resin identification code.",
        content: "Detailed content about plastic recycling...",
        image: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
        category: "Guide",
        categoryColor: "primary",
        createdAt: new Date().toISOString(),
      },
      {
        title: "Composting 101",
        description: "Discover how to start your own composting system at home and turn kitchen scraps into valuable soil amendments.",
        content: "Detailed content about composting...",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
        category: "Tutorial",
        categoryColor: "accent",
        createdAt: new Date().toISOString(),
      },
      {
        title: "E-Waste Management",
        description: "Learn the proper disposal methods for electronic waste and why it's critical to keep these items out of landfills.",
        content: "Detailed content about e-waste management...",
        image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
        category: "Info",
        categoryColor: "secondary",
        createdAt: new Date().toISOString(),
      },
      {
        title: "Reducing Single-Use Plastics",
        description: "Practical tips for reducing your reliance on single-use plastics in everyday life.",
        content: "Detailed content about reducing plastic usage...",
        image: "https://images.unsplash.com/photo-1605600659873-d808a13e4aba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
        category: "Tips",
        categoryColor: "primary",
        createdAt: new Date().toISOString(),
      },
      {
        title: "Understanding Waste Symbols",
        description: "A guide to common recycling and waste disposal symbols found on packaging.",
        content: "Detailed content about waste symbols...",
        image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
        category: "Guide",
        categoryColor: "secondary",
        createdAt: new Date().toISOString(),
      },
      {
        title: "Hazardous Waste Safety",
        description: "How to identify, handle, and properly dispose of hazardous household waste.",
        content: "Detailed content about hazardous waste safety...",
        image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
        category: "Safety",
        categoryColor: "accent",
        createdAt: new Date().toISOString(),
      },
    ];

    for (const resource of learningResourceData) {
      // Check if resource already exists
      const existingResource = await db.query.learningResources.findFirst({
        where: (resources, { eq }) => eq(resources.title, resource.title),
      });

      if (!existingResource) {
        await db.insert(schema.learningResources).values(resource);
      }
    }

    // Seed Recycling Centers
    console.log("Seeding recycling centers...");
    const recyclingCenterData = [
      {
        name: "EcoCycle Recycling Center",
        address: "123 Green Street, Eco City",
        latitude: 37.7749,
        longitude: -122.4194,
        phone: "(555) 123-4567",
        website: "https://www.ecocycle.com",
        hoursOfOperation: "Monday-Friday: 8am-6pm, Saturday: 9am-4pm",
      },
      {
        name: "GreenTech Composting",
        address: "456 Earth Avenue, Eco City",
        latitude: 37.7850,
        longitude: -122.4300,
        phone: "(555) 234-5678",
        website: "https://www.greentech.com",
        hoursOfOperation: "Monday-Friday: 7am-5pm, Saturday: 8am-2pm",
      },
      {
        name: "TechRecycle Solutions",
        address: "789 Circuit Drive, Eco City",
        latitude: 37.7695,
        longitude: -122.4100,
        phone: "(555) 345-6789",
        website: "https://www.techrecycle.com",
        hoursOfOperation: "Monday-Saturday: 9am-6pm",
      },
      {
        name: "Metro Hazardous Waste Facility",
        address: "101 Safety Boulevard, Eco City",
        latitude: 37.7600,
        longitude: -122.4250,
        phone: "(555) 456-7890",
        website: "https://www.metrohazardous.com",
        hoursOfOperation: "Tuesday-Saturday: 10am-5pm",
      },
      {
        name: "Community Recycling Hub",
        address: "202 Neighborhood Lane, Eco City",
        latitude: 37.7900,
        longitude: -122.4000,
        phone: "(555) 567-8901",
        website: "https://www.communityrecycling.org",
        hoursOfOperation: "Monday-Sunday: 8am-8pm",
      },
    ];

    for (const center of recyclingCenterData) {
      // Check if center already exists
      const existingCenter = await db.query.recyclingCenters.findFirst({
        where: (centers, { eq }) => eq(centers.name, center.name),
      });

      if (!existingCenter) {
        await db.insert(schema.recyclingCenters).values(center);
      }
    }

    // Get all waste types and recycling centers
    const allWasteTypes = await db.query.wasteTypes.findMany();
    const allRecyclingCenters = await db.query.recyclingCenters.findMany();

    // Create relationships between recycling centers and waste types
    console.log("Creating relationships between recycling centers and waste types...");
    
    // Define which waste types each center accepts
    const centerWasteTypes = [
      { centerName: "EcoCycle Recycling Center", wasteTypeNames: ["Plastic", "Paper", "Glass"] },
      { centerName: "GreenTech Composting", wasteTypeNames: ["Organic", "Yard Waste"] },
      { centerName: "TechRecycle Solutions", wasteTypeNames: ["Electronic", "Batteries"] },
      { centerName: "Metro Hazardous Waste Facility", wasteTypeNames: ["Hazardous", "Electronic", "Batteries"] },
      { centerName: "Community Recycling Hub", wasteTypeNames: ["Plastic", "Paper", "Glass", "Metal"] },
    ];

    for (const relationship of centerWasteTypes) {
      const center = allRecyclingCenters.find(c => c.name === relationship.centerName);
      
      if (center) {
        for (const wasteTypeName of relationship.wasteTypeNames) {
          const wasteType = allWasteTypes.find(wt => wt.name === wasteTypeName);
          
          if (wasteType) {
            // Check if relationship already exists
            const existingRelationship = await db.query.recyclingCenterWasteTypes.findFirst({
              where: (rct, { eq, and }) => and(
                eq(rct.recyclingCenterId, center.id),
                eq(rct.wasteTypeId, wasteType.id)
              ),
            });

            if (!existingRelationship) {
              await db.insert(schema.recyclingCenterWasteTypes).values({
                recyclingCenterId: center.id,
                wasteTypeId: wasteType.id,
              });
            }
          }
        }
      }
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
