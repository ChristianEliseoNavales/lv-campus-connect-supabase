const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lvcampusconnect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const windowSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true, enum: ['registrar', 'admissions'] },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' }, // Old field
  serviceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }], // New field
  assignedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isOpen: { type: Boolean, default: true },
  currentQueue: { type: Number, default: 0 },
}, {
  timestamps: true
});

const Window = mongoose.model('Window', windowSchema);

async function migrateWindows() {
  try {
    console.log('Starting window migration...');
    
    // Find all windows that have serviceId but not serviceIds
    const windowsToMigrate = await Window.find({
      serviceId: { $exists: true },
      $or: [
        { serviceIds: { $exists: false } },
        { serviceIds: { $size: 0 } }
      ]
    });
    
    console.log(`Found ${windowsToMigrate.length} windows to migrate`);
    
    for (const window of windowsToMigrate) {
      console.log(`Migrating window: ${window.name} (${window.department})`);
      console.log(`  Old serviceId: ${window.serviceId}`);
      
      // Convert serviceId to serviceIds array
      if (window.serviceId) {
        window.serviceIds = [window.serviceId];
        // Remove the old serviceId field
        window.serviceId = undefined;
        
        await window.save();
        console.log(`  New serviceIds: [${window.serviceIds.join(', ')}]`);
      }
    }
    
    console.log('Migration completed successfully!');
    
    // Verify migration
    const remainingOldWindows = await Window.find({ serviceId: { $exists: true } });
    const newWindows = await Window.find({ serviceIds: { $exists: true, $not: { $size: 0 } } });
    
    console.log(`\nMigration Summary:`);
    console.log(`- Windows with old serviceId field: ${remainingOldWindows.length}`);
    console.log(`- Windows with new serviceIds field: ${newWindows.length}`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

migrateWindows();
