import { NextRequest, NextResponse } from 'next/server';

// Use global variable with persistence across requests in same instance
// For Vercel, we'll use a simple in-memory cache with initialization
const STORAGE_KEY = 'tables_data';

// Global storage that persists across requests in the same instance
if (!(global as any)[STORAGE_KEY]) {
  (global as any)[STORAGE_KEY] = [];
}

function getTables(): any[] {
  return (global as any)[STORAGE_KEY] || [];
}

function setTables(tables: any[]) {
  (global as any)[STORAGE_KEY] = tables;
}

// GET - Fetch all tables
export async function GET() {
  const tables = getTables();
  return NextResponse.json({ tables });
}

// POST - Create new table
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newTable = {
      ...body,
      id: crypto.randomUUID(),
    };
    
    const tables = getTables();
    tables.push(newTable);
    setTables(tables);
    
    return NextResponse.json({ table: newTable }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create table' }, { status: 500 });
  }
}

// PUT - Update table
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    const tables = getTables();
    const tableIndex = tables.findIndex(table => table.id === id);
    if (tableIndex === -1) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    }
    
    tables[tableIndex] = { ...tables[tableIndex], ...updates };
    setTables(tables);
    
    return NextResponse.json({ table: tables[tableIndex] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update table' }, { status: 500 });
  }
}

// DELETE - Delete table
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const tables = getTables();
    const tableIndex = tables.findIndex(table => table.id === id);
    if (tableIndex === -1) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    }
    
    tables.splice(tableIndex, 1);
    setTables(tables);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete table' }, { status: 500 });
  }
}
