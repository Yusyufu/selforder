# Table Self-Ordering System

A modern web-based self-ordering system that enables restaurant customers to scan QR codes at their tables and place orders directly from their mobile devices. The system includes three core interfaces: Admin Dashboard for managing tables and menus, Customer Menu Interface for browsing and ordering, and Cashier Dashboard for viewing and processing incoming orders.

## Features

- **Secure QR Code-Based Ordering**: Automatically generate unique, non-guessable slug URLs for each table
- **Table Management**: Create, edit, and delete tables with real-time QR code generation
- **Menu Management**: Manage menu items with categories, prices, images, and availability
- **Customer Ordering**: Mobile-optimized menu interface with floating cart modal and custom notes
- **Order Processing**: Real-time order dashboard for cashiers with status tracking
- **Responsive Design**: Optimized for mobile devices (customer interface) and desktop (admin/cashier)
- **Category Filtering**: Easy menu navigation with sticky category filter buttons
- **Payment Methods**: Support for QRIS and Cash payment options
- **Customer Names**: Optional customer name collection for personalized service
- **Persistent Storage**: LocalStorage-based data persistence (survives page refresh)

## Technology Stack

- **Framework**: Next.js 16.0.0 (App Router)
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **QR Code Generation**: react-qr-code
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository or navigate to the project directory:

```bash
cd table-self-ordering-system
```

2. Install dependencies:

```bash
npm install
```

### Running the Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

The application will automatically reload when you make changes to the code.

### Building for Production

Create an optimized production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Application Interfaces

The system consists of three main interfaces accessible through different routes:

### 1. Admin Dashboard (`/admin`)

The admin interface allows restaurant managers to manage tables and menu items.

**Features:**
- Create, edit, and delete tables
- Generate and download QR codes for each table
- View table status (available/occupied)
- Create, edit, and delete menu items
- Organize menu items by category
- Toggle item availability
- Upload item images

**Access**: Navigate to `http://localhost:3000/admin`

### 2. Customer Menu Interface (`/menu/{slug}`)

The customer-facing interface where diners browse the menu and place orders.

**Security Note**: Each table has a unique, randomly generated 8-character slug (e.g., `/menu/abc123xy`) that cannot be easily guessed. This prevents customers from accessing other tables' ordering interfaces.

**Features:**
- Browse menu items organized by category
- Filter menu by category with sticky buttons
- View item images, descriptions, and prices (in IDR)
- Add items to cart with quantity selection
- Floating bottom cart bar (mobile) with slide-up modal
- Add custom notes to each item
- Enter customer name (optional)
- Select payment method (QRIS/Cash)
- Add custom notes to individual items (e.g., "no onions", "extra spicy")
- Add order-level notes before checkout
- Review cart with running total
- Submit orders with table number automatically included

**Access**: 
- Scan the QR code from a table (automatically includes table number)
- Or navigate to `http://localhost:3000/menu?table=1` (replace 1 with table number)

### 3. Cashier Dashboard (`/cashier`)

The order management interface for kitchen staff and cashiers.

**Features:**
- View all incoming orders in real-time
- See order details including table number, items, quantities, and custom notes
- View both item-specific notes and order-level notes
- Acknowledge new orders
- Mark orders as processed
- Auto-refresh to display new orders automatically
- Separate sections for pending and completed orders

**Access**: Navigate to `http://localhost:3000/cashier`

## Demo Usage Guide

### Quick Start Demo

1. **Start the application**:
   ```bash
   npm run dev
   ```

2. **Access the home page** at `http://localhost:3000`:
   - You'll see navigation links to all three interfaces
   - Sample QR codes for demo tables are displayed

3. **Set up tables and menu (Admin)**:
   - Navigate to `/admin`
   - The system comes pre-loaded with sample tables (Table 1, 2, 3)
   - Sample menu items are already created across categories
   - Try creating a new table or menu item
   - Download QR codes for tables

4. **Place an order (Customer)**:
   - Scan a QR code or navigate to `/menu?table=1`
   - Browse the menu organized by categories
   - Add items to cart with quantities
   - Add custom notes to items (e.g., "Extra hot", "No ice")
   - Add an order-level note before checkout
   - Submit the order

5. **Process orders (Cashier)**:
   - Navigate to `/cashier`
   - View the order you just placed
   - Click "Acknowledge" to mark the order as seen
   - Click "Mark as Processed" when the order is complete
   - Watch for new orders appearing automatically

### Testing the Complete Flow

