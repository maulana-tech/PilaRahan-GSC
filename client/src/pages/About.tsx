import { Card } from "@/components/ui/card";

export default function About() {
  return (
    <section className="pt-32 py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4 text-text">About WasteWise</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our mission is to simplify waste management and promote sustainable practices through
            innovative technology.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
              alt="Team working on environmental solutions"
              className="rounded-lg neumorphic"
            />
          </div>

          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold font-poppins mb-6 text-text">Our Story</h3>
            <p className="text-gray-600 mb-6">
              WasteWise was founded by a team of environmental scientists and technology experts who
              recognized the need for better waste management solutions. Our platform combines
              cutting-edge AI technology with environmental science to help individuals and communities
              reduce waste and increase recycling rates.
            </p>
            <p className="text-gray-600 mb-6">
              We believe that small actions can lead to significant change. By making it easier for
              people to properly classify and dispose of waste, we aim to reduce landfill usage,
              conserve resources, and protect our planet for future generations.
            </p>

            <div className="grid grid-cols-2 gap-6 mt-8">
              <Card className="text-center">
                <div className="p-4">
                  <div className="text-4xl font-bold text-primary mb-2">10M+</div>
                  <p className="text-gray-600">Items Classified</p>
                </div>
              </Card>
              <Card className="text-center">
                <div className="p-4">
                  <div className="text-4xl font-bold text-secondary mb-2">5K+</div>
                  <p className="text-gray-600">Recycling Centers</p>
                </div>
              </Card>
              <Card className="text-center">
                <div className="p-4">
                  <div className="text-4xl font-bold text-accent mb-2">2M+</div>
                  <p className="text-gray-600">Active Users</p>
                </div>
              </Card>
              <Card className="text-center">
                <div className="p-4">
                  <div className="text-4xl font-bold text-primary mb-2">50+</div>
                  <p className="text-gray-600">Countries Served</p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold font-poppins mb-4 text-text">Our Mission</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're committed to creating a sustainable future through technology-enabled waste management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 neumorphic">
              <h4 className="text-xl font-bold font-poppins mb-3 text-primary">Educate</h4>
              <p className="text-gray-600">
                Provide accessible information about waste management to help people make informed decisions.
              </p>
            </Card>
            <Card className="p-6 neumorphic">
              <h4 className="text-xl font-bold font-poppins mb-3 text-secondary">Innovate</h4>
              <p className="text-gray-600">
                Develop cutting-edge AI solutions to make waste classification accurate and effortless.
              </p>
            </Card>
            <Card className="p-6 neumorphic">
              <h4 className="text-xl font-bold font-poppins mb-3 text-accent">Connect</h4>
              <p className="text-gray-600">
                Bridge the gap between consumers and recycling facilities to promote proper waste disposal.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
