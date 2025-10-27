import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // Check if env variables exist
  const hasUrl = !!supabaseUrl;
  const hasKey = !!supabaseKey;

  if (!hasUrl || !hasKey) {
    return NextResponse.json({
      status: 'error',
      message: 'Supabase credentials missing',
      details: {
        hasUrl,
        hasKey,
        urlPreview: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'not set',
        keyPreview: supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'not set',
      }
    }, { status: 500 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test connection by fetching tables
    const { data, error } = await supabase
      .from('tables')
      .select('count')
      .limit(1);

    if (error) {
      return NextResponse.json({
        status: 'error',
        message: 'Supabase connection failed',
        error: error.message,
        details: error,
      }, { status: 500 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Supabase connected successfully!',
      details: {
        hasUrl: true,
        hasKey: true,
        urlPreview: supabaseUrl.substring(0, 30) + '...',
        connectionTest: 'passed',
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error',
      error: error.message || String(error),
    }, { status: 500 });
  }
}
