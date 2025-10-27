'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from localStorage on initial mount
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  const [customerName, setCustomerName] = useState(() => {
    // Load customer name from localStorage on initial mount
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('customerName');
      return savedName || '';
    }
    return '';
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Save customer name to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('customerName', customerName);
    }
  }, [customerName]);

  // Add item to cart or update quantity if already exists
  const addToCart = (menuItem, quantity = 1, notes = '') => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.menuItemId === menuItem.id);
      
      if (existingItem) {
        // Update quantity if item already in cart
        return prevItems.map(item =>
          item.menuItemId === menuItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        return [
          ...prevItems,
          {
            menuItemId: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity,
            notes: notes || '',
          },
        ];
      }
    });
  };

  // Update notes for an item in cart
  const updateNotes = (menuItemId, notes) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.menuItemId === menuItemId
          ? { ...item, notes }
          : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (menuItemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.menuItemId !== menuItemId));
  };

  // Update quantity of an item in cart
  const updateQuantity = (menuItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.menuItemId === menuItemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Clear all items from cart
  const clearCart = () => {
    setCartItems([]);
    setCustomerName('');
  };

  // Calculate running total
  const getTotal = () => {
    return cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  };

  const value = {
    cartItems,
    customerName,
    setCustomerName,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateNotes,
    clearCart,
    getTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
