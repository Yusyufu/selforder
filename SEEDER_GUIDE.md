# Menu Seeder Guide

## 📊 Data Overview

Seeder ini akan menambahkan **45 menu items** ke database Supabase:

- **Appetizers**: 10 items
- **Main Course**: 15 items  
- **Desserts**: 8 items
- **Beverages**: 12 items

## 🚀 Cara Menggunakan Seeder

### Option 1: Via SQL File (Recommended)

1. **Generate SQL:**
   ```bash
   node scripts/seed-menu.js > seed-output.sql
   ```

2. **Buka Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/dcmqtjbpowszjenwluxb/sql/new

3. **Copy & Paste:**
   - Buka file `seed-output.sql`
   - Copy semua SQL statements
   - Paste di SQL Editor
   - Klik **Run**

4. **Verify:**
   - Go to Table Editor → `menu_items`
   - Should see 45+ items

### Option 2: Via Console Output

1. **Run seeder:**
   ```bash
   node scripts/seed-menu.js
   ```

2. **Copy output SQL:**
   - Terminal akan print SQL statements
   - Copy semua dari `INSERT INTO...` sampai akhir

3. **Paste di Supabase SQL Editor**

4. **Run**

## 📋 Sample Data Included

### Appetizers (10)
- Spring Rolls - Rp 45,000
- Chicken Wings - Rp 55,000
- Mozzarella Sticks - Rp 50,000
- Calamari Rings - Rp 65,000
- Bruschetta - Rp 40,000
- Nachos Supreme - Rp 60,000
- Garlic Bread - Rp 35,000
- Onion Rings - Rp 42,000
- Chicken Satay - Rp 58,000
- Edamame - Rp 38,000

### Main Course (15)
- Classic Burger - Rp 85,000
- Grilled Salmon - Rp 150,000
- Margherita Pizza - Rp 95,000
- Chicken Alfredo - Rp 105,000
- Steak & Fries - Rp 250,000
- Nasi Goreng Special - Rp 55,000
- Spaghetti Carbonara - Rp 95,000
- Fish & Chips - Rp 88,000
- Chicken Teriyaki - Rp 78,000
- Beef Rendang - Rp 120,000
- Pepperoni Pizza - Rp 105,000
- Pad Thai - Rp 75,000
- Lamb Chops - Rp 180,000
- Chicken Parmesan - Rp 98,000
- Sushi Platter - Rp 165,000

### Desserts (8)
- Chocolate Lava Cake - Rp 55,000
- Cheesecake - Rp 45,000
- Tiramisu - Rp 50,000
- Ice Cream Sundae - Rp 42,000
- Panna Cotta - Rp 48,000
- Apple Pie - Rp 52,000
- Brownies - Rp 38,000
- Crème Brûlée - Rp 58,000

### Beverages (12)
- Fresh Lemonade - Rp 25,000
- Iced Coffee - Rp 30,000
- Berry Smoothie - Rp 40,000
- Soft Drink - Rp 20,000
- Cappuccino - Rp 35,000
- Green Tea - Rp 28,000
- Mango Juice - Rp 32,000
- Milkshake - Rp 45,000
- Mineral Water - Rp 15,000
- Orange Juice - Rp 30,000
- Hot Chocolate - Rp 38,000
- Mojito Mocktail - Rp 42,000

## ✨ Features

- ✅ Real product names
- ✅ Detailed descriptions
- ✅ Realistic prices (Rp 15,000 - Rp 250,000)
- ✅ High-quality Unsplash images
- ✅ All items available by default
- ✅ Organized by category

## 🔄 Reset Database (Optional)

Jika ingin hapus semua menu dan mulai dari awal:

```sql
-- Delete all menu items
DELETE FROM menu_items;

-- Reset auto-increment (optional)
ALTER SEQUENCE menu_items_id_seq RESTART WITH 1;
```

Then run seeder again.

## 🎯 Testing

After seeding:

1. **Go to menu page:** `/menu/[slug]`
2. **Test search:** Ketik "burger", "pizza", "coffee"
3. **Test filter:** Click category buttons
4. **Test cart:** Add items and checkout

## 📝 Notes

- Seeder menggunakan Unsplash images (free & high quality)
- Semua harga dalam Rupiah
- Descriptions dalam English (bisa di-edit manual)
- UUID auto-generated oleh Supabase

## 🚨 Troubleshooting

### Error: duplicate key value
- Menu items sudah ada di database
- Run DELETE query dulu, atau skip duplicate items

### Error: relation "menu_items" does not exist
- Table belum dibuat
- Run `supabase-schema.sql` dulu

### Images tidak muncul
- Check internet connection
- Unsplash images mungkin di-block
- Bisa replace dengan URL lain
