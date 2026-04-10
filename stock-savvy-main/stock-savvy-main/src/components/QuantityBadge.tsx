import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function QuantityBadge({ quantity }: { quantity: number }) {
  const config =
    quantity > 10
      ? { color: "bg-emerald-100 text-emerald-800 border-emerald-200", label: "Good" }
      : quantity >= 5
        ? { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Low" }
        : { color: "bg-red-100 text-red-800 border-red-200", label: "Critical" };

  return (
    <Badge variant="outline" className={cn(config.color, "font-semibold")}>
      {quantity} — {config.label}
    </Badge>
  );
}
