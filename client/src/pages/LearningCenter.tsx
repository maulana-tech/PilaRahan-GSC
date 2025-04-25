import { useQuery } from "@tanstack/react-query";
import LearningResourceCard from "@/components/LearningResourceCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function LearningCenter() {
  const { data: resources, isLoading } = useQuery({
    queryKey: ['/api/learning-resources'],
  });

  return (
    <section className="pt-32 py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4 text-text">Learning Center</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our educational resources to learn more about waste types and proper disposal methods.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="neumorphic bg-background overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-6">
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources?.map((resource: any) => (
              <LearningResourceCard
                key={resource.id}
                id={resource.id}
                title={resource.title}
                description={resource.description}
                image={resource.image}
                category={resource.category}
                categoryColor={resource.categoryColor}
                link={`/learning/${resource.id}`}
              />
            )) || (
              <>
                <LearningResourceCard
                  id={1}
                  title="Plastic Recycling Guide"
                  description="Learn about different types of plastic and how to properly recycle each type based on the resin identification code."
                  image="https://images.unsplash.com/photo-1604187351574-c75ca79f5807?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                  category="Guide"
                  categoryColor="primary"
                  link="/learning/1"
                />
                <LearningResourceCard
                  id={2}
                  title="Composting 101"
                  description="Discover how to start your own composting system at home and turn kitchen scraps into valuable soil amendments."
                  image="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                  category="Tutorial"
                  categoryColor="accent"
                  link="/learning/2"
                />
                <LearningResourceCard
                  id={3}
                  title="E-Waste Management"
                  description="Learn the proper disposal methods for electronic waste and why it's critical to keep these items out of landfills."
                  image="https://images.unsplash.com/photo-1530587191325-3db32d826c18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                  category="Info"
                  categoryColor="secondary"
                  link="/learning/3"
                />
              </>
            )}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button className="px-8 py-3 rounded-full neumorphic">
            View All Resources
          </Button>
        </div>
      </div>
    </section>
  );
}
