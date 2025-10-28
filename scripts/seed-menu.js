// Seeder script untuk populate menu items ke Supabase
// Run dengan: node scripts/seed-menu.js

const menuData = [
  // Appetizers (10 items)
  {
    name: 'Spring Rolls',
    description: 'Crispy vegetable spring rolls served with sweet chili sauce',
    price: 45000,
    category: 'Appetizers',
    imageUrl: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400',
    available: true,
  },
  {
    name: 'Chicken Wings',
    description: 'Spicy buffalo wings with ranch dipping sauce',
    price: 55000,
    category: 'Appetizers',
    imageUrl: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400',
    available: true,
  },
  {
    name: 'Mozzarella Sticks',
    description: 'Golden fried mozzarella with marinara sauce',
    price: 50000,
    category: 'Appetizers',
    imageUrl: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=400',
    available: true,
  },
  {
    name: 'Calamari Rings',
    description: 'Crispy fried calamari with lemon aioli',
    price: 65000,
    category: 'Appetizers',
    imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400',
    available: true,
  },
  {
    name: 'Bruschetta',
    description: 'Toasted bread with tomato, basil, and olive oil',
    price: 40000,
    category: 'Appetizers',
    imageUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400',
    available: true,
  },
  {
    name: 'Nachos Supreme',
    description: 'Tortilla chips with cheese, jalapeños, and sour cream',
    price: 60000,
    category: 'Appetizers',
    imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400',
    available: true,
  },
  {
    name: 'Garlic Bread',
    description: 'Toasted bread with garlic butter and herbs',
    price: 35000,
    category: 'Appetizers',
    imageUrl: 'https://images.unsplash.com/photo-1573140401552-388e7e2f0f05?w=400',
    available: true,
  },
  {
    name: 'Onion Rings',
    description: 'Crispy battered onion rings with dipping sauce',
    price: 42000,
    category: 'Appetizers',
    imageUrl: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400',
    available: true,
  },
  {
    name: 'Chicken Satay',
    description: 'Grilled chicken skewers with peanut sauce',
    price: 58000,
    category: 'Appetizers',
    imageUrl: 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=400',
    available: true,
  },
  {
    name: 'Edamame',
    description: 'Steamed soybeans with sea salt',
    price: 38000,
    category: 'Appetizers',
    imageUrl: 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=400',
    available: true,
  },

  // Main Course (15 items)
  {
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, and special sauce',
    price: 85000,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    available: true,
  },
  {
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with lemon butter and vegetables',
    price: 150000,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    available: true,
  },
  {
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh mozzarella, basil, and tomato sauce',
    price: 95000,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    available: true,
  },
  {
    name: 'Chicken Alfredo',
    description: 'Creamy fettuccine pasta with grilled chicken',
    price: 105000,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400',
    available: true,
  },
  {
    name: 'Steak & Fries',
    description: 'Premium ribeye steak with crispy french fries',
    price: 250000,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400',
    available: true,
  },
  {
    name: 'Nasi Goreng Special',
    description: 'Indonesian fried rice with chicken, egg, and vegetables',
    price: 55000,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
    available: true,
  },
  {
    name: 'Spaghetti Carbonara',
    description: 'Creamy pasta with bacon and parmesan',
    price: 95000,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
    available: true,
  },
  {
    name: 'Fish & Chips',
    description: 'Battered fish fillet with crispy fries and tartar sauce',
    price: 88000,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=400',
    available: true,
  },
  {
    name: 'Chicken Teriyaki',
    description: 'Grilled chicken with teriyaki glaze and steamed rice',
    price: 78000,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400',
    available: true,
  },
  {
    name: 'Beef Rendang',
    description: 'Slow-cooked beef in rich coconut curry',
    price: 120000,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400',
    available: true,
  },
  {
    name: 'Pepperoni Pizza',
    description: 'Classic pizza loaded with pepperoni and mozzarella',
    price: 105000,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
    available: true,
  },
  {
    name: 'Pad Thai',
    description: 'Thai stir-fried noodles with shrimp and peanuts',
    price: 75000,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400',
    available: true,
  },
  {
    name: 'Lamb Chops',
    description: 'Grilled lamb chops with mint sauce and vegetables',
    price: 180000,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1595777216528-071e0127ccbf?w=400',
    available: true,
  },
  {
    name: 'Chicken Parmesan',
    description: 'Breaded chicken with marinara and melted cheese',
    price: 98000,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400',
    available: true,
  },
  {
    name: 'Sushi Platter',
    description: 'Assorted fresh sushi and sashimi',
    price: 165000,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    available: true,
  },

  // Desserts (8 items)
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center and vanilla ice cream',
    price: 55000,
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400',
    available: true,
  },
  {
    name: 'Cheesecake',
    description: 'New York style cheesecake with berry compote',
    price: 45000,
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=400',
    available: true,
  },
  {
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee and mascarpone',
    price: 50000,
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
    available: true,
  },
  {
    name: 'Ice Cream Sundae',
    description: 'Three scoops with chocolate sauce and toppings',
    price: 42000,
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
    available: true,
  },
  {
    name: 'Panna Cotta',
    description: 'Italian cream dessert with berry sauce',
    price: 48000,
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
    available: true,
  },
  {
    name: 'Apple Pie',
    description: 'Warm apple pie with vanilla ice cream',
    price: 52000,
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400',
    available: true,
  },
  {
    name: 'Brownies',
    description: 'Fudgy chocolate brownies with nuts',
    price: 38000,
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400',
    available: true,
  },
  {
    name: 'Crème Brûlée',
    description: 'Classic French custard with caramelized sugar',
    price: 58000,
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400',
    available: true,
  },

  // Beverages (12 items)
  {
    name: 'Fresh Lemonade',
    description: 'Homemade lemonade with fresh lemons',
    price: 25000,
    category: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9d?w=400',
    available: true,
  },
  {
    name: 'Iced Coffee',
    description: 'Cold brew coffee served over ice',
    price: 30000,
    category: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400',
    available: true,
  },
  {
    name: 'Berry Smoothie',
    description: 'Mixed berry smoothie with yogurt',
    price: 40000,
    category: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400',
    available: true,
  },
  {
    name: 'Soft Drink',
    description: 'Choice of cola, sprite, or orange soda',
    price: 20000,
    category: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400',
    available: true,
  },
  {
    name: 'Cappuccino',
    description: 'Espresso with steamed milk and foam',
    price: 35000,
    category: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
    available: true,
  },
  {
    name: 'Green Tea',
    description: 'Hot or iced Japanese green tea',
    price: 28000,
    category: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400',
    available: true,
  },
  {
    name: 'Mango Juice',
    description: 'Fresh mango juice',
    price: 32000,
    category: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400',
    available: true,
  },
  {
    name: 'Milkshake',
    description: 'Chocolate, vanilla, or strawberry',
    price: 45000,
    category: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400',
    available: true,
  },
  {
    name: 'Mineral Water',
    description: 'Still or sparkling',
    price: 15000,
    category: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
    available: true,
  },
  {
    name: 'Orange Juice',
    description: 'Freshly squeezed orange juice',
    price: 30000,
    category: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
    available: true,
  },
  {
    name: 'Hot Chocolate',
    description: 'Rich hot chocolate with whipped cream',
    price: 38000,
    category: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1542990253-a781e04c0082?w=400',
    available: true,
  },
  {
    name: 'Mojito Mocktail',
    description: 'Refreshing mint and lime mocktail',
    price: 42000,
    category: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400',
    available: true,
  },
];

