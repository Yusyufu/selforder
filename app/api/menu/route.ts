import { NextRequest, NextResponse } from 'next/server';

// Use global variable with persistence across requests in same instance
const STORAGE_KEY = 'menu_data';

if (!(global as any)[STORAGE_KEY]) {
  (global as any)[STORAGE_KEY] = [];
}

function getMenuItems(): any[] {
  return (global as any)[STORAGE_KEY] || [];
}

function setMenuItems(items: any[]) {
  (global as any)[STORAGE_KEY] = items;
}

// GET - Fetch all menu items
export async function GET() {
  const menuItems = getMenuItems();
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
    
    const menuItems = getMenuItems();
    menuItems.push(newMenuItem);
    setMenuItems(menuItems);
    
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
    
    const menuItems = getMenuItems();
    const itemIndex = menuItems.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }
    
    menuItems[itemIndex] = { ...menuItems[itemIndex], ...updates };
    setMenuItems(menuItems);
    
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
    
    const menuItems = getMenuItems();
    const itemIndex = menuItems.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }
    
    menuItems.splice(itemIndex, 1);
    setMenuItems(menuItems);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}
