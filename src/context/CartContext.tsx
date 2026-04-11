import { createContext, useContext, useState, ReactNode } from "react";
import { DbProduct } from "@/hooks/useProducts";

export interface CartItem {
  product: DbProduct;
  quantity: number;
  size: "full" | "mini";
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: DbProduct, size: "full" | "mini") => void;
  removeItem: (productId: string, size: "full" | "mini") => void;
  updateQuantity: (productId: string, size: "full" | "mini", quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (product: DbProduct, size: "full" | "mini") => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id && i.size === size);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.size === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, quantity: 1, size }];
    });
  };

  const removeItem = (productId: string, size: "full" | "mini") => {
    setItems((prev) => prev.filter((i) => !(i.product.id === productId && i.size === size)));
  };

  const updateQuantity = (productId: string, size: "full" | "mini", quantity: number) => {
    if (quantity <= 0) return removeItem(productId, size);
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.size === size ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => {
    const price = i.size === "full" ? i.product.price_full : i.product.price_mini;
    return sum + price * i.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
