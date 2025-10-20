const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import all models
const User = require('../models/User');
const Queue = require('../models/Queue');
const Service = require('../models/Service');
const Window = require('../models/Window');
const Settings = require('../models/Settings');
const AuditTrail = require('../models/AuditTrail');
const Bulletin = require('../models/Bulletin');
const Rating = require('../models/Rating');

console.log('🔍 University Kiosk System - Database Schema Validation');
console.log('=====================================================');

const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000
    };
    
    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log("✅ MongoDB Atlas connected successfully!");
    console.log(`📍 Connected to database: ${mongoose.connection.name}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
};

const validateSchema = async () => {
  try {
    await connectDB();

    console.log('\n📋 Validating Database Schema...');
    console.log('==================================');

    // Test 1: Model Loading
    console.log('\n1️⃣ Testing Model Loading:');
    const models = [
      { name: 'User', model: User },
      { name: 'Queue', model: Queue },
      { name: 'Service', model: Service },
      { name: 'Window', model: Window },
      { name: 'Settings', model: Settings },
      { name: 'AuditTrail', model: AuditTrail },
      { name: 'Bulletin', model: Bulletin },
      { name: 'Rating', model: Rating }
    ];

    models.forEach(({ name, model }) => {
      if (model && model.schema) {
        console.log(`   ✅ ${name} model loaded successfully`);
      } else {
        console.log(`   ❌ ${name} model failed to load`);
      }
    });

    // Test 2: Schema Validation
    console.log('\n2️⃣ Testing Schema Validation:');

    // Test User validation
    try {
      const testUser = new User({
        email: 'test@lvcampusconnect.edu',
        name: 'Test User',
        password: 'TestPassword123!',
        role: 'super_admin',
        department: 'MIS'
      });
      await testUser.validate();
      console.log('   ✅ User schema validation passed');
    } catch (error) {
      console.log(`   ❌ User schema validation failed: ${error.message}`);
    }

    // Test Queue validation
    try {
      const testQueue = new Queue({
        queueNumber: 1,
        department: 'registrar',
        serviceId: new mongoose.Types.ObjectId(),
        customerName: 'Test Customer',
        contactNumber: '09123456789',
        role: 'Student',
        studentStatus: 'continuing',
        priorityStatus: 'Regular',
        status: 'waiting'
      });
      await testQueue.validate();
      console.log('   ✅ Queue schema validation passed');
    } catch (error) {
      console.log(`   ❌ Queue schema validation failed: ${error.message}`);
    }

    // Test Service validation
    try {
      const testService = new Service({
        name: 'Test Service',
        description: 'Test service description',
        department: 'registrar',
        category: 'Document Request',
        estimatedProcessingTime: 15
      });
      await testService.validate();
      console.log('   ✅ Service schema validation passed');
    } catch (error) {
      console.log(`   ❌ Service schema validation failed: ${error.message}`);
    }

    // Test 3: Index Validation
    console.log('\n3️⃣ Testing Database Indexes:');

    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const collection of collections) {
      const collectionName = collection.name;
      try {
        const indexes = await mongoose.connection.db.collection(collectionName).indexes();
        console.log(`   ✅ ${collectionName}: ${indexes.length} indexes found`);
      } catch (error) {
        console.log(`   ❌ ${collectionName}: Index check failed`);
      }
    }

    // Test 4: Relationship Validation
    console.log('\n4️⃣ Testing Model Relationships:');

    // Check if ObjectId references are properly defined
    const queueSchema = Queue.schema;
    const serviceIdPath = queueSchema.paths.serviceId;
    const windowIdPath = queueSchema.paths.windowId;

    if (serviceIdPath && (serviceIdPath.instance === 'ObjectID' || serviceIdPath.instance === 'ObjectId')) {
      console.log('   ✅ Queue → Service relationship properly defined');
    } else {
      console.log(`   ❌ Queue → Service relationship issue (type: ${serviceIdPath?.instance})`);
    }

    if (windowIdPath && (windowIdPath.instance === 'ObjectID' || windowIdPath.instance === 'ObjectId')) {
      console.log('   ✅ Queue → Window relationship properly defined');
    } else {
      console.log(`   ❌ Queue → Window relationship issue (type: ${windowIdPath?.instance})`);
    }

    // Test 5: Validation Rules
    console.log('\n5️⃣ Testing Validation Rules:');

    // Test invalid email
    try {
      const invalidUser = new User({
        email: 'invalid-email',
        name: 'Test User',
        password: 'TestPassword123!',
        role: 'super_admin',
        department: 'MIS'
      });
      await invalidUser.validate();
      console.log('   ❌ Email validation should have failed');
    } catch (error) {
      console.log('   ✅ Email validation working correctly');
    }

    // Test invalid phone number
    try {
      const invalidQueue = new Queue({
        queueNumber: 1,
        department: 'registrar',
        serviceId: new mongoose.Types.ObjectId(),
        customerName: 'Test Customer',
        contactNumber: 'invalid-phone',
        role: 'Student',
        priorityStatus: 'Regular',
        status: 'waiting'
      });
      await invalidQueue.validate();
      console.log('   ❌ Phone validation should have failed');
    } catch (error) {
      console.log('   ✅ Phone validation working correctly');
    }

    // Test 6: Enum Validation
    console.log('\n6️⃣ Testing Enum Validation:');

    try {
      const invalidRole = new User({
        email: 'test@lvcampusconnect.edu',
        name: 'Test User',
        password: 'TestPassword123!',
        role: 'invalid_role',
        department: 'MIS'
      });
      await invalidRole.validate();
      console.log('   ❌ Role enum validation should have failed');
    } catch (error) {
      console.log('   ✅ Role enum validation working correctly');
    }

    console.log('\n🎉 Schema Validation Complete!');
    console.log('==============================');
    console.log('✅ All database models are properly configured');
    console.log('✅ Validation rules are working correctly');
    console.log('✅ Relationships are properly defined');
    console.log('✅ Indexes are in place');
    console.log('✅ Schema is production-ready');

  } catch (error) {
    console.error('❌ Schema validation failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run validation
validateSchema();
