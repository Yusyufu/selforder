import { NextRequest, NextResponse } from 'next/server';

// In-memory store for menu items
let menuItems: any[] = [];

// GET - Fetch all menu items
export async function GET() {
  return NextResponse.json({ menuItems });
}

// POST - Create new menu item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newMenuItem = {
      ...body,
      id: crypto.randomUUID(),
    };
    
    menuItems.push(newMenuItem);
    
    return NextResponse.json({ menuItem: newMenuItem }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}

// PUT - Update menu item
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    const itemIndex = menuItems.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }
    
    menuItems[itemIndex] = { ...menuItems[itemIndex], ...updates };
    
    return NextResponse.json({ menuItem: menuItems[itemIndex] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

// DELETE - Delete menu item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const itemIndex = menuItems.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }
    
    menuItems.splice(itemIndex, 1);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}
