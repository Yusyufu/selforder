'use client';

import { useApp } from '@/context/AppContext';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function MenuDisplay({ table, isValidTable, searchQuery = '', selectedCategory = 'All' }) {
  const { menuItems } = useApp();
  const { addToCart, cartItems } = useCart();
  const [quantities, setQuantities] = useState({});
  const [addedItems, setAddedItems] = useState({});

  // Filter to show only available items
  let availableItems = menuItems.filter(item => item.available);

  // Apply search filter
  if (searchQuery && searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase();
    availableItems = availableItems.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  }

  // Group items by category
  const itemsByCategory = availableItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const categories = Object.keys(itemsByCategory).sort();

  // Filter items based on selected category
  const filteredCategories = selectedCategory === 'All'
    ? categories
    : categories.filter(cat => cat === selectedCategory);

  const handleQuantityChange = (itemId, value) => {
    const quantity = parseInt(value) || 1;
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, quantity)
    }));
  };

  const handleAddToCart = (item) => {
    // Prevent adding to cart if table number is invalid
    if (!isValidTable) {
      return;
    }

    const quantity = quantities[item.id] || 1;
    addToCart(item, quantity);

    // Show visual feedback
    setAddedItems(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [item.id]: false }));
    }, 1000);

    // Reset quantity to 1
    setQuantities(prev => ({ ...prev, [item.id]: 1 }));
  };

  // Calculate total items in cart
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (availableItems.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        {searchQuery ? (
          <div>
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-gray-500 text-lg font-semibold mb-2">Tidak ada hasil untuk "{searchQuery}"</p>
            <p className="text-gray-400 text-sm">Coba kata kunci lain atau hapus pencarian</p>
          </div>
        ) : (
          <p className="text-gray-500 text-lg">Tidak ada menu yang tersedia saat ini.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      {/* Category Filter Buttons - Sticky on mobile */}
      <div className="sticky top-16 z-20 bg-white border-b border-gray-200 shadow-sm -mx-4 md:mx-0 md:relative md:top-0 md:bg-transparent md:border-0 md:shadow-none">
        <div className="py-3 md:py-0 relative">
          {/* Gradient fade indicators for scroll */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 md:hidden"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 md:hidden"></div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide snap-x px-4 md:px-0">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all snap-start ${selectedCategory === 'All'
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
                }`}
            >
              Semua
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all snap-start ${selectedCategory === category
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredCategories.map(category => (
        <div key={category} className="space-y-4">
          <div className="px-4 md:px-0">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 pb-1">
              {category}
            </h2>
            <div className="w-16 h-1 bg-gray-900 rounded-full"></div>
          </div>

          {/* Mobile-first grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 md:px-0">
            {itemsByCategory[category].map(item => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Item Image */}
                {item.imageUrl && (
                  <div className="w-full h-48 sm:h-52 bg-gray-100 relative">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Item Details */}
                <div className="p-4 space-y-3">
                  <div className="min-h-[60px]">
                    <h3 className="text-base font-bold text-gray-900 leading-tight">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-lg font-bold text-gray-900">
                      Rp {item.price.toLocaleString('id-ID')}
                    </span>
                  </div>

                  {/* Quantity Selector and Add to Cart */}
                  <div className="flex items-center gap-2">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-1">
                      <button
                        onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 1) - 1)}
                        className="w-9 h-9 flex items-center justify-center rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 active:scale-95 transition-all font-bold text-lg"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-10 text-center font-bold text-gray-900 text-base">
                        {quantities[item.id] || 1}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 1) + 1)}
                        className="w-9 h-9 flex items-center justify-center rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 active:scale-95 transition-all font-bold text-lg"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Add button */}
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={!isValidTable}
                      className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all text-sm shadow-sm ${!isValidTable
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : addedItems[item.id]
                            ? 'bg-green-600 text-white shadow-green-200'
                            : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-95 shadow-gray-200'
                        }`}
                      title={!isValidTable ? 'Please scan a valid QR code to add items' : ''}
                    >
                      {addedItems[item.id] ? '✓ Ditambahkan' : 'Tambah'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
