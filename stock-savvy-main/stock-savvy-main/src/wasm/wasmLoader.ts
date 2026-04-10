/**
 * Wasm Inventory Engine — Singleton loader and typed wrapper.
 *
 * The Emscripten glue code (inventory.js) is loaded via a <script> tag
 * in index.html, exposing `createInventoryModule` as a global function.
 * This module initializes the Wasm engine and provides typed helpers.
 */

import type { InventoryModule, WasmInventory } from "./inventory.d";
import type { Product } from "@/context/InventoryContext";

// ─── Module loading ──────────────────────────────────────────────────────────

let modulePromise: Promise<InventoryModule> | null = null;
let wasmInventory: WasmInventory | null = null;

// Declare the global function injected by the <script> tag in index.html
declare global {
  function createInventoryModule(): Promise<InventoryModule>;
}

async function loadModule(): Promise<InventoryModule> {
  // createInventoryModule is a global set by the <script src="/inventory.js"> in index.html
  if (typeof globalThis.createInventoryModule !== "function") {
    throw new Error("createInventoryModule not found — is inventory.js loaded in index.html?");
  }
  const mod: InventoryModule = await globalThis.createInventoryModule();
  return mod;
}

/**
 * Get the initialized WasmInventory instance (singleton).
 * First call loads the module; subsequent calls return the cached instance.
 */
export async function getWasmInventory(): Promise<WasmInventory> {
  if (wasmInventory) return wasmInventory;

  if (!modulePromise) {
    modulePromise = loadModule();
  }
  const mod = await modulePromise;
  wasmInventory = new mod.Inventory();
  return wasmInventory;
}

// ─── Helper: extract all products from Wasm → plain JS ──────────────────────

export function extractAllProducts(inv: WasmInventory): Product[] {
  const count = inv.getProductCount();
  const products: Product[] = [];
  for (let i = 0; i < count; i++) {
    const wp = inv.getProductAt(i);
    products.push({
      id: wp.getID(),
      name: wp.getName(),
      price: wp.getPrice(),
      quantity: wp.getQuantity(),
    });
    wp.delete(); // free Embind pointer
  }
  return products;
}

// ─── Helper: hydrate Wasm inventory from a plain JS product array ────────────

export function hydrateFromProducts(inv: WasmInventory, products: Product[]): void {
  inv.clear();
  for (const p of products) {
    inv.loadProduct(p.id, p.name, p.price, p.quantity);
  }
}
