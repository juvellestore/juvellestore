import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import api from "../api/axios.js";
import { useAuth } from "./AuthContext.jsx";

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      return;
    }
    try {
      const res = await api.get("/api/cart");
      setCartItems(res.data.items || []);
    } catch {
      setCartItems([]);
    }
  }, [user]);

  // Refetch cart when user changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(
    async (productId, size, quantity = 1) => {
      const res = await api.post("/api/cart", { productId, size, quantity });
      await fetchCart();
      return res.data.item;
    },
    [fetchCart],
  );

  const updateQty = useCallback(
    async (cartItemId, quantity) => {
      await api.put(`/api/cart/${cartItemId}`, { quantity });
      await fetchCart();
    },
    [fetchCart],
  );

  const removeItem = useCallback(async (cartItemId) => {
    await api.delete(`/api/cart/${cartItemId}`);
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  }, []);

  const clearCart = useCallback(async () => {
    await api.delete("/api/cart");
    setCartItems([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        fetchCart,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
