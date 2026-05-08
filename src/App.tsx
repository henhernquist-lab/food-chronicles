import { useEffect } from "react";
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
import { SpringCursor } from "./components/SpringCursor.tsx";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const handleRipple = (e: MouseEvent) => {
      const button = e.currentTarget as HTMLElement;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';

      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 400);
    };

    document.querySelectorAll('.interactive').forEach(el => {
      el.addEventListener('click', handleRipple);
    });

    return () => {
      document.querySelectorAll('.interactive').forEach(el => {
        el.removeEventListener('click', handleRipple);
      });
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="reading-progress top-progress" />
        <Toaster />
        <Sonner />
        <SpringCursor />
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
