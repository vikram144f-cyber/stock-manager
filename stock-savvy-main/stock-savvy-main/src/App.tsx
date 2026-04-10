import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { InventoryProvider } from "@/context/InventoryContext";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import PurchaseStock from "./pages/PurchaseStock";
import SellStock from "./pages/SellStock";
import LowStockReport from "./pages/LowStockReport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <InventoryProvider>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/purchase" element={<PurchaseStock />} />
                <Route path="/sell" element={<SellStock />} />
                <Route path="/low-stock" element={<LowStockReport />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </InventoryProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
