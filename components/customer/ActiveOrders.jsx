'use client';

import { useState, useEffect } from 'react';

export default function ActiveOrders({ tableNumber, onAddMore }) {
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveOrders();
    
    // Poll every 5 seconds for updates
    const interval = setInterval(fetchActiveOrders, 5000);
    return () => clearInterval(interval);
  }, [tableNumber]);

  const fetchActiveOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const { orders } = await response.json();
        
        // Filter orders for this table that are still active (not completed)
        const tableOrders = orders.filter(
          order => 
            order.tableNumber === tableNumber && 
            (order.status === 'pending' || order.status === 'acknowledged')
        );
        
        setActiveOrders(tableOrders);
      }
    } catch (error) {
      console.error('Error fetching active orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('id-ID');
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Menunggu Konfirmasi';
      case 'acknowledged':
        return 'Sedang Diproses';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'acknowledged':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Auto show menu if no active orders
  useEffect(() => {
    if (!loading && activeOrders.length === 0) {
      onAddMore(); // Trigger show menu
    }
  }, [loading, activeOrders.length]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="text-gray-600 mt-2 text-sm">Memeriksa pesanan...</p>
      </div>
    );
  }

  if (activeOrders.length === 0) {
    return null; // Will auto-trigger onAddMore above
  }

  return (
    <div className="space-y-6">
      {/* Active Orders Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-lg font-bold text-blue-900">
            Pesanan Aktif Meja {tableNumber}
          </h2>
        </div>
        <p className="text-sm text-blue-700">
          Anda memiliki {activeOrders.length} pesanan yang sedang diproses
        </p>
      </div>

      {/* Active Orders List */}
      <div className="space-y-4">
        {activeOrders.map((order) => (
          <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            {/* Order Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600">
                  Pesanan #{order.id.slice(0, 8).toUpperCase()}
                </p>
                {order.customerName && (
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {order.customerName}
                  </p>
                )}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>

            {/* Order Items */}
            <div className="space-y-2 mb-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-semibold text-gray-900">
                    Rp {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">
                Rp {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add More Button */}
      <button
        onClick={onAddMore}
        className="w-full bg-black text-white py-4 px-6 rounded-lg font-bold hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Tambah Pesanan
      </button>

      {/* Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-600 text-center">
          💡 Pesanan baru akan digabung dengan pesanan yang sedang berjalan
        </p>
      </div>
    </div>
  );
}
