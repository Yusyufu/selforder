'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// Generate unique slug for table
const generateTableSlug = () => {
  // Generate random string with letters and numbers (8 characters)
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let slug = '';
  for (let i = 0; i < 8; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
};

// No sample data - all data comes from Supabase

export function AppProvider({ children }) {
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [initialized, setInitialized] = useState(false);

  // Load data from API on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeData();
    }
  }, []);

  // Initialize data from Supabase
  const initializeData = async () => {
    try {
      // Fetch from API (Supabase backend)
      const [tablesRes, menuRes, ordersRes] = await Promise.all([
        fetch('/api/tables'),
        fetch('/api/menu'),
        fetch('/api/orders'),
      ]);

      if (tablesRes.ok && menuRes.ok) {
        const { tables: fetchedTables } = await tablesRes.json();
        const { menuItems: fetchedMenu } = await menuRes.json();
        const { orders: fetchedOrders } = ordersRes.ok ? await ordersRes.json() : { orders: [] };

        // Use data from database (empty or not)
        setTables(fetchedTables);
        setMenuItems(fetchedMenu);
        setOrders(fetchedOrders);
      }
    } catch (error) {
      console.error('Error initializing data:', error);
      // Set empty arrays on error
      setTables([]);
      setMenuItems([]);
      setOrders([]);
    } finally {
      setInitialized(true);
    }
  };

  // Fetch data from Supabase
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const { orders: fetchedOrders } = await response.json();
        setOrders(fetchedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchTables = async () => {
    try {
      const response = await fetch('/api/tables');
      if (response.ok) {
        const { tables: fetchedTables } = await response.json();
        setTables(fetchedTables);
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu');
      if (response.ok) {
        const { menuItems: fetchedMenu } = await response.json();
        setMenuItems(fetchedMenu);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  // Poll for updates every 3 seconds for real-time sync
  useEffect(() => {
    if (!initialized) return;
    
    const interval = setInterval(() => {
      fetchOrders();
      fetchTables();
      fetchMenuItems();
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [initialized]);

  // Table management functions
  const addTable = async (tableNumber) => {
    // Validate table number is unique
    if (tables.some(table => table.tableNumber === tableNumber)) {
      throw new Error('Table number already exists');
    }

    // Generate unique slug
    let slug = generateTableSlug();
    while (tables.some(table => table.slug === slug)) {
      slug = generateTableSlug();
    }

    const newTable = {
      id: crypto.randomUUID(),
      tableNumber,
      slug,
      status: 'available',
    };

    try {
      const response = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTable),
      });

      if (!response.ok) throw new Error('Failed to create table');

      const { table } = await response.json();
      setTables([...tables, table]);
      return table;
    } catch (error) {
      console.error('Error creating table:', error);
      throw error;
    }
  };

  const updateTable = async (id, updates) => {
    // Validate if updating table number
    if (updates.tableNumber) {
      const existingTable = tables.find(
        table => table.tableNumber === updates.tableNumber && table.id !== id
      );
      if (existingTable) {
        throw new Error('Table number already exists');
      }
    }

    try {
      const response = await fetch('/api/tables', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });

      if (!response.ok) throw new Error('Failed to update table');

      const { table } = await response.json();
      setTables(tables.map(t => t.id === id ? table : t));
    } catch (error) {
      console.error('Error updating table:', error);
      throw error;
    }
  };

  const deleteTable = async (id) => {
    try {
      const response = await fetch(`/api/tables?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete table');

      setTables(tables.filter(table => table.id !== id));
    } catch (error) {
      console.error('Error deleting table:', error);
      throw error;
    }
  };

  // Menu management functions
  const addMenuItem = async (menuItem) => {
    // Validate required fields
    if (!menuItem.name || !menuItem.price || !menuItem.category) {
      throw new Error('Name, price, and category are required');
    }

    // Validate price is a positive number
    const price = parseFloat(menuItem.price);
    if (isNaN(price) || price <= 0) {
      throw new Error('Price must be a positive number');
    }

    const newMenuItem = {
      id: crypto.randomUUID(),
      name: menuItem.name,
      description: menuItem.description || '',
      price: price,
      category: menuItem.category,
      imageUrl: menuItem.imageUrl || '',
      available: menuItem.available !== undefined ? menuItem.available : true,
    };

    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMenuItem),
      });

      if (!response.ok) throw new Error('Failed to create menu item');

      const { menuItem: createdItem } = await response.json();
      setMenuItems([...menuItems, createdItem]);
      return createdItem;
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
  };

  const updateMenuItem = async (id, updates) => {
    // Validate price if it's being updated
    if (updates.price !== undefined) {
      const price = parseFloat(updates.price);
      if (isNaN(price) || price <= 0) {
        throw new Error('Price must be a positive number');
      }
    }

    try {
      const response = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });

      if (!response.ok) throw new Error('Failed to update menu item');

      const { menuItem } = await response.json();
      setMenuItems(menuItems.map(item => item.id === id ? menuItem : item));
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  };

  const deleteMenuItem = async (id) => {
    try {
      const response = await fetch(`/api/menu?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete menu item');

      setMenuItems(menuItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  };

  const toggleAvailability = async (id) => {
    const item = menuItems.find(item => item.id === id);
    if (!item) return;

    try {
      const response = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, available: !item.available }),
      });

      if (!response.ok) throw new Error('Failed to toggle availability');

      const { menuItem } = await response.json();
      setMenuItems(menuItems.map(i => i.id === id ? menuItem : i));
    } catch (error) {
      console.error('Error toggling availability:', error);
      throw error;
    }
  };

  // Order management functions
  const createOrder = async (tableNumber, items, customerName = '', paymentType = 'QRIS') => {
    // Calculate order total from items
    const total = items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    const orderData = {
      id: crypto.randomUUID(),
      tableNumber,
      items,
      total,
      customerName,
      paymentType,
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error('Failed to create order');

      const { order: newOrder } = await response.json();
      setOrders([...orders, newOrder]);
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) throw new Error('Failed to update order');

      const { order: updatedOrder } = await response.json();
      setOrders(orders.map(order =>
        order.id === id ? updatedOrder : order
      ));
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  };

  // Reset all data to sample data (useful for demo/testing)
  const resetData = async () => {
    // Re-initialize from API
    await initializeData();
  };

  const value = {
    tables,
    setTables,
    menuItems,
    setMenuItems,
    orders,
    setOrders,
    initialized,
    addTable,
    updateTable,
    deleteTable,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability,
    createOrder,
    updateOrderStatus,
    resetData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
