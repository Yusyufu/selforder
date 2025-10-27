'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Suspense, useEffect, useState } from 'react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get('orderId');
  const tableNumber = searchParams.get('table');

  // Fetch order directly from API
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/orders');
        if (response.ok) {
          const { orders } = await response.json();
          const foundOrder = orders.find((o: any) => o.id === orderId);
          setOrder(foundOrder);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handlePlaceAnotherOrder = () => {
    // Clear cart and return to menu
    clearCart();
    router.push(`/menu?table=${tableNumber}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Pesanan Tidak Ditemukan
            </h1>
            <p className="text-gray-600 mb-6">
              Kami tidak dapat menemukan pesanan Anda. Silakan coba lagi.
            </p>
            <button
              onClick={() => router.push(`/menu?table=${tableNumber}`)}
              className="bg-black text-white py-4 px-6 rounded-lg font-bold hover:bg-gray-800 transition-all active:scale-95"
            >
              Kembali ke Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
          {/* Success Icon and Message */}
          <div className="text-center mb-8">
            <div className="inline-block w-20 h-20 bg-green-500 rounded-full mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Pesanan Dikonfirmasi!
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Pesanan Anda telah berhasil ditempatkan dan dikirim ke dapur.
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-2xl p-5 md:p-6 mb-6 border border-gray-200">
            {/* Order Number */}
            <div className="mb-5 pb-5 border-b-2 border-gray-200">
              <p className="text-sm font-bold text-gray-600 mb-2">Nomor Pesanan</p>
              <p className="text-xl font-bold text-gray-900">
                #{order.id.slice(0, 8).toUpperCase()}
              </p>
            </div>

            {/* Table Number */}
            <div className="mb-5 pb-5 border-b-2 border-gray-200">
              <p className="text-sm font-bold text-gray-600 mb-2">Nomor Meja</p>
              <p className="text-xl font-bold text-gray-900">
                Meja {order.tableNumber}
              </p>
            </div>

            {/* Customer Name */}
            {order.customerName && (
              <div className="mb-5 pb-5 border-b-2 border-gray-200">
                <p className="text-sm font-bold text-gray-600 mb-2">Nama Customer</p>
                <p className="text-xl font-bold text-gray-900">
                  {order.customerName}
                </p>
              </div>
            )}

            {/* Payment Type */}
            {order.paymentType && (
              <div className="mb-5 pb-5 border-b-2 border-gray-200">
                <p className="text-sm font-bold text-gray-600 mb-2">Metode Pembayaran</p>
                <p className="text-xl font-bold text-gray-900">
                  {order.paymentType}
                </p>
              </div>
            )}

            {/* Ordered Items Summary */}
            <div>
              <p className="text-sm font-bold text-gray-600 mb-4">Ringkasan Pesanan</p>
              <div className="space-y-3">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Rp {item.price.toLocaleString('id-ID')} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-gray-900 text-lg">
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>
                    {item.notes && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 font-semibold">Catatan:</p>
                        <p className="text-sm text-gray-700 italic">{item.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-5 pt-5 border-t-2 border-gray-300 flex justify-between items-center">
                <p className="text-xl font-bold text-gray-900">Total</p>
                <p className="text-3xl font-bold text-gray-900">
                  Rp {order.total.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>

          {/* Place Another Order Button */}
          <button
            onClick={handlePlaceAnotherOrder}
            className="w-full bg-black text-white py-4 px-6 rounded-xl font-bold hover:bg-gray-800 transition-all active:scale-95 text-lg"
          >
            Pesan Lagi
          </button>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
