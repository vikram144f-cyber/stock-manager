#include <iostream>
#include <vector>
#include <string>
#include <emscripten/bind.h>

using namespace std;
using namespace emscripten;

class Product {
private:
    string productID;
    string name;
    double price;
    int quantity;

public:
    Product() : productID(""), name(""), price(0.0), quantity(0) {}
    
    Product(string id, string n, double p, int q)
        : productID(id), name(n), price(p), quantity(q) {}

    string getID() const { return productID; }
    string getName() const { return name; }
    double getPrice() const { return price; }
    int getQuantity() const { return quantity; }
    double getValue() const { return price * quantity; }

    void setQuantity(int q) { quantity = q; }
    void setPrice(double p) { price = p; }
};

class Inventory {
private:
    vector<Product> products;

    int findIndex(const string& id) const {
        for (size_t i = 0; i < products.size(); i++) {
            if (products[i].getID() == id) return i;
        }
        return -1;
    }

public:
    Inventory() {}

    bool addProduct(string id, string name, double price, int qty) {
        if (findIndex(id) != -1) return false;
        products.push_back(Product(id, name, price, qty));
        return true;
    }

    bool deleteProduct(string id) {
        int idx = findIndex(id);
        if (idx == -1) return false;
        products.erase(products.begin() + idx);
        return true;
    }

    int purchaseStock(string id, int qty) {
        int idx = findIndex(id);
        if (idx == -1) return -1;
        int newQty = products[idx].getQuantity() + qty;
        products[idx].setQuantity(newQty);
        return newQty;
    }

    int sellStock(string id, int qty) {
        int idx = findIndex(id);
        if (idx == -1) return -1;
        if (qty > products[idx].getQuantity()) return -2;
        int newQty = products[idx].getQuantity() - qty;
        products[idx].setQuantity(newQty);
        return newQty;
    }

    bool updateProduct(string id, string name, double price, int qty) {
        int idx = findIndex(id);
        if (idx == -1) return false;
        products[idx] = Product(id, name, price, qty);
        return true;
    }

    int getProductCount() const {
        return products.size();
    }

    Product getProductAt(int index) const {
        if (index >= 0 && index < products.size()) {
            return products[index];
        }
        return Product();
    }

    double getTotalValue() const {
        double total = 0;
        for (const auto& p : products) {
            total += p.getValue();
        }
        return total;
    }

    int getLowStockCount(int threshold) const {
        int count = 0;
        for (const auto& p : products) {
            if (p.getQuantity() <= threshold) count++;
        }
        return count;
    }

    bool isLowStock(string id, int threshold) const {
        int idx = findIndex(id);
        if (idx != -1) {
            return products[idx].getQuantity() <= threshold;
        }
        return false;
    }

    bool productExists(string id) const {
        return findIndex(id) != -1;
    }

    int validateSell(string id, int qty) const {
        int idx = findIndex(id);
        if (idx == -1) return 1;
        if (qty > products[idx].getQuantity()) return 2;
        return 0;
    }

    int getAvailableQty(string id) const {
        int idx = findIndex(id);
        if (idx != -1) return products[idx].getQuantity();
        return 0;
    }

    void clear() {
        products.clear();
    }

    void loadProduct(string id, string name, double price, int qty) {
        products.push_back(Product(id, name, price, qty));
    }
};

EMSCRIPTEN_BINDINGS(inventory_module) {
    class_<Product>("Product")
        .constructor<>()
        .constructor<string, string, double, int>()
        .function("getID", &Product::getID)
        .function("getName", &Product::getName)
        .function("getPrice", &Product::getPrice)
        .function("getQuantity", &Product::getQuantity)
        .function("getValue", &Product::getValue)
        ;

    class_<Inventory>("Inventory")
        .constructor<>()
        .function("addProduct", &Inventory::addProduct)
        .function("deleteProduct", &Inventory::deleteProduct)
        .function("purchaseStock", &Inventory::purchaseStock)
        .function("sellStock", &Inventory::sellStock)
        .function("updateProduct", &Inventory::updateProduct)
        .function("getProductCount", &Inventory::getProductCount)
        .function("getProductAt", &Inventory::getProductAt)
        .function("getTotalValue", &Inventory::getTotalValue)
        .function("getLowStockCount", &Inventory::getLowStockCount)
        .function("isLowStock", &Inventory::isLowStock)
        .function("productExists", &Inventory::productExists)
        .function("validateSell", &Inventory::validateSell)
        .function("getAvailableQty", &Inventory::getAvailableQty)
        .function("clear", &Inventory::clear)
        .function("loadProduct", &Inventory::loadProduct)
        ;
}
