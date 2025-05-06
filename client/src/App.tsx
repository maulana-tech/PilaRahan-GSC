import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import Scan from "@/pages/Scan";
import LearningCenter from "@/pages/LearningCenter";
import RecyclingCenters from "@/pages/RecyclingCenters";
import About from "@/pages/About";
import AiChat from "@/pages/AiChat";
import Footer from "@/components/Footer";
import NotFound from "@/pages/not-found";
import { NavbarWrapper } from "./components/Navbar";
import Education from "./pages/Education";

function Router() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <NavbarWrapper />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/scan" component={Scan} />
          <Route path="/learning" component={LearningCenter} />
          <Route path="/recycling-centers" component={RecyclingCenters} />
          <Route path="/about" component={About} />
          <Route path="/ai-chat" component={AiChat} />
          <Route path="/education" component={Education} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
