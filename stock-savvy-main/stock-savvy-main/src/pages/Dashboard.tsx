import { useInventory } from "@/context/InventoryContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, IndianRupee, AlertTriangle, Clock, Trash2, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Button } from "@/components/ui/button";

const LOW_THRESHOLD = 5;

function getBarColor(qty: number): string {
  if (qty > 10) return "hsl(142, 71%, 45%)";   // green — Good
  if (qty >= 5) return "hsl(38, 92%, 50%)";     // amber — Low
  return "hsl(0, 84%, 60%)";                     // red — Critical
}

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default function Dashboard() {
  const { products, activityLog, clearActivity } = useInventory();
  const navigate = useNavigate();

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const lowStockCount = products.filter((p) => p.quantity <= LOW_THRESHOLD).length;

  const topByValue = [...products]
    .map((p) => ({ name: p.name.length > 14 ? p.name.slice(0, 14) + "…" : p.name, value: p.price * p.quantity, quantity: p.quantity }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const recentActivity = activityLog.slice(0, 5);
  const allStocked = lowStockCount === 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {/* Total Products */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
            <Package className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{totalProducts}</div>
          </CardContent>
        </Card>

        {/* Inventory Value */}
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Inventory Value</CardTitle>
            <IndianRupee className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">₹{totalValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts — changes color when all stocked */}
        <Card
          className={`border-l-4 cursor-pointer hover:shadow-md transition-shadow ${
            allStocked ? "border-l-emerald-500" : "border-l-orange-500"
          }`}
          onClick={() => navigate("/low-stock")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {allStocked ? "Stock Status" : "Low Stock Alerts"}
            </CardTitle>
            {allStocked ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            )}
          </CardHeader>
          <CardContent>
            {allStocked ? (
              <>
                <div className="text-2xl font-bold text-emerald-600">All stocked!</div>
                <p className="text-xs text-emerald-500 mt-1">Click to view report →</p>
              </>
            ) : (
              <>
                <div className="text-3xl font-bold text-orange-600">{lowStockCount}</div>
                <p className="text-xs text-orange-500 mt-1">Click to view report →</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chart + Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Bar Chart — colors based on stock status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top 5 Products by Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topByValue} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
                  <XAxis type="number" tickFormatter={(v) => `₹${v}`} fontSize={12} />
                  <YAxis type="category" dataKey="name" width={110} fontSize={12} />
                  <Tooltip formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Value"]} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {topByValue.map((entry, i) => (
                      <Cell key={i} fill={getBarColor(entry.quantity)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity — scrollable + empty state */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Recent Activity
            </CardTitle>
            {activityLog.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearActivity} className="h-8 text-xs text-muted-foreground hover:text-red-500">
                <Trash2 className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex-1">
            {recentActivity.length < 3 && recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[120px] gap-3 text-muted-foreground">
                <Clock className="h-10 w-10 opacity-30" />
                <p className="text-sm">No recent activity yet</p>
              </div>
            ) : (
              <div className="max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                <ul className="space-y-3">
                  {recentActivity.map((a, i) => {
                    const parts = typeof a === 'string' ? a.split('|') : [];
                    const timestamp = parts.length > 1 ? parts[0] : (a as any).timestamp || new Date().toISOString();
                    const message = parts.length > 1 ? parts.slice(1).join('|') : (a as any).message || a;
                    const id = (a as any).id || i;

                    return (
                      <li key={id} className="flex items-start gap-3 text-sm">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                        <div className="flex-1">
                          <p>{message}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimestamp(timestamp)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
