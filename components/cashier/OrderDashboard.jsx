'use client';

import { useApp } from '@/context/AppContext';
import { useEffect, useState } from 'react';

export default function OrderDashboard() {
  const { orders, updateOrderStatus } = useApp();
  const [newOrderIds, setNewOrderIds] = useState(new Set());
  const [previousOrderCount, setPreviousOrderCount] = useState(0);

  // Auto-refresh functionality - detect new orders
  useEffect(() => {
    if (orders.length > previousOrderCount) {
      // New orders have arrived
      const newOrders = orders.slice(previousOrderCount);
      const newIds = new Set(newOrders.map(order => order.id));

      setNewOrderIds(prev => {
        const updated = new Set([...prev, ...newIds]);
        return updated;
      });

      // Remove highlight after 5 seconds
      const timer = setTimeout(() => {
        setNewOrderIds(prev => {
          const updated = new Set(prev);
          newIds.forEach(id => updated.delete(id));
          return updated;
        });
      }, 5000);

      return () => clearTimeout(timer);
    }
    setPreviousOrderCount(orders.length);
  }, [orders, previousOrderCount]);

  // Filter orders by status
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const acknowledgedOrders = orders.filter(order => order.status === 'acknowledged');
  const processedOrders = orders.filter(order => order.status === 'processed');

  // Sort orders by timestamp (newest first)
  const sortByNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

  const handleAcknowledge = (orderId) => {
    updateOrderStatus(orderId, 'acknowledged');
    setNewOrderIds(prev => {
      const updated = new Set(prev);
      updated.delete(orderId);
      return updated;
    });
  };

  const handleMarkAsProcessed = (orderId) => {
    updateOrderStatus(orderId, 'processed');
    setNewOrderIds(prev => {
      const updated = new Set(prev);
      updated.delete(orderId);
      return updated;
    });
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('id-ID');
  };

  const OrderCard = ({ order, isNew }) => (
    <div
      className={`bg-white rounded-lg border transition-all hover:shadow-md ${isNew ? 'border-gray-900' : 'border-gray-200'
        }`}
    >
      <div className="flex justify-between items-start mb-4 p-5 md:p-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Meja {order.tableNumber}
          </h3>
          {order.customerName && (
            <p className="text-sm font-semibold text-gray-900 mt-1">
              {order.customerName}
            </p>
          )}
          <p className="text-sm text-gray-600 mt-1">
            Pesanan #{order.id.slice(0, 8)}
          </p>
          <p className="text-sm text-gray-600">
            {formatTimestamp(order.createdAt)}
          </p>
          {order.paymentType && (
            <p className="text-xs text-gray-600 mt-1">
              Pembayaran: {order.paymentType}
            </p>
          )}
        </div>
        <div className="text-right">
          <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            order.status === 'acknowledged' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
            {order.status === 'pending' ? 'Menunggu' : order.status === 'acknowledged' ? 'Diproses' : 'Selesai'}
          </span>
        </div>
      </div>

      <div className="mb-4 px-5 md:px-6">
        <h4 className="font-semibold text-gray-900 mb-3 text-sm">Item:</h4>
        <ul className="space-y-2">
          {order.items.map((item, index) => (
            <li key={index} className="bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-100">
              <div className="flex justify-between text-gray-700">
                <span className="font-medium text-sm">
                  {item.quantity}x {item.name}
                </span>
                <span className="font-semibold text-sm">
                  Rp {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
              {item.notes && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-600 font-semibold">Catatan:</p>
                  <p className="text-sm text-gray-700 italic">{item.notes}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-gray-200 pt-4 mb-4 px-5 md:px-6">
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-gray-900">Total:</span>
          <span className="text-xl font-bold text-gray-900">
            Rp {formatCurrency(order.total)}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 px-5 md:px-6 pb-5 md:pb-6">
        {order.status === 'pending' && (
          <button
            onClick={() => handleAcknowledge(order.id)}
            className="flex-1 bg-gray-700 text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-all font-semibold text-sm"
          >
            Proses Pesanan
          </button>
        )}
        {(order.status === 'pending' || order.status === 'acknowledged') && (
          <button
            onClick={() => handleMarkAsProcessed(order.id)}
            className="flex-1 bg-gray-900 text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-all font-semibold text-sm"
          >
            Pesanan Selesai
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Pending Orders Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Pending Order
          {pendingOrders.length > 0 && (
            <span className="ml-2 text-base text-yellow-600">
              ({pendingOrders.length})
            </span>
          )}
        </h2>
        {pendingOrders.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
            <p className="text-sm">Tidak ada pesanan menunggu</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingOrders.sort(sortByNewest).map(order => (
              <OrderCard
                key={order.id}
                order={order}
                isNew={newOrderIds.has(order.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Acknowledged Orders Section */}
      {acknowledgedOrders.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Pesanan Diproses
            <span className="ml-2 text-base text-blue-600">
              ({acknowledgedOrders.length})
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {acknowledgedOrders.sort(sortByNewest).map(order => (
              <OrderCard key={order.id} order={order} isNew={false} />
            ))}
          </div>
        </div>
      )}

      {/* Processed Orders Section */}
      {processedOrders.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Pesanan Selesai
            <span className="ml-2 text-base text-green-600">
              ({processedOrders.length})
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processedOrders.sort(sortByNewest).map(order => (
              <OrderCard key={order.id} order={order} isNew={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
