# 📦 Stock Savvy (Shop Stock Controller)
![Stock Savvy UI Preview](public/placeholder.svg)

**Stock Savvy** is a high-performance inventory management application designed to handle shop stock calculations with efficiency and ease. It leverages a modern **React & TypeScript UI** alongside a blazingly fast backend engine written in **C++ and compiled to WebAssembly (WASM)**.

This repository serves as a digital representation of a comprehensive **C++ OOP Mini-Project**, seamlessly integrated into a web dashboard for live deployment.

---

## ✨ Features
*   **➕ Add New Stock**: Register new products with unique IDs, names, prices, and quantities.
*   **🛠 Update & Manage**: Edit existing stock details instantly.
*   **🗑 Delete Records**: Remove discontinued/obsolete inventory.
*   **🔍 Search Engine**: Look up product details rapidly by ID.
*   **🛒 Purchase / Sell Stock**: Handle real-time stock deductions and additions securely via C++ logic barriers (prevents selling more stock than available).
*   **💾 Persistent Data**: Built-in state-saving ensures you don't lose data on page refreshes (handled seamlessly via LocalStorage bindings).
*   **📊 Low Stock Alerts**: Generates intelligent threshold alerts for inventory demanding restocking.

## 🚀 Tech Stack
*   **Core Engine**: Written in **C++** implementing Object-Oriented design and STL Vectors.
*   **WebAssembly Bridge**: Compiled using **Emscripten** to run native C++ directly in the browser safely.
*   **Frontend**: Built with **React Native (Vite) + TypeScript**.
*   **Styling**: **Tailwind CSS** with **Shadcn UI** components providing an ultra-modern layout and dark mode capability.

## 🛠 Flow Architecture 
Instead of relying strictly on Javascript calculations, this application routes inventory actions straight into the C++ `InventoryManager` via the WebAssembly binding. 

```text
User Actions (React) -> WasmLoader (TS) -> C++ Wasm Bindings -> Memory Storage (C++)
```

This ensures strict logic boundaries, memory safety, and represents complex Object-Oriented Programming (OOP) architectures perfectly running client-side.

---

## 💻 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/en/) installed on your system.

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vikram144f-cyber/stock-manager.git
   cd stock-manager/stock-savvy-main/stock-savvy-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:8080/` to test the application!

---

## 🎓 Academic Info / Digital Assignment
This project fulfills the requirements for the C++ Programming Mini-Project.

*   Demonstrates distinct usage of Encapsulation, Abstraction, and Data Hiding.
*   Provides robust test handling for duplicate item additions and boundary testing (like rejecting negative entries).
*   Codebase clearly segregates logical backend modules from view rendering parameters.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 
Feel free to check [issues page](https://github.com/vikram144f-cyber/stock-manager/issues).

## 📝 License
This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.
