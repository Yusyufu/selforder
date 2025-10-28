'use client';

import MenuDisplay from '@/components/customer/MenuDisplay';
import Cart from '@/components/customer/Cart';
import ActiveOrders from '@/components/customer/ActiveOrders';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';

export const dynamic = 'force-dynamic';

export default function MenuSlugPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { tables, initialized } = useApp();
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTableSelector, setShowTableSelector] = useState(false);

  // Find table by slug
  const table = tables.find((t: any) => t.slug === slug);
  const isValidTable = !!table;
  
  // Show loading while context is initializing OR tables are empty
  const isLoading = !initialized || tables.length === 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Customer Header - Enhanced with search and table selector */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3">
          {/* Top Row: Logo and Table */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Luxa Sky Lounge
              </h1>
              {isValidTable && (
                <button
                  onClick={() => setShowTableSelector(!showTableSelector)}
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mt-1 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Meja {table.tableNumber}
                  <svg className={`w-4 h-4 transition-transform ${showTableSelector ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 bg-gray-50 text-gray-900 placeholder-gray-500 text-sm"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Table Selector Dropdown */}
          {showTableSelector && isValidTable && (
            <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-60 overflow-y-auto">
              <p className="text-xs font-semibold text-gray-600 mb-2">Pindah ke meja lain:</p>
              <div className="grid grid-cols-4 gap-2">
                {tables.filter((t: any) => t.status === 'available').map((t: any) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      router.push(`/menu/${t.slug}`);
                      setShowTableSelector(false);
                    }}
                    className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                      t.id === table?.id
                        ? 'bg-gray-900 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-900'
                    }`}
                  >
                    {t.tableNumber}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto max-w-7xl py-6 md:py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat menu...</p>
            </div>
          </div>
        )}

        {/* Alerts */}
        {!isLoading && (
          <div className="mb-6 px-4 md:px-0">
            {!isValidTable && (
              <div className="bg-red-50 border border-red-200 text-red-900 px-5 py-4 rounded-lg">
                <p className="font-semibold">
                  Link tidak valid
                </p>
                <p className="text-sm mt-1">Link QR code ini tidak valid atau sudah tidak aktif. Silakan pindai kode QR yang valid dari meja Anda.</p>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        {!isLoading && isValidTable && (
          <div className="px-4 md:px-0">
            {!showMenu ? (
              /* Show Active Orders First */
              <ActiveOrders 
                tableNumber={table.tableNumber}
                onAddMore={() => setShowMenu(true)}
              />
            ) : (
              /* Show Menu and Cart */
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
            )}
          </div>
        )}
        
        {/* Invalid Table - Show Menu Anyway */}
        {!isLoading && !isValidTable && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 px-4 md:px-0">
            <div className="lg:col-span-2">
              <MenuDisplay table={table} isValidTable={isValidTable} searchQuery={searchQuery} />
            </div>
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-6">
                <Cart table={table} isValidTable={isValidTable} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
