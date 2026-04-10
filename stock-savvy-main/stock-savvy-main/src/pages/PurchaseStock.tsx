import { useState } from "react";
import { useInventory } from "@/context/InventoryContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function PurchaseStock() {
  const { products, dispatch, logActivity } = useInventory();
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState("");
  const [errors, setErrors] = useState<{ product?: string; qty?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { product?: string; qty?: string } = {};
    if (!productId) errs.product = "Please select a product";
    if (!qty || parseInt(qty) <= 0 || !Number.isInteger(Number(qty))) errs.qty = "Enter a valid positive integer";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const product = products.find((p) => p.id === productId);
    const amount = parseInt(qty);
    dispatch({ type: "PURCHASE_STOCK", payload: { id: productId, qty: amount } });
    logActivity(`Added ${amount}x ${product?.name}`);
    toast.success(`Stock updated for ${product?.name}`);
    setProductId("");
    setQty("");
    setErrors({});
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Purchase Stock</h1>
      <Card>
        <CardHeader><CardTitle>Add Stock</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label>Product</Label>
              <Select value={productId} onValueChange={(v) => { setProductId(v); if (errors.product) setErrors({ ...errors, product: undefined }); }}>
                <SelectTrigger className={errors.product ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name} ({p.id})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.product && <p className="text-sm text-red-500">{errors.product}</p>}
            </div>
            <div className="grid gap-2">
              <Label>Quantity to Add</Label>
              <Input
                type="number"
                min="1"
                placeholder="0"
                value={qty}
                onChange={(e) => { setQty(e.target.value); if (errors.qty) setErrors({ ...errors, qty: undefined }); }}
                className={errors.qty ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.qty && <p className="text-sm text-red-500">{errors.qty}</p>}
            </div>
            <Button type="submit" className="w-full">Purchase Stock</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
