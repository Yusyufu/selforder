import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return NextResponse.json({
    env: {
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? 'SET ✅' : 'NOT SET ❌',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseKey ? 'SET ✅' : 'NOT SET ❌',
    },
    preview: {
      url: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'not set',
      key: supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'not set',
    }
  });
}
