# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or login
3. Click "New Project"
4. Fill in:
   - **Name**: table-self-ordering
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to you
5. Click "Create new project" (wait 1-2 minutes)

## Step 2: Run SQL Schema

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy the entire content from `supabase-schema.sql`
4. Paste it into the SQL editor
5. Click "Run" or press Ctrl+Enter
6. You should see "Success. No rows returned"

## Step 3: Get API Keys

1. Go to **Project Settings** (gear icon in left sidebar)
2. Click **API** in the left menu
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## Step 4: Configure Environment Variables

1. Create a file named `.env.local` in the project root
2. Add these lines (replace with your actual values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file

## Step 5: Add to Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add both variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click "Save"
5. Redeploy your project

## Step 6: Test

1. Run locally: `npm run dev`
2. Go to `/admin` and create a table
3. Open another browser/device
4. You should see the same data!

## Troubleshooting

### "relation does not exist" error
- Make sure you ran the SQL schema in Step 2
- Check the table names match exactly (case-sensitive)

### Data not syncing
- Check environment variables are set correctly
- Check browser console for errors
- Verify RLS policies are enabled in Supabase

### "Invalid API key" error
- Double-check you copied the **anon public** key (not service_role)
- Make sure there are no extra spaces in `.env.local`

## Features

✅ **Multi-device sync** - Changes appear on all devices in ~3 seconds
✅ **Persistent storage** - Data survives page refresh
✅ **Real-time updates** - Polling every 3 seconds
✅ **Free tier** - 500MB database, 2GB bandwidth/month
