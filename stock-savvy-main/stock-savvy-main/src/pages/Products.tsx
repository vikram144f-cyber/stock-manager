import { useState } from "react";
import { useInventory, Product } from "@/context/InventoryContext";
import { QuantityBadge } from "@/components/QuantityBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Pencil, Trash2, Search } from "lucide-react";

interface EditErrors {
  name?: string;
  price?: string;
  quantity?: string;
}

export default function Products() {
  const { products, dispatch, searchQuery, logActivity } = useInventory();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editErrors, setEditErrors] = useState<EditErrors>({});

  const filtered = products.filter(
    (p) =>
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = () => {
    if (deleteId) {
      const product = products.find((p) => p.id === deleteId);
      dispatch({ type: "DELETE_PRODUCT", payload: deleteId });
      logActivity(`Deleted product: ${product?.name}`);
      toast.success("Product deleted successfully");
      setDeleteId(null);
    }
  };

  const validateEdit = (): EditErrors => {
    const errs: EditErrors = {};
    if (!editProduct) return errs;
    if (!editProduct.name.trim()) errs.name = "Name is required";
    if (editProduct.price <= 0 || isNaN(editProduct.price)) errs.price = "Price must be a positive number";
    if (editProduct.quantity < 0 || isNaN(editProduct.quantity)) errs.quantity = "Quantity must be non-negative";
    return errs;
  };

  const handleEdit = () => {
    if (editProduct) {
      const errs = validateEdit();
      setEditErrors(errs);
      if (Object.keys(errs).length > 0) return;
      dispatch({ type: "UPDATE_PRODUCT", payload: { ...editProduct, name: editProduct.name.trim() } });
      logActivity(`Updated product: ${editProduct.name.trim()}`);
      toast.success("Product updated successfully");
      setEditProduct(null);
      setEditErrors({});
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12">
                  <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    <Search className="h-10 w-10 opacity-40" />
                    <p className="text-sm">
                      {searchQuery
                        ? <>No products found for '<span className="font-semibold text-foreground">{searchQuery}</span>'</>
                        : "No products found."
                      }
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow key={p.id} className="transition-colors hover:bg-muted/50">
                  <TableCell className="font-mono text-sm">{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>₹{p.price.toFixed(2)}</TableCell>
                  <TableCell><QuantityBadge quantity={p.quantity} /></TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => { setEditProduct({ ...p }); setEditErrors({}); }}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Total Items Count */}
      {filtered.length > 0 && (
        <p className="text-sm text-muted-foreground mt-3 ml-1">
          Showing {filtered.length} {filtered.length === 1 ? "product" : "products"}
        </p>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>Are you sure? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!editProduct} onOpenChange={() => { setEditProduct(null); setEditErrors({}); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Product</DialogTitle></DialogHeader>
          {editProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input
                  value={editProduct.name}
                  onChange={(e) => { setEditProduct({ ...editProduct, name: e.target.value }); if (editErrors.name) setEditErrors({ ...editErrors, name: undefined }); }}
                  className={editErrors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {editErrors.name && <p className="text-sm text-red-500">{editErrors.name}</p>}
              </div>
              <div className="grid gap-2">
                <Label>Price (₹)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editProduct.price}
                  onChange={(e) => { setEditProduct({ ...editProduct, price: parseFloat(e.target.value) || 0 }); if (editErrors.price) setEditErrors({ ...editErrors, price: undefined }); }}
                  className={editErrors.price ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {editErrors.price && <p className="text-sm text-red-500">{editErrors.price}</p>}
              </div>
              <div className="grid gap-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={editProduct.quantity}
                  onChange={(e) => { setEditProduct({ ...editProduct, quantity: parseInt(e.target.value) || 0 }); if (editErrors.quantity) setEditErrors({ ...editErrors, quantity: undefined }); }}
                  className={editErrors.quantity ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {editErrors.quantity && <p className="text-sm text-red-500">{editErrors.quantity}</p>}
              </div>
            </div>
          )}
          <DialogFooter><Button onClick={handleEdit}>Save Changes</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
