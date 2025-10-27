import { NextRequest, NextResponse } from 'next/server';

// This API acts as a pass-through - frontend is the source of truth
// We just echo back what frontend sends us

// GET - Return empty array (frontend manages its own state)
export async function GET() {
  return NextResponse.json({ tables: [] });
}

// POST - Just generate ID and return the table
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newTable = {
      ...body,
      id: crypto.randomUUID(),
    };
    
    return NextResponse.json({ table: newTable }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create table' }, { status: 500 });
  }
}

// PUT - Just return the updated table
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ table: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update table' }, { status: 500 });
  }
}

// DELETE - Just return success
export async function DELETE(request: NextRequest) {
  try {
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete table' }, { status: 500 });
  }
}
