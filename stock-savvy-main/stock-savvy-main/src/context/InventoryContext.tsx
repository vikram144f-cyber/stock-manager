import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getWasmInventory, extractAllProducts, hydrateFromProducts } from "../wasm/wasmLoader";
import type { WasmInventory } from "../wasm/inventory.d";

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export type InventoryAction =
  | { type: "ADD_PRODUCT"; payload: { id: string; name: string; price: number; quantity: number } }
  | { type: "PURCHASE_STOCK"; payload: { id: string; quantity: number } }
  | { type: "SELL_STOCK"; payload: { id: string; quantity: number } }
  | { type: "DELETE_PRODUCT"; payload: string }
  | { type: "UPDATE_PRODUCT"; payload: Product }
  | { type: "SET_PRODUCTS"; payload: Product[] };

export interface InventoryContextType {
  products: Product[];
  dispatch: React.Dispatch<InventoryAction>;
  activityLog: string[];
  logActivity: (message: string) => void;
  clearActivity: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// Define the TS fallback reducer logic
function pureTsReducer(products: Product[], action: InventoryAction): Product[] {
  switch (action.type) {
    case "ADD_PRODUCT":
      if (products.some(p => p.id === action.payload.id)) return products;
      return [...products, action.payload];
    case "PURCHASE_STOCK":
      return products.map(p =>
        p.id === action.payload.id ? { ...p, quantity: p.quantity + action.payload.quantity } : p
      );
    case "SELL_STOCK":
      return products.map(p =>
        p.id === action.payload.id ? { ...p, quantity: Math.max(0, p.quantity - action.payload.quantity) } : p
      );
    case "DELETE_PRODUCT":
      return products.filter(p => p.id !== action.payload);
    case "UPDATE_PRODUCT":
      return products.map(p => (p.id === action.payload.id ? action.payload : p));
    case "SET_PRODUCTS":
      return action.payload;
    default:
      return products;
  }
}

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [wasmEngine, setWasmEngine] = useState<WasmInventory | null>(null);
  
  const [activityLog, setActivityLog] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const logActivity = (message: string) => {
    const timestamp = new Date().toISOString();
    setActivityLog(prev => {
      const newLog = [`${timestamp}|${message}`, ...prev];
      localStorage.setItem("activityLog", JSON.stringify(newLog));
      return newLog;
    });
  };

  const clearActivity = () => {
    setActivityLog([]);
    localStorage.removeItem("activityLog");
  };

  // Hydrate on mount
  useEffect(() => {
    const defaultProducts: Product[] = [
      { id: "P1001", name: "Wireless Earbuds", price: 99.99, quantity: 45 },
      { id: "P1002", name: "Mechanical Keyboard", price: 129.50, quantity: 20 },
      { id: "P1003", name: "Gaming Mouse", price: 59.99, quantity: 85 },
      { id: "P1004", name: "4K USB-C Monitor", price: 349.00, quantity: 12 },
      { id: "P1005", name: "Laptop Stand", price: 24.99, quantity: 150 }
    ];
    const savedProducts = localStorage.getItem("inventory");
    const initialProducts: Product[] = savedProducts ? JSON.parse(savedProducts) : defaultProducts;
    
    const savedLog = localStorage.getItem("activityLog");
    if (savedLog) setActivityLog(JSON.parse(savedLog));

    // Start Wasm init
    getWasmInventory()
      .then((inv) => {
        hydrateFromProducts(inv, initialProducts);
        setProducts(initialProducts);
        setWasmEngine(inv);
        console.log(`[WASM] ✅ Inventory engine loaded — ${initialProducts.length} products hydrated`);
      })
      .catch((err) => {
        console.error("Failed to load Wasm engine, falling back to TypeScript:", err);
        setProducts(initialProducts);
      });
  }, []);

  const dispatch = (action: InventoryAction) => {
    setProducts((prevProducts) => {
      let nextProducts: Product[];

      if (wasmEngine && action.type !== "SET_PRODUCTS") {
        // Route through WebAssembly
        let success = true;

        if (action.type === "ADD_PRODUCT") {
          success = wasmEngine.addProduct(action.payload.id, action.payload.name, action.payload.price, action.payload.quantity);
        } else if (action.type === "DELETE_PRODUCT") {
          success = wasmEngine.deleteProduct(action.payload);
        } else if (action.type === "PURCHASE_STOCK") {
          wasmEngine.purchaseStock(action.payload.id, action.payload.quantity);
        } else if (action.type === "SELL_STOCK") {
          const res = wasmEngine.sellStock(action.payload.id, action.payload.quantity);
          if (res === -2) success = false;
        } else if (action.type === "UPDATE_PRODUCT") {
          success = wasmEngine.updateProduct(action.payload.id, action.payload.name, action.payload.price, action.payload.quantity);
        }

        if (success) {
          nextProducts = extractAllProducts(wasmEngine);
        } else {
          nextProducts = prevProducts;
        }
      } else {
        // Fallback to TS
        nextProducts = pureTsReducer(prevProducts, action);
      }

      // Persist changes
      localStorage.setItem("inventory", JSON.stringify(nextProducts));
      return nextProducts;
    });
  };

  return (
    <InventoryContext.Provider 
      value={{ 
        products, 
        dispatch,
        activityLog,
        logActivity,
        clearActivity,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
