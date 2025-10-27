import { NextRequest, NextResponse } from 'next/server';

// This API acts as a pass-through - frontend is the source of truth

// GET - Return empty array (frontend manages its own state)
export async function GET() {
  return NextResponse.json({ orders: [] });
}

// POST - Just generate ID and return the order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newOrder = {
      ...body,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    
    return NextResponse.json({ order: newOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

// PATCH - Just return the updated order
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ order: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
