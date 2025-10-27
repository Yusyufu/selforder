'use client';

import MenuDisplay from '@/components/customer/MenuDisplay';
import Cart from '@/components/customer/Cart';
import ActiveOrders from '@/components/customer/ActiveOrders';
import { useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';

export const dynamic = 'force-dynamic';

export default function MenuSlugPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { tables, initialized } = useApp();
  const [showMenu, setShowMenu] = useState(false);

  // Find table by slug
  const table = tables.find((t: any) => t.slug === slug);
  const isValidTable = !!table;
  
  // Show loading while context is initializing OR tables are empty
  const isLoading = !initialized || tables.length === 0;

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
              {isValidTable && (
                <p className="text-sm text-gray-600 mt-1">
                  Meja {table.tableNumber}
                </p>
              )}
            </div>
          </div>
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
                  <MenuDisplay table={table} isValidTable={isValidTable} />
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
              <MenuDisplay table={table} isValidTable={isValidTable} />
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
