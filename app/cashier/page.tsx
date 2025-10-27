import OrderDashboard from '@/components/cashier/OrderDashboard';

export default function CashierPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 md:p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Cashier Dashboard
        </h1>
        <OrderDashboard />
      </div>
    </div>
  );
}
