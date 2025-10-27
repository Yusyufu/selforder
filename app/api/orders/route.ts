import { NextRequest, NextResponse } from 'next/server';

// Use global variable with persistence across requests in same instance
const STORAGE_KEY = 'orders_data';

if (!(global as any)[STORAGE_KEY]) {
  (global as any)[STORAGE_KEY] = [];
}

function getOrders(): any[] {
  return (global as any)[STORAGE_KEY] || [];
}

function setOrders(orders: any[]) {
  (global as any)[STORAGE_KEY] = orders;
}

// GET - Fetch all orders
export async function GET() {
  const orders = getOrders();
  return NextResponse.json({ orders });
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newOrder = {
      ...body,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    
    const orders = getOrders();
    orders.push(newOrder);
    setOrders(orders);
    
    return NextResponse.json({ order: newOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

// PATCH - Update order status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;
    
    const orders = getOrders();
    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    orders[orderIndex] = { ...orders[orderIndex], status };
    setOrders(orders);
    
    return NextResponse.json({ order: orders[orderIndex] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
