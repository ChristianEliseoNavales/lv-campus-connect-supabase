const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
const { Service, Window, Settings, Queue, VisitationForm } = require('../models');

const DATA_DIR = path.join(__dirname, '../data');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000
    });
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
}

async function migrateServices() {
  console.log('📋 Migrating services...');
  
  const servicesData = await readJsonFile(path.join(DATA_DIR, 'services.json'));
  if (!servicesData) return;

  // Clear existing services
  await Service.deleteMany({});

  for (const serviceData of servicesData) {
    try {
      const service = new Service({
        name: serviceData.name,
        department: serviceData.department,
        isActive: serviceData.isVisible !== false
      });

      await service.save();
      console.log(`✅ Migrated service: ${service.name}`);
    } catch (error) {
      console.error(`❌ Error migrating service ${serviceData.name}:`, error);
    }
  }
}

async function migrateWindows() {
  console.log('🪟 Migrating windows...');

  const windowsData = await readJsonFile(path.join(DATA_DIR, 'windows.json'));
  if (!windowsData) return;

  // Clear existing windows
  await Window.deleteMany({});

  for (const windowData of windowsData) {
    try {
      // Find a service for the department
      const service = await Service.findOne({
        department: windowData.department
      });

      if (!service) {
        console.warn(`⚠️ No service found for department ${windowData.department}, skipping window ${windowData.name}`);
        continue;
      }

      const window = new Window({
        name: windowData.name,
        department: windowData.department,
        serviceId: service._id,
        assignedAdmin: null, // Will be set later when users are migrated
        isOpen: false
      });

      await window.save();
      console.log(`✅ Migrated window: ${window.name}`);
    } catch (error) {
      console.error(`❌ Error migrating window ${windowData.name}:`, error);
    }
  }
}

async function migrateSettings() {
  console.log('⚙️ Migrating settings...');
  
  const settingsData = await readJsonFile(path.join(DATA_DIR, 'settings.json'));
  if (!settingsData) {
    // Create default settings
    const settings = new Settings();
    await settings.save();
    console.log('✅ Created default settings');
    return;
  }

  // Clear existing settings
  await Settings.deleteMany({});

  const settings = new Settings({
    systemName: 'University Kiosk System',
    queueSettings: {
      isEnabled: true,
      globalQueueNumbering: true,
      maxQueueNumber: 99,
      resetQueueDaily: true
    },
    departmentSettings: {
      registrar: {
        isEnabled: settingsData.queueSystem?.registrar?.isEnabled !== false,
        displayName: "Registrar's Office",
        description: 'Student records, transcripts, enrollment verification'
      },
      admissions: {
        isEnabled: settingsData.queueSystem?.admissions?.isEnabled !== false,
        displayName: 'Admissions Office',
        description: 'New student applications, admission requirements'
      }
    }
  });

  await settings.save();
  console.log('✅ Migrated settings');
}

async function migrateQueues() {
  console.log('📝 Migrating queues...');
  
  const queuesData = await readJsonFile(path.join(DATA_DIR, 'queues.json'));
  if (!queuesData) return;

  // Clear existing queues and visitation forms
  await Queue.deleteMany({});
  await VisitationForm.deleteMany({});

  for (const queueData of queuesData) {
    try {
      // Create visitation form first
      const visitationForm = new VisitationForm({
        customerName: queueData.customerName || 'Unknown',
        contactNumber: '09123456789', // Default phone number
        email: 'unknown@example.com', // Default email
        address: 'Not provided'
      });

      await visitationForm.save();

      // Find service by department (use first available service)
      const service = await Service.findOne({ department: queueData.department });

      const queue = new Queue({
        queueNumber: queueData.queueNumber,
        department: queueData.department,
        serviceId: service ? service._id.toString() : 'unknown',
        visitationFormId: visitationForm._id,
        windowId: queueData.windowId,
        role: queueData.customerRole || 'Visitor',
        isPriority: queueData.priority || false,
        status: queueData.status || 'waiting',
        queuedAt: new Date(queueData.queuedAt || Date.now())
      });

      await queue.save();
      console.log(`✅ Migrated queue: ${queue.queueNumber} (${queue.department})`);
    } catch (error) {
      console.error(`❌ Error migrating queue ${queueData.queueNumber}:`, error);
    }
  }
}

async function main() {
  console.log('🚀 Starting JSON to MongoDB migration...');
  
  await connectDB();
  
  try {
    await migrateServices();
    await migrateWindows();
    await migrateSettings();
    await migrateQueues();
    
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = { main };
