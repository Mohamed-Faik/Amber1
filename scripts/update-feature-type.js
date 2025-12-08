/**
 * Script to update existing listings to have featureType = "HOMES"
 * Run this once after adding the featureType field to the database
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateFeatureTypes() {
  try {
    console.log('🔄 Updating existing listings to featureType = "HOMES"...');
    
    // Update all listings that don't have a featureType or have null featureType
    const result = await prisma.listing.updateMany({
      where: {
        OR: [
          { featureType: null },
          // For any edge cases where featureType might be undefined
        ]
      },
      data: {
        featureType: 'HOMES'
      }
    });
    
    console.log(`✅ Updated ${result.count} listings to featureType = "HOMES"`);
    
    // Verify the update
    const totalListings = await prisma.listing.count();
    const homesListings = await prisma.listing.count({
      where: { featureType: 'HOMES' }
    });
    
    console.log(`📊 Total listings: ${totalListings}`);
    console.log(`📊 Listings with featureType HOMES: ${homesListings}`);
    
  } catch (error) {
    console.error('❌ Error updating feature types:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateFeatureTypes()
  .then(() => {
    console.log('✨ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });

