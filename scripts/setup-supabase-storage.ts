import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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
  console.log('🚀 Checking Supabase Storage...\n');

  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      console.log('⚠️  Cannot list buckets with anon key (this is normal)');
      console.log('\n📋 Manual Setup Required:\n');
      console.log('1. Open Supabase Dashboard: https://app.supabase.com');
      console.log('2. Go to Storage → Create a new bucket');
      console.log('3. Bucket name: qr-codes');
      console.log('4. Make it PUBLIC ✅');
      console.log('5. File size limit: 1048576 (1MB)');
      console.log('6. Allowed MIME types: image/png');
      console.log('\n💡 Or follow the guide: SUPABASE_STORAGE_SETUP.md\n');
      return;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_BUCKET);

    if (bucketExists) {
      console.log(`✅ Bucket '${STORAGE_BUCKET}' already exists!`);
      console.log('\n✨ Supabase Storage is ready!');
      console.log(`\n📦 Bucket: ${STORAGE_BUCKET}`);
      console.log('🌐 Public: Yes (verify in dashboard)');
      console.log('📏 File size limit: 1MB');
      console.log('📄 Allowed types: image/png');
      console.log('\n🎉 You can now upload QR codes to Supabase Storage!');
    } else {
      console.log(`⚠️  Bucket '${STORAGE_BUCKET}' not found`);
      console.log('\n📋 Please create bucket manually:\n');
      console.log('1. Open Supabase Dashboard: https://app.supabase.com');
      console.log('2. Go to Storage → Create a new bucket');
      console.log('3. Bucket name: qr-codes');
      console.log('4. Make it PUBLIC ✅');
      console.log('5. File size limit: 1048576 (1MB)');
      console.log('6. Allowed MIME types: image/png');
      console.log('\n💡 Or follow the guide: SUPABASE_STORAGE_SETUP.md\n');
    }

  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
    console.log('\n📋 Please create bucket manually in Supabase Dashboard');
    console.log('💡 Follow the guide: SUPABASE_STORAGE_SETUP.md\n');
  }
}

setupStorage();
