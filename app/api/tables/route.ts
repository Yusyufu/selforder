import { NextRequest, NextResponse } from 'next/server';

// In-memory store for tables
let tables: any[] = [];

// GET - Fetch all tables
export async function GET() {
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
    
    tables.push(newTable);
    
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
    
    const tableIndex = tables.findIndex(table => table.id === id);
    if (tableIndex === -1) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    }
    
    tables[tableIndex] = { ...tables[tableIndex], ...updates };
    
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
    
    const tableIndex = tables.findIndex(table => table.id === id);
    if (tableIndex === -1) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    }
    
    tables.splice(tableIndex, 1);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete table' }, { status: 500 });
  }
}
