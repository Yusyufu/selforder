'use client';

import MenuDisplay from '@/components/customer/MenuDisplay';
import Cart from '@/components/customer/Cart';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Suspense, useState } from 'react';

function MenuContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tableNumber = searchParams.get('table');
  const { tables } = useApp();
  const [selectedTable, setSelectedTable] = useState(tableNumber || '');
  const [searchQuery, setSearchQuery] = useState('');

  // Find table by table number (backward compatibility)
  const table = tableNumber ? tables.find((t: any) => t.tableNumber === tableNumber) : null;
  const isValidTable = !!table;
  const hasTableNumber = tableNumber && tableNumber.trim() !== '';

  // Handle table selection
  const handleTableSelect = (tableNum: string) => {
    setSelectedTable(tableNum);
    if (tableNum) {
      router.push(`/menu?table=${tableNum}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Customer Header - No sidebar for customer view */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Luxa Sky Lounge
              </h1>
              {isValidTable && table && (
                <p className="text-sm text-gray-600 mt-1">
                  Meja {table.tableNumber}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl py-6 md:py-8">
        {/* Search and Table Selector */}
        <div className="mb-6 px-4 md:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Bar */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Cari Menu
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari nama menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 bg-white text-gray-900"
                />
                <svg 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Table Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Pilih Meja
              </label>
              <select
                value={selectedTable}
                onChange={(e) => handleTableSelect(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 bg-white text-gray-900"
              >
                <option value="">-- Pilih Meja --</option>
                {tables
                  .sort((a: any, b: any) => {
                    const numA = parseInt(a.tableNumber) || 0;
                    const numB = parseInt(b.tableNumber) || 0;
                    return numA - numB;
                  })
                  .map((t: any) => (
                    <option key={t.id} value={t.tableNumber}>
                      Meja {t.tableNumber} ({t.status === 'available' ? 'Tersedia' : 'Terisi'})
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="mb-6 px-4 md:px-0">
          {!hasTableNumber && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 px-5 py-4 rounded-lg">
              <p className="font-semibold">
                Nomor meja tidak ditentukan
              </p>
              <p className="text-sm mt-1">Silakan pilih meja dari dropdown di atas atau pindai kode QR dari meja Anda.</p>
            </div>
          )}
          {hasTableNumber && !isValidTable && (
            <div className="bg-red-50 border border-red-200 text-red-900 px-5 py-4 rounded-lg">
              <p className="font-semibold">
                Nomor meja tidak valid: {tableNumber}
              </p>
              <p className="text-sm mt-1">Meja ini tidak ada. Silakan pilih meja yang valid dari dropdown di atas.</p>
            </div>
          )}
        </div>

        {/* Two Column Layout: Menu and Cart - Mobile-first responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Menu Display - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <MenuDisplay table={table} isValidTable={isValidTable} searchQuery={searchQuery} />
          </div>

          {/* Cart - Takes 1 column on large screens, sticky on desktop */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6">
              <Cart table={table} isValidTable={isValidTable} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <MenuContent />
    </Suspense>
  );
}
