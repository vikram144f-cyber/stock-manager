
## Shop Stock Controller — Inventory Management Dashboard

### Layout
- **Sidebar navigation** with icons (collapsible on mobile) linking to: Dashboard, Products, Add Product, Purchase Stock, Sell Stock, Low Stock Report
- **Main content area** with a top header bar containing search input and sidebar trigger

### Pages

1. **Dashboard** — 3 summary cards: Total Products, Total Inventory Value, Low Stock Alerts count. Quick overview of stock health.

2. **Products Table** — Sortable table with ProductID, Name, Price, Quantity (color-coded badges: green >10, yellow 5–10, red <5), and Edit/Delete action buttons. Delete triggers a confirmation dialog. Edit opens an inline form or modal.

3. **Add Product** — Form with ProductID, Name, Price, Quantity fields. Validates required fields, shows toast on success.

4. **Purchase Stock** — Product selector dropdown + quantity input. Adds to existing stock, shows success toast.

5. **Sell Stock** — Product selector dropdown + quantity input. Validates sufficient stock — blocks and shows error toast if insufficient. Deducts on success.

6. **Low Stock Report** — Filtered table of products with qty < threshold (default 5, adjustable). Same color-coded badges.

### Search
- Persistent search input in the header, filters the Products Table in real-time by ProductID or name.

### State & Data
- Global state via React Context + useReducer, shared across all pages
- Pre-loaded with 8 sample products at varied stock levels (0, 3, 5, 8, 12, 25, etc.)
- Actions: ADD_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT, PURCHASE_STOCK, SELL_STOCK

### UX Details
- Confirmation modal (AlertDialog) before delete
- Sonner toast notifications for all actions
- Fully responsive — sidebar collapses to icon-only on mobile
- Clean modern design using shadcn/ui components with the existing design system
