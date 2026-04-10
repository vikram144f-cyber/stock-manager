import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Input } from "@/components/ui/input";
import { Search, Store, Sun, Moon } from "lucide-react";
import { useInventory } from "@/context/InventoryContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

export function AppLayout({ children }: { children: ReactNode }) {
  const { searchQuery, setSearchQuery } = useInventory();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value && location.pathname !== "/products") {
      navigate("/products");
    }
  };

  const isDark = theme === "dark";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center gap-4 border-b px-4">
            <SidebarTrigger />
            <div className="flex items-center gap-2 md:hidden">
              <Store className="h-5 w-5 text-blue-600" />
              <span className="font-bold text-sm">StockCtrl</span>
            </div>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID or name..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div className="ml-auto flex items-center gap-3">
              {/* Dark/Light Mode Toggle */}
              <div className="flex items-center gap-2">
                <Sun className={`h-4 w-4 transition-colors ${isDark ? 'text-muted-foreground' : 'text-amber-500'}`} />
                <Switch
                  checked={isDark}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  aria-label="Toggle dark mode"
                />
                <Moon className={`h-4 w-4 transition-colors ${isDark ? 'text-blue-400' : 'text-muted-foreground'}`} />
              </div>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold dark:bg-blue-900 dark:text-blue-300">SK</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