1. Open three browser windows/tabs:
   - Tab 1: Admin Dashboard (`/admin`)
   - Tab 2: Customer Menu (`/menu?table=1`)
   - Tab 3: Cashier Dashboard (`/cashier`)

2. In the Admin tab, create a new menu item or modify availability

3. In the Customer tab, refresh to see the changes, add items to cart, and place an order

4. In the Cashier tab, watch the order appear automatically

## Project Structure

```
table-self-ordering-system/
├── app/
│   ├── admin/
│   │   └── page.jsx           # Admin dashboard
│   ├── menu/
│   │   └── page.jsx           # Customer menu interface
│   ├── cashier/
│   │   └── page.jsx           # Cashier order dashboard
│   ├── confirmation/
│   │   └── page.jsx           # Order confirmation page
│   ├── layout.jsx             # Root layout with providers
│   └── page.jsx               # Home page with navigation
├── components/
│   ├── admin/
│   │   ├── TableManagement.jsx    # Table CRUD & QR codes
│   │   └── MenuManagement.jsx     # Menu item CRUD
│   ├── customer/
│   │   ├── MenuDisplay.jsx        # Menu browsing
│   │   └── Cart.jsx               # Shopping cart
│   ├── cashier/
│   │   └── OrderDashboard.jsx     # Order management
│   └── common/
│       └── QRCodeDisplay.jsx      # QR code component
├── context/
│   ├── AppContext.jsx         # Global state (tables, menu, orders)
│   └── CartContext.jsx        # Cart state management
├── package.json
└── README.md
```

## State Management

The application uses React Context API for state management:

- **AppContext**: Manages tables, menu items, and orders
- **CartContext**: Manages shopping cart, customer name, and payment method

All data is stored in localStorage and persists across page refreshes.

## Security Features

### Unique Table Slugs

Each table is assigned a unique, randomly generated 8-character slug when created. This provides several security benefits:

1. **Non-Guessable URLs**: Instead of `/menu?table=1`, URLs use `/menu/abc123xy` format
2. **Prevents Unauthorized Access**: Customers cannot easily guess other tables' URLs
3. **Automatic Generation**: Slugs are generated automatically using `crypto.randomUUID()` principles
4. **Collision Prevention**: System checks for duplicate slugs (extremely unlikely)

### How It Works

```javascript
// When creating a table:
const slug = generateTableSlug(); // e.g., "x7k9m2p4"
const newTable = {
  id: crypto.randomUUID(),
  tableNumber: "5",
  slug: "x7k9m2p4",
  status: "available"
};

// QR Code generates URL:
// https://yourapp.com/menu/x7k9m2p4
```

### Admin Features

- View each table's unique slug in the admin dashboard
- Copy secure link to clipboard
- Download QR codes with embedded slug URLs
- Slugs persist in localStorage

### Backward Compatibility

The old `/menu?table={number}` format still works for backward compatibility, but new tables use the secure slug system.

## Deployment

### Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Visit [vercel.com](https://vercel.com) and sign up/log in

3. Click "New Project" and import your repository

4. Vercel will automatically detect Next.js and configure the build settings

5. Click "Deploy"

Your application will be live in minutes with automatic HTTPS and global CDN.

### Deploy to Other Platforms

The application can be deployed to any platform that supports Next.js:

- **Netlify**: Connect your Git repository and deploy
- **AWS Amplify**: Use the Amplify Console for deployment
- **Docker**: Create a Dockerfile and deploy to any container platform
- **Static Export**: Run `npm run build` and deploy the `out` folder to any static host

### Environment Configuration

This demo application requires no environment variables or external services. All functionality works out of the box.

## Development Notes

- The application is a pure frontend demo with no backend or database
- All data is managed in-memory using React Context
- Data resets on page refresh (suitable for demonstration purposes)
- QR codes are generated client-side in real-time
- The customer interface is optimized for mobile devices
- Admin and cashier interfaces are optimized for desktop/tablet

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

**Issue**: QR codes not displaying
- Solution: Ensure `react-qr-code` is installed: `npm install react-qr-code`

**Issue**: Styles not loading
- Solution: Ensure Tailwind CSS is properly configured and run `npm run dev` again

**Issue**: Orders not appearing in cashier dashboard
- Solution: The dashboard auto-refreshes every 3 seconds. Ensure you've placed an order from the customer interface

**Issue**: Table number not detected from QR code
- Solution: Ensure the URL includes the `?table=X` query parameter

## License

This project is a demonstration application for educational purposes.

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Deployment Documentation](https://vercel.com/docs)
