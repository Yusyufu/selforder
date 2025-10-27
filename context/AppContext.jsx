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

// Sample data initialization
const initializeSampleData = () => {
  const sampleTables = [
    { id: crypto.randomUUID(), tableNumber: '1', slug: generateTableSlug(), status: 'available' },
    { id: crypto.randomUUID(), tableNumber: '2', slug: generateTableSlug(), status: 'available' },
    { id: crypto.randomUUID(), tableNumber: '3', slug: generateTableSlug(), status: 'available' },
  ];

  const sampleMenuItems = [
    // Appetizers
    {
      id: crypto.randomUUID(),
      name: 'Spring Rolls',
      description: 'Crispy vegetable spring rolls served with sweet chili sauce',
      price: 45000,
      category: 'Appetizers',
      imageUrl: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400',
      available: true,
    },
    {
      id: crypto.randomUUID(),
      name: 'Chicken Wings',
      description: 'Spicy buffalo wings with ranch dipping sauce',
      price: 55000,
      category: 'Appetizers',
      imageUrl: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400',
      available: true,
    },
    {
      id: crypto.randomUUID(),
      name: 'Mozzarella Sticks',
      description: 'Golden fried mozzarella with marinara sauce',
      price: 50000,
      category: 'Appetizers',
      imageUrl: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=400',
      available: true,
    },
    // Main Course
    {
      id: crypto.randomUUID(),
      name: 'Classic Burger',
      description: 'Juicy beef patty with lettuce, tomato, and special sauce',
      price: 85000,
      category: 'Main Course',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      available: true,
    },
    {
      id: crypto.randomUUID(),
      name: 'Grilled Salmon',
      description: 'Fresh Atlantic salmon with lemon butter and vegetables',
      price: 150000,
      category: 'Main Course',
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
      available: true,
    },
    {
      id: crypto.randomUUID(),
      name: 'Margherita Pizza',
      description: 'Classic pizza with fresh mozzarella, basil, and tomato sauce',
      price: 95000,
      category: 'Main Course',
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
      available: true,
    },
    {
      id: crypto.randomUUID(),
      name: 'Chicken Alfredo',
      description: 'Creamy fettuccine pasta with grilled chicken',
      price: 105000,
      category: 'Main Course',
      imageUrl: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400',
      available: true,
    },
    {
      id: crypto.randomUUID(),
      name: 'Steak & Fries',
      description: 'Premium ribeye steak with crispy french fries',
      price: 250000,
      category: 'Main Course',
      imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400',
      available: false, // Example of unavailable item
    },
    // Desserts
    {
      id: crypto.randomUUID(),
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with molten center and vanilla ice cream',
      price: 55000,
      category: 'Desserts',
      imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400',
      available: true,
    },
    {
      id: crypto.randomUUID(),
      name: 'Cheesecake',
      description: 'New York style cheesecake with berry compote',
      price: 45000,
      category: 'Desserts',
      imageUrl: 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=400',
      available: true,
    },
    {
      id: crypto.randomUUID(),
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee and mascarpone',
      price: 50000,
      category: 'Desserts',
      imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
      available: true,
    },
    // Beverages
    {
      id: crypto.randomUUID(),
      name: 'Fresh Lemonade',
      description: 'Homemade lemonade with fresh lemons',
      price: 25000,
      category: 'Beverages',
      imageUrl: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9d?w=400',
      available: true,
    },
    {
      id: crypto.randomUUID(),
      name: 'Iced Coffee',
      description: 'Cold brew coffee served over ice',
      price: 30000,
      category: 'Beverages',
      imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400',
      available: true,
    },
    {
      id: crypto.randomUUID(),
      name: 'Smoothie',
      description: 'Mixed berry smoothie with yogurt',
      price: 40000,
      category: 'Beverages',
      imageUrl: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400',
      available: true,
    },
    {
      id: crypto.randomUUID(),
      name: 'Soft Drink',
      description: 'Choice of cola, sprite, or orange soda',
      price: 20000,
      category: 'Beverages',
      imageUrl: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400',
      available: true,
    },
  ];

  return { sampleTables, sampleMenuItems };
};

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

  // Initialize data - frontend is source of truth
  const initializeData = async () => {
    try {
      // Just set sample data - no API calls needed
      const { sampleTables, sampleMenuItems } = initializeSampleData();
      setTables(sampleTables);
      setMenuItems(sampleMenuItems);
      setOrders([]);
    } catch (error) {
      console.error('Error initializing data:', error);
    } finally {
      setInitialized(true);
    }
  };

  // No polling needed - frontend is the source of truth

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

    // Update state directly - frontend is source of truth
    setTables([...tables, newTable]);
    return newTable;
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

    // Update state directly
    setTables(tables.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTable = async (id) => {
    // Update state directly
    setTables(tables.filter(table => table.id !== id));
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

    // Update state directly
    setMenuItems([...menuItems, newMenuItem]);
    return newMenuItem;
  };

  const updateMenuItem = async (id, updates) => {
    // Validate price if it's being updated
    if (updates.price !== undefined) {
      const price = parseFloat(updates.price);
      if (isNaN(price) || price <= 0) {
        throw new Error('Price must be a positive number');
      }
    }

    // Update state directly
    setMenuItems(menuItems.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteMenuItem = async (id) => {
    // Update state directly
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const toggleAvailability = async (id) => {
    const item = menuItems.find(item => item.id === id);
    if (!item) return;

    // Update state directly
    setMenuItems(menuItems.map(i => i.id === id ? { ...i, available: !i.available } : i));
  };

  // Order management functions
  const createOrder = async (tableNumber, items, customerName = '', paymentType = 'QRIS') => {
    // Calculate order total from items
    const total = items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    const newOrder = {
      id: crypto.randomUUID(),
      tableNumber,
      items,
      total,
      customerName,
      paymentType,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Update state directly
    setOrders([...orders, newOrder]);
    return newOrder;
  };

  const updateOrderStatus = async (id, status) => {
    // Update state directly
    setOrders(orders.map(order =>
      order.id === id ? { ...order, status } : order
    ));
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
