import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingCart,
  TrendingDown,
  AlertTriangle,
  Store,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Products", url: "/products", icon: Package },
  { title: "Add Product", url: "/add-product", icon: PlusCircle },
  { title: "Purchase Stock", url: "/purchase", icon: ShoppingCart },
  { title: "Sell Stock", url: "/sell", icon: TrendingDown },
  { title: "Low Stock Report", url: "/low-stock", icon: AlertTriangle },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Store className="h-5 w-5 text-blue-600 shrink-0" />
          {!collapsed && <span className="font-bold text-sm">Stock Controller</span>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="transition-all rounded-md border-l-2 border-transparent hover:border-l-blue-500 hover:bg-accent hover:text-accent-foreground"
                      activeClassName="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-medium border-l-2 !border-blue-600"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
