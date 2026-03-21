import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

interface CartItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  stock_quantity: number;
  unit: string;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  loading: boolean;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const refreshCart = async () => {
    if (!isAuthenticated) {
      setItems([]);
      setTotal(0);
      return;
    }

    try {
      setLoading(true);
      const response = await cartAPI.get();
      setItems(response.data.data.items);
      setTotal(response.data.data.total);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  const addToCart = async (productId: number, quantity: number) => {
    try {
      setLoading(true);
      await cartAPI.add(productId, quantity);
      await refreshCart();
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      setLoading(true);
      await cartAPI.update(productId, quantity);
      await refreshCart();
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId: number) => {
    try {
      setLoading(true);
      await cartAPI.remove(productId);
      await refreshCart();
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to remove item');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await cartAPI.clear();
      setItems([]);
      setTotal(0);
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
