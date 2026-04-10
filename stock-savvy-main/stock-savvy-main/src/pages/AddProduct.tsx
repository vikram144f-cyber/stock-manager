import { useState } from "react";
import { useInventory } from "@/context/InventoryContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface FormErrors {
  id?: string;
  name?: string;
  price?: string;
  quantity?: string;
}

export default function AddProduct() {
  const { products, dispatch, logActivity } = useInventory();
  const [form, setForm] = useState({ id: "", name: "", price: "", quantity: "" });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.id.trim()) errs.id = "Product ID is required";
    else if (products.some((p) => p.id === form.id.trim())) errs.id = "Product ID already exists";
    if (!form.name.trim()) errs.name = "Product name is required";
    if (!form.price.trim()) errs.price = "Price is required";
    else if (isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0) errs.price = "Price must be a positive number";
    if (!form.quantity.trim()) errs.quantity = "Quantity is required";
    else if (isNaN(parseInt(form.quantity)) || parseInt(form.quantity) < 0 || !Number.isInteger(Number(form.quantity))) errs.quantity = "Quantity must be a non-negative integer";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    dispatch({
      type: "ADD_PRODUCT",
      payload: {
        id: form.id.trim(),
        name: form.name.trim(),
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
      },
    });
    logActivity(`Added new product: ${form.name.trim()}`);
    toast.success("Product added successfully!");
    setForm({ id: "", name: "", price: "", quantity: "" });
    setErrors({});
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>
      <Card>
        <CardHeader><CardTitle>New Product</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="id">Product ID</Label>
              <Input
                id="id"
                placeholder="PRD-009"
                value={form.id}
                onChange={(e) => { setForm({ ...form, id: e.target.value }); if (errors.id) setErrors({ ...errors, id: undefined }); }}
                className={errors.id ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.id && <p className="text-sm text-red-500">{errors.id}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Product name"
                value={form.name}
                onChange={(e) => { setForm({ ...form, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: undefined }); }}
                className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.price}
                onChange={(e) => { setForm({ ...form, price: e.target.value }); if (errors.price) setErrors({ ...errors, price: undefined }); }}
                className={errors.price ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="qty">Quantity</Label>
              <Input
                id="qty"
                type="number"
                min="0"
                placeholder="0"
                value={form.quantity}
                onChange={(e) => { setForm({ ...form, quantity: e.target.value }); if (errors.quantity) setErrors({ ...errors, quantity: undefined }); }}
                className={errors.quantity ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
            </div>
            <Button type="submit" className="w-full">Add Product</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
