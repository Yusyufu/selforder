'use client';

import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

export default function QRCodeDisplay({ table, showLabel = true }) {
  const [url, setUrl] = useState(`/menu/${table.slug}`);

  useEffect(() => {
    setUrl(`${window.location.origin}/menu/${table.slug}`);
  }, [table.slug]);

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
        <QRCode value={url} size={120} />
      </div>
      {showLabel && (
        <p className="mt-2 text-sm font-medium text-gray-700">
          Table {table.tableNumber}
        </p>
      )}
    </div>
  );
}
