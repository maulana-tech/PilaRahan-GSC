import { useQuery } from "@tanstack/react-query";
import LearningResourceCard from "@/components/LearningResourceCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductItem } from "@/components/ui/navigation-menu";

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
            {(resources as any[])?.map((resource: any) => (
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

        {/* Produk Section */}
        <div className="mt-20 pt-16 border-t border-gray-100">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold font-poppins mb-4 text-text">Recommended Products</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              These products can help you implement what you've learned and make sustainable waste management easier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <ProductItem
              title="Tempat Sampah Pintar"
              href="/produk/tempat-sampah"
              src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
              description="Tempat sampah dengan teknologi pemilahan otomatis."
            />
            <ProductItem
              title="Komposter Rumahan"
              href="/produk/komposter"
              src="https://images.unsplash.com/photo-1582560475093-ba66accbc095?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
              description="Solusi pengomposan praktis untuk rumah tangga."
            />
            <ProductItem
              title="Aplikasi WasteWise"
              href="/produk/aplikasi"
              src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
              description="Pantau dan kelola sampah Anda dengan aplikasi kami."
            />
            <ProductItem
              title="Kerajinan Daur Ulang"
              href="/produk/kerajinan"
              src="https://images.unsplash.com/photo-1604187351574-c75ca79f5807?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
              description="Produk kerajinan berkualitas dari bahan daur ulang."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
