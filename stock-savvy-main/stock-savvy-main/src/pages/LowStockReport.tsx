import { useInventory } from "@/context/InventoryContext";
import { QuantityBadge } from "@/components/QuantityBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2 } from "lucide-react";

export default function LowStockReport() {
  const { products } = useInventory();
  const lowStock = products.filter((p) => p.quantity <= 5);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Low Stock Report</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Showing products with quantity ≤ 5
      </p>

      {lowStock.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
          <h2 className="text-xl font-semibold text-emerald-700 mb-2">All products are well stocked! ✅</h2>
          <p className="text-muted-foreground">No products are below the low stock threshold.</p>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStock.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-sm">{p.id}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>₹{p.price.toFixed(2)}</TableCell>
                    <TableCell><QuantityBadge quantity={p.quantity} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{lowStock.length} product(s) with low stock</p>
        </>
      )}
    </div>
  );
}
