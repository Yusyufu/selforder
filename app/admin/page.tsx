'use client';

import { useState } from 'react';
import TableManagement from '@/components/admin/TableManagement';
import MenuManagement from '@/components/admin/MenuManagement';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('tables');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 md:p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Admin Dashboard
        </h1>
        
        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('tables')}
                className={`px-6 md:px-8 py-3 font-semibold transition-all text-sm ${
                  activeTab === 'tables'
                    ? 'border-b-2 border-gray-900 text-gray-900 bg-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Tables
              </button>
              <button
                onClick={() => setActiveTab('menu')}
                className={`px-6 md:px-8 py-3 font-semibold transition-all text-sm ${
                  activeTab === 'menu'
                    ? 'border-b-2 border-gray-900 text-gray-900 bg-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Menu
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'tables' && <TableManagement />}
            {activeTab === 'menu' && <MenuManagement />}
          </div>
        </div>
      </div>
    </div>
  );
}
