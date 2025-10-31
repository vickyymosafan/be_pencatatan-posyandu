import { supabase, STORAGE_BUCKET } from '../src/config/supabase';

/**
 * Setup Supabase Storage Bucket
 * 
 * Script untuk membuat bucket 'qr-codes' di Supabase Storage
 * dan set sebagai public bucket.
 * 
 * Run: npx ts-node scripts/setup-supabase-storage.ts
 */

async function setupStorage() {
  console.log('🚀 Setting up Supabase Storage...\n');

  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      throw new Error(`Failed to list buckets: ${listError.message}`);
    }

    const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_BUCKET);

    if (bucketExists) {
      console.log(`✅ Bucket '${STORAGE_BUCKET}' already exists`);
    } else {
      // Create bucket
      const { data, error: createError } = await supabase.storage.createBucket(STORAGE_BUCKET, {
        public: true, // Make bucket public
        fileSizeLimit: 1048576, // 1MB limit per file
        allowedMimeTypes: ['image/png'],
      });

      if (createError) {
        throw new Error(`Failed to create bucket: ${createError.message}`);
      }

      console.log(`✅ Bucket '${STORAGE_BUCKET}' created successfully`);
    }

    console.log('\n✨ Supabase Storage setup completed!');
    console.log(`\n📦 Bucket: ${STORAGE_BUCKET}`);
    console.log('🌐 Public: Yes');
    console.log('📏 File size limit: 1MB');
    console.log('📄 Allowed types: image/png');
    console.log('\n🎉 You can now upload QR codes to Supabase Storage!');

  } catch (error) {
    console.error('\n❌ Setup failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

setupStorage();
