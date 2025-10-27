# Supabase Storage Setup

## Create Storage Bucket

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/dcmqtjbpowszjenwluxb/storage/buckets
2. Click **New Bucket**
3. Fill in:
   - **Name**: `menu-images`
   - **Public bucket**: ✅ YES (check this!)
   - **File size limit**: 5 MB
   - **Allowed MIME types**: image/jpeg, image/png, image/webp
4. Click **Create Bucket**

## Set Bucket Policies

After creating bucket, set policies:

1. Click on `menu-images` bucket
2. Click **Policies** tab
3. Click **New Policy**
4. Select **For full customization**
5. Add this policy:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'menu-images' );

-- Allow authenticated uploads
CREATE POLICY "Allow uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'menu-images' );

-- Allow authenticated updates
CREATE POLICY "Allow updates"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'menu-images' );

-- Allow authenticated deletes
CREATE POLICY "Allow deletes"
ON storage.objects FOR DELETE
USING ( bucket_id = 'menu-images' );
```

Or use the UI:
- **Policy name**: Public Access
- **Allowed operation**: SELECT
- **Target roles**: public
- Click **Review** → **Save policy**

Repeat for INSERT, UPDATE, DELETE with target role: authenticated (or public for demo)

## Done!

Your storage bucket is ready to accept image uploads! ✅
