const mongoose = require('mongoose');
const Queue = require('../models/Queue');
const VisitationForm = require('../models/VisitationForm');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lvcampusconnect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function clearAllQueues() {
  try {
    console.log('=== Clearing All Queue Records ===\n');
    
    // First, get count of existing records
    const queueCount = await Queue.countDocuments();
    const visitationFormCount = await VisitationForm.countDocuments();
    
    console.log(`📊 Current Database Status:`);
    console.log(`   Queue records: ${queueCount}`);
    console.log(`   VisitationForm records: ${visitationFormCount}`);
    console.log('');
    
    if (queueCount === 0 && visitationFormCount === 0) {
      console.log('✅ Database is already clean - no queue records to clear');
      return;
    }
    
    // Clear all queue records
    console.log('🗑️  Clearing Queue records...');
    const queueResult = await Queue.deleteMany({});
    console.log(`✅ Deleted ${queueResult.deletedCount} Queue records`);
    
    // Clear all visitation form records
    console.log('🗑️  Clearing VisitationForm records...');
    const visitationResult = await VisitationForm.deleteMany({});
    console.log(`✅ Deleted ${visitationResult.deletedCount} VisitationForm records`);
    
    // Verify deletion
    const remainingQueues = await Queue.countDocuments();
    const remainingForms = await VisitationForm.countDocuments();
    
    console.log('\n📊 Final Database Status:');
    console.log(`   Queue records: ${remainingQueues}`);
    console.log(`   VisitationForm records: ${remainingForms}`);
    
    if (remainingQueues === 0 && remainingForms === 0) {
      console.log('\n🎉 SUCCESS: All queue records cleared successfully!');
      console.log('');
      console.log('📝 What was cleared:');
      console.log('   ✅ All queue entries (waiting, serving, completed, skipped)');
      console.log('   ✅ All visitation form data');
      console.log('   ✅ Queue numbering will reset to 1 for next submissions');
      console.log('');
      console.log('🔒 What was preserved:');
      console.log('   ✅ Window configurations');
      console.log('   ✅ Service definitions');
      console.log('   ✅ User accounts');
      console.log('   ✅ Settings');
      console.log('   ✅ All other system data');
    } else {
      console.log('\n⚠️  WARNING: Some records may not have been deleted');
      console.log('   Please check the database manually');
    }
    
  } catch (error) {
    console.error('❌ Error clearing queue records:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Add confirmation prompt
console.log('⚠️  WARNING: This will permanently delete ALL queue records!');
console.log('');
console.log('This includes:');
console.log('- All queue entries (waiting, serving, completed, skipped)');
console.log('- All visitation form data');
console.log('- Queue numbering will reset');
console.log('');
console.log('This will NOT affect:');
console.log('- Window configurations');
console.log('- Service definitions');
console.log('- User accounts');
console.log('- Settings');
console.log('');

// Run the clearing function
clearAllQueues();
