/**
 * Test script to verify featureType field exists in Prisma Client
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testFeatureType() {
  try {
    console.log('🧪 Testing if featureType field exists...');
    
    // Try to query with featureType
    const listings = await prisma.listing.findMany({
      take: 1,
      select: {
        id: true,
        title: true,
        featureType: true,
      }
    });
    
    console.log('✅ Success! featureType field is accessible');
    console.log('Sample listing:', listings[0]);
    
    // Count listings by featureType
    const count = await prisma.listing.groupBy({
      by: ['featureType'],
      _count: true,
    });
    
    console.log('\n📊 Listings by featureType:');
    console.log(count);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('featureType')) {
      console.error('\n⚠️  The featureType field is not recognized by Prisma Client.');
      console.error('Please make sure you:');
      console.error('1. Stopped your dev server');
      console.error('2. Ran: npx prisma generate');
      console.error('3. Restarted your dev server');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testFeatureType();

