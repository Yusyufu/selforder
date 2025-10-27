'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import QRCode from 'react-qr-code';

export default function TableManagement() {
  const { tables, addTable, updateTable, deleteTable } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ tableNumber: '', status: 'available' });
  const [errors, setErrors] = useState({});

  // Validate table form
  const validateTableForm = () => {
    const newErrors = {};

    // Validate table number is not empty
    if (!formData.tableNumber || formData.tableNumber.trim() === '') {
      newErrors.tableNumber = 'Table number is required';
    }

    // Validate table number is unique
    const isDuplicate = tables.some(
      table => table.tableNumber === formData.tableNumber && table.id !== editingId
    );
    if (isDuplicate) {
      newErrors.tableNumber = 'Table number already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle create table form submission
  const handleCreate = (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateTableForm()) {
      return;
    }

    try {
      addTable(formData.tableNumber.trim());
      setFormData({ tableNumber: '', status: 'available' });
      setIsCreating(false);
    } catch (err) {
      setErrors({ general: err.message });
    }
  };

  // Handle edit table form submission
  const handleEdit = (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateTableForm()) {
      return;
    }

    try {
      updateTable(editingId, { ...formData, tableNumber: formData.tableNumber.trim() });
      setEditingId(null);
      setFormData({ tableNumber: '', status: 'available' });
    } catch (err) {
      setErrors({ general: err.message });
    }
  };

  // Handle delete with confirmation
  const handleDelete = (id, tableNumber) => {
    if (window.confirm(`Are you sure you want to delete Table ${tableNumber}?`)) {
      deleteTable(id);
    }
  };

  // Start editing a table
  const startEdit = (table) => {
    setEditingId(table.id);
    setFormData({ tableNumber: table.tableNumber, status: table.status });
    setIsCreating(false);
    setErrors({});
  };

  // Cancel editing or creating
  const cancelForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ tableNumber: '', status: 'available' });
    setErrors({});
  };

  // Download QR code as PNG
  const downloadQRCode = (slug, tableNumber) => {
    const svg = document.getElementById(`qr-${slug}`);
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `table-${tableNumber}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Table Management</h2>
        {!isCreating && !editingId && (
          <button
            onClick={() => setIsCreating(true)}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold w-full sm:w-auto"
          >
            Create Table
          </button>
        )}
      </div>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {errors.general}
        </div>
      )}

      {/* Create/Edit Form - MVP Kafe style */}
      {(isCreating || editingId) && (
        <div className="bg-gray-50 p-5 md:p-6 rounded-xl mb-6 border border-gray-200">
          <h3 className="text-lg md:text-xl font-bold mb-5 text-gray-900">
            {isCreating ? 'Create New Table' : 'Edit Table'}
          </h3>
          <form onSubmit={isCreating ? handleCreate : handleEdit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900">
                Table Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.tableNumber}
                onChange={(e) => {
                  setFormData({ ...formData, tableNumber: e.target.value });
                  if (errors.tableNumber) {
                    setErrors({ ...errors, tableNumber: '' });
                  }
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.tableNumber 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-black focus:border-black'
                }`}
                placeholder="e.g., 1, A1, Table 5"
              />
              {errors.tableNumber && (
                <p className="text-red-600 text-sm mt-2 font-medium">{errors.tableNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
              >
                {isCreating ? 'Create' : 'Update'}
              </button>
              <button
                type="button"
                onClick={cancelForm}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tables Grid - Responsive */}
      {tables.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl">
          <p className="text-lg">No tables created yet. Click "Create Table" to add your first table.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {tables.map((table) => (
            <div key={table.id} className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Table {table.tableNumber}</h3>
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mt-2 ${
                      table.status === 'available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {table.status}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => startEdit(table)}
                    className="text-gray-600 hover:text-black text-sm font-semibold transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(table.id, table.tableNumber)}
                    className="text-red-600 hover:text-red-700 text-sm font-semibold transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Slug Info */}
              <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-1">Secure Link:</p>
                <p className="text-xs text-gray-700 font-mono break-all">
                  /menu/{table.slug}
                </p>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/menu/${table.slug}`;
                    navigator.clipboard.writeText(url);
                    alert('Link copied to clipboard!');
                  }}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Copy Link
                </button>
              </div>

              {/* QR Code - Responsive sizing */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 flex justify-center">
                <QRCode
                  id={`qr-${table.slug}`}
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/menu/${table.slug}`}
                  size={150}
                />
              </div>

              <button
                onClick={() => downloadQRCode(table.slug, table.tableNumber)}
                className="w-full bg-gray-100 text-gray-900 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
              >
                Download QR Code
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
