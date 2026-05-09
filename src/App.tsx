import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import HomePage from "./pages/HomePage.tsx";
import ArticlePage from "./pages/ArticlePage.tsx";
import SuggestPage from "./pages/SuggestPage.tsx";
import AdminSubmissions from "./pages/AdminSubmissions.tsx";
import { FoodSommelier } from "./components/FoodSommelier.tsx";
import CustomCursor from "./components/CustomCursor.tsx";
import ParticleField from "./components/ParticleField.tsx";
import PageIntro from "./components/PageIntro.tsx";

const queryClient = new QueryClient();

const App = () => {
  // Show the intro splash only once per browser session
  const [introSeen, setIntroSeen] = useState(() => {
    const seen = sessionStorage.getItem("tfc-intro-seen");
    return !!seen;
  });

  const handleIntroComplete = () => {
    sessionStorage.setItem("tfc-intro-seen", "1");
    setIntroSeen(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        {/* ── Visual-only global overlays (no routing / logic impact) ── */}
        <CustomCursor />
        <ParticleField />
        {!introSeen && <PageIntro onComplete={handleIntroComplete} />}

        <BrowserRouter>
          <FoodSommelier />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/article/:slug" element={<ArticlePage />} />
            <Route path="/suggest" element={<SuggestPage />} />
            <Route path="/admin/submissions" element={<AdminSubmissions />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