console.log('='.repeat(50));
console.log('MENU SEEDER DATA');
console.log('='.repeat(50));
console.log(`Total items: ${menuData.length}`);
console.log('\nBreakdown by category:');
console.log(`- Appetizers: ${menuData.filter(i => i.category === 'Appetizers').length}`);
console.log(`- Main Course: ${menuData.filter(i => i.category === 'Main Course').length}`);
console.log(`- Desserts: ${menuData.filter(i => i.category === 'Desserts').length}`);
console.log(`- Beverages: ${menuData.filter(i => i.category === 'Beverages').length}`);
console.log('\n' + '='.repeat(50));
console.log('\nCopy this data and paste into Supabase SQL Editor:');
console.log('='.repeat(50));
console.log('\n');

// Generate SQL INSERT statements
const sqlStatements = menuData.map(item => {
  return `INSERT INTO menu_items (name, description, price, category, "imageUrl", available)
VALUES ('${item.name.replace(/'/g, "''")}', '${item.description.replace(/'/g, "''")}', ${item.price}, '${item.category}', '${item.imageUrl}', ${item.available});`;
}).join('\n');

console.log(sqlStatements);
console.log('\n' + '='.repeat(50));
console.log('Copy the SQL above and run in Supabase SQL Editor!');
console.log('='.repeat(50));
