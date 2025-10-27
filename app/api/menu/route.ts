import { NextRequest, NextResponse } from 'next/server';

// This API acts as a pass-through - frontend is the source of truth

// GET - Return empty array (frontend manages its own state)
export async function GET() {
  return NextResponse.json({ menuItems: [] });
}

// POST - Just generate ID and return the menu item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newMenuItem = {
      ...body,
      id: crypto.randomUUID(),
    };
    
    return NextResponse.json({ menuItem: newMenuItem }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}

// PUT - Just return the updated menu item
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ menuItem: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

// DELETE - Just return success
export async function DELETE(request: NextRequest) {
  try {
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}
