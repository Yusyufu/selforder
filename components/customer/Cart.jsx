'use client';

import { useCart } from '@/context/CartContext';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// Cart Content Component (reusable for modal and desktop)
function CartContent({ 
  cartItems, 
  customerName, 
  setCustomerName, 
  updateNotes, 
  handleQuantityIncrease, 
  handleQuantityDecrease, 
  handleRemoveItem, 
  paymentType, 
  setPaymentType, 
  total, 
  isValidTable, 
  handlePlaceOrder 
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cartItems.map((item) => {
          const itemTotal = item.price * item.quantity;
          
          return (
            <div key={item.menuItemId} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start justify-between gap-4 mb-3">
                {/* Item Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Rp {item.price.toLocaleString('id-ID')} each
                  </p>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="font-semibold text-gray-900 text-base">
                    Rp {itemTotal.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              {/* Notes Input */}
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Tambah catatan (contoh: tanpa bawang)"
                  value={item.notes || ''}
                  onChange={(e) => updateNotes(item.menuItemId, e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 bg-white text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Quantity Controls and Remove Button */}
              <div className="flex items-center justify-between">
                {/* Quantity controls */}
                <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-200">
                  <button
                    onClick={() => handleQuantityDecrease(item.menuItemId, item.quantity)}
                    className="w-9 h-9 flex items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 transition-colors font-bold text-lg"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-bold text-gray-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityIncrease(item.menuItemId, item.quantity)}
                    className="w-9 h-9 flex items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 transition-colors font-bold text-lg"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Remove Item Button */}
                <button
                  onClick={() => handleRemoveItem(item.menuItemId)}
                  className="text-red-600 hover:text-red-700 text-sm font-semibold transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Footer - Sticky at bottom */}
      <div className="border-t border-gray-200 bg-white p-4 space-y-4">
        {/* Payment Type Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Metode Pembayaran
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentType('QRIS')}
              className={`py-3 px-4 rounded-lg border-2 font-semibold text-sm transition-all ${
                paymentType === 'QRIS'
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              QRIS
            </button>
            <button
              onClick={() => setPaymentType('Cash')}
              className={`py-3 px-4 rounded-lg border-2 font-semibold text-sm transition-all ${
                paymentType === 'Cash'
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              Tunai
            </button>
          </div>
        </div>

        {/* Customer Name Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Nama Customer (Opsional)
          </label>
          <input
            type="text"
            placeholder="Masukkan nama Anda"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 bg-white text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Running Total */}
        <div className="flex items-center justify-between py-4 border-t border-gray-200">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-gray-900">
            Rp {total.toLocaleString('id-ID')}
          </span>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={!isValidTable}
          className={`w-full py-4 px-6 rounded-lg font-bold transition-all text-base ${
            !isValidTable
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-95'
          }`}
          title={!isValidTable ? 'Nomor meja valid diperlukan untuk memesan' : ''}
        >
          Pesan Sekarang
        </button>
        {!isValidTable && (
          <p className="text-sm text-red-600 text-center font-semibold">
            Nomor meja valid diperlukan untuk memesan
          </p>
        )}
      </div>
    </div>
  );
}

export default function Cart({ table, isValidTable }) {
  const { cartItems, customerName, setCustomerName, updateQuantity, updateNotes, removeFromCart, getTotal, clearCart } = useCart();
  const { createOrder } = useApp();
  const router = useRouter();
  const [paymentType, setPaymentType] = useState('QRIS');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Fix hydration error by only rendering after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleQuantityIncrease = (menuItemId, currentQuantity) => {
    updateQuantity(menuItemId, currentQuantity + 1);
  };

  const handleQuantityDecrease = (menuItemId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(menuItemId, currentQuantity - 1);
    }
  };

  const handleRemoveItem = (menuItemId) => {
    removeFromCart(menuItemId);
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      return;
    }

    if (!table || !isValidTable) {
      alert('Nomor meja valid diperlukan untuk memesan. Silakan pindai kode QR dari meja Anda.');
      return;
    }

    try {
      // Create order with table number, cart items, customer name, and payment type
      const order = createOrder(table.tableNumber, cartItems, customerName, paymentType);
      
      // Clear cart after successful order
      clearCart();
      
      // Close modal if open
      setIsModalOpen(false);
      
      // Navigate to confirmation page
      router.push(`/confirmation?orderId=${order.id}&table=${table.tableNumber}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Gagal melakukan pemesanan. Silakan coba lagi.');
    }
  };

  // Prevent hydration mismatch - don't render until mounted
  if (!isMounted) {
    return (
      <div className="hidden lg:block bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="text-gray-300 mb-4">
          <svg 
            className="w-16 h-16 mx-auto" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Keranjang Anda kosong</h3>
        <p className="text-gray-600 text-sm">Tambahkan item dari menu untuk memulai</p>
      </div>
    );
  }

  // Show empty cart message when no items (desktop only)
  if (cartItems.length === 0) {
    return (
      <div className="hidden lg:block bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="text-gray-300 mb-4">
          <svg 
            className="w-16 h-16 mx-auto" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Keranjang Anda kosong</h3>
        <p className="text-gray-600 text-sm">Tambahkan item dari menu untuk memulai</p>
      </div>
    );
  }

  const total = getTotal();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Mobile: Floating Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-gray-900 shadow-2xl safe-area-bottom">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="bg-gray-900 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              {itemCount}
            </div>
            <div className="text-left">
              <p className="text-base font-bold text-gray-900">Lihat Keranjang</p>
              <p className="text-sm text-gray-600">{itemCount} item</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                Rp {total.toLocaleString('id-ID')}
              </p>
            </div>
            <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Mobile: Full Screen Modal */}
      {isModalOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white flex flex-col">
          {/* Modal Header */}
          <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Keranjang Saya</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-hidden">
            <CartContent
              cartItems={cartItems}
              customerName={customerName}
              setCustomerName={setCustomerName}
              updateNotes={updateNotes}
              handleQuantityIncrease={handleQuantityIncrease}
              handleQuantityDecrease={handleQuantityDecrease}
              handleRemoveItem={handleRemoveItem}
              paymentType={paymentType}
              setPaymentType={setPaymentType}
              total={total}
              isValidTable={isValidTable}
              handlePlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      )}

      {/* Desktop: Regular Cart */}
      <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Keranjang Anda</h2>
          <p className="text-sm text-gray-600 mt-1">
            {itemCount} item
          </p>
        </div>
        <CartContent
          cartItems={cartItems}
          customerName={customerName}
          setCustomerName={setCustomerName}
          updateNotes={updateNotes}
          handleQuantityIncrease={handleQuantityIncrease}
          handleQuantityDecrease={handleQuantityDecrease}
          handleRemoveItem={handleRemoveItem}
          paymentType={paymentType}
          setPaymentType={setPaymentType}
          total={total}
          isValidTable={isValidTable}
          handlePlaceOrder={handlePlaceOrder}
        />
      </div>
    </>
  );
}
