'use client';

import Link from "next/link";
import QRCodeDisplay from "@/components/common/QRCodeDisplay";
import { useApp } from "@/context/AppContext";

export default function Home() {
  const { tables } = useApp();
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Quick Access Cards */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Akses Cepat</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/admin"
                className="group bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-gray-900">
                    Admin
                  </h3>
                  <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  Kelola meja dan menu
                </p>
              </Link>

              <Link
                href={tables.length > 0 ? `/menu/${tables[0].slug}` : "/menu"}
                className="group bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-gray-900">
                    Menu Pelanggan
                  </h3>
                  <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  Lihat menu dan pesan
                </p>
              </Link>

              <Link
                href="/cashier"
                className="group bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-gray-900">
                    Kasir
                  </h3>
                  <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  Lihat dan kelola pesanan
                </p>
              </Link>
            </div>
          </div>

          {/* QR Codes Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Demo QR Codes</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-600 mb-6 text-center text-sm">
                Scan these QR codes to test the customer ordering interface
              </p>
              <div className="flex flex-wrap justify-center gap-8">
                {tables.slice(0, 3).map(table => (
                  <QRCodeDisplay key={table.id} table={table} />
                ))}
              </div>
            </div>
          </div>

          {/* System Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* How It Works */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                How It Works
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-gray-900 text-white rounded-full font-semibold text-xs">
                    1
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">
                      <strong className="text-gray-900">Admin</strong> creates tables and manages menu
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-gray-900 text-white rounded-full font-semibold text-xs">
                    2
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">
                      <strong className="text-gray-900">Customer</strong> scans QR code and places order
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-gray-900 text-white rounded-full font-semibold text-xs">
                    3
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">
                      <strong className="text-gray-900">Cashier</strong> processes orders in real-time
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Key Features
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">QR code-based ordering</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">Real-time order management</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">Menu and table management</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">Mobile-friendly interface</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Note */}
          <div className="mt-8 bg-gray-100 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-700 text-center">
              <strong className="text-gray-900">Demo Mode:</strong> All data is stored in memory and will reset on page refresh
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
