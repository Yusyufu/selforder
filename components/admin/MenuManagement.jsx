'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';

export default function MenuManagement() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    available: true,
  });
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Categories for the dropdown
  const categories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages'];

  // Group menu items by category
  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: 'Please select an image file' });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: 'Image size must be less than 5MB' });
        return;
      }

      setImageFile(file);
      setErrors({ ...errors, image: '' });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Supabase Storage
  const uploadImage = async () => {
    if (!imageFile) return formData.imageUrl;

    setUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `menu/${fileName}`;

      const { data, error } = await supabase.storage
        .from('menu-images')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrors({ ...errors, image: 'Failed to upload image' });
      return formData.imageUrl;
    } finally {
      setUploading(false);
    }
  };

  // Validate menu item form
  const validateMenuForm = () => {
    const newErrors = {};

    // Validate name
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Name is required';
    }

    // Validate price
    if (!formData.price || formData.price === '') {
      newErrors.price = 'Price is required';
    } else {
      const priceValue = parseFloat(formData.price);
      if (isNaN(priceValue)) {
        newErrors.price = 'Price must be a valid number';
      } else if (priceValue <= 0) {
        newErrors.price = 'Price must be greater than 0';
      } else if (priceValue > 10000000) {
        newErrors.price = 'Price must be less than Rp 10,000,000';
      }
    }

    // Validate category
    if (!formData.category || formData.category === '') {
      newErrors.category = 'Category is required';
    }

    // Image validation handled in handleImageChange
    // No URL validation needed anymore
    if (false) {
      try {
        new URL(formData.imageUrl);
      } catch {
        newErrors.imageUrl = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle create menu item form submission
  const handleCreate = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateMenuForm()) {
      return;
    }

    try {
      // Upload image first if there's a file
      const imageUrl = await uploadImage();

      addMenuItem({
        ...formData,
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        imageUrl: imageUrl || '',
      });
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: '',
        available: true,
      });
      setImageFile(null);
      setImagePreview(null);
      setIsCreating(false);
    } catch (err) {
      setErrors({ general: err.message });
    }
  };

  // Handle edit menu item form submission
  const handleEdit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateMenuForm()) {
      return;
    }

    try {
      // Upload new image if file selected
      const imageUrl = await uploadImage();

      updateMenuItem(editingId, {
        ...formData,
        name: formData.name.trim(),
        imageUrl: imageUrl || formData.imageUrl,
        price: parseFloat(formData.price),
      });
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: '',
        available: true,
      });
    } catch (err) {
      setErrors({ general: err.message });
    }
  };

  // Handle delete with confirmation
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMenuItem(id);
    }
  };

  // Start editing a menu item
  const startEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      imageUrl: item.imageUrl,
      available: item.available,
    });
    setImageFile(null);
    setImagePreview(null); // Will show existing imageUrl instead
    setIsCreating(false);
    setErrors({});
  };

  // Cancel editing or creating
  const cancelForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      imageUrl: '',
      available: true,
    });
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Menu Management</h2>
        {!isCreating && !editingId && (
          <button
            onClick={() => setIsCreating(true)}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold w-full sm:w-auto"
          >
            Create Menu Item
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
            {isCreating ? 'Create New Menu Item' : 'Edit Menu Item'}
          </h3>
          <form onSubmit={isCreating ? handleCreate : handleEdit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) {
                      setErrors({ ...errors, name: '' });
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.name 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-black focus:border-black'
                  }`}
                  placeholder="e.g., Grilled Salmon"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-2 font-medium">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">
                  Price (IDR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="1000"
                  value={formData.price}
                  onChange={(e) => {
                    setFormData({ ...formData, price: e.target.value });
                    if (errors.price) {
                      setErrors({ ...errors, price: '' });
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.price 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-black focus:border-black'
                  }`}
                  placeholder="e.g., 150000"
                />
                {errors.price && (
                  <p className="text-red-600 text-sm mt-2 font-medium">{errors.price}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
                rows="3"
                placeholder="Optional description of the menu item"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    setFormData({ ...formData, category: e.target.value });
                    if (errors.category) {
                      setErrors({ ...errors, category: '' });
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.category 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-black focus:border-black'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-600 text-sm mt-2 font-medium">{errors.category}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Image</label>
                
                {/* Image Preview */}
                {(imagePreview || formData.imageUrl) && (
                  <div className="mb-3">
                    <img 
                      src={imagePreview || formData.imageUrl} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                  </div>
                )}
                
                {/* File Upload */}
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 transition-colors font-semibold text-sm">
                      {uploading ? 'Uploading...' : 'Choose Image'}
                    </div>
                  </label>
                  {imageFile && (
                    <span className="text-sm text-gray-600">{imageFile.name}</span>
                  )}
                </div>
                
                {errors.image && (
                  <p className="text-red-600 text-sm mt-2 font-medium">{errors.image}</p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="available"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="w-5 h-5 text-black rounded focus:ring-2 focus:ring-black"
              />
              <label htmlFor="available" className="ml-3 text-sm font-semibold text-gray-900">
                Available
              </label>
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

      {/* Menu Items Display - Responsive card layout */}
      {menuItems.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl">
          <p className="text-lg">No menu items created yet. Click "Create Menu Item" to add your first item.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((category) => {
            const items = groupedItems[category];
            if (!items || items.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">{category}</h3>
                <div className="grid grid-cols-1 gap-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start gap-5"
                    >
                      {/* Item Image */}
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full sm:w-28 h-28 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                          <div className="flex-1">
                            <h4 className="text-lg md:text-xl font-bold text-gray-900">{item.name}</h4>
                            {item.description && (
                              <p className="text-gray-600 text-sm mt-2">{item.description}</p>
                            )}
                            <div className="flex items-center gap-4 mt-3">
                              <span className="text-xl font-bold text-gray-900">
                                Rp {item.price.toLocaleString('id-ID')}
                              </span>
                              <span className="text-sm text-gray-500 font-medium">{item.category}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              onClick={() => toggleAvailability(item.id)}
                              className={`px-4 py-2 text-xs rounded-full font-semibold transition-colors ${
                                item.available
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              {item.available ? 'Available' : 'Unavailable'}
                            </button>
                            <button
                              onClick={() => startEdit(item)}
                              className="text-gray-600 hover:text-black text-sm font-semibold transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, item.name)}
                              className="text-red-600 hover:text-red-700 text-sm font-semibold transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
