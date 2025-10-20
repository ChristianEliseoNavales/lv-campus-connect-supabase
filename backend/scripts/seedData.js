const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('🌱 MongoDB Atlas Database Seeding');
console.log('=================================');

// Use the exact same connection logic as the main server
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

// Simple schemas for seeding (avoiding complex model imports)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['super_admin', 'registrar_admin', 'admissions_admin', 'hr_admin'], required: true },
  isActive: { type: Boolean, default: true },
  department: { type: String, enum: ['MIS', 'Registrar', 'Admissions', 'HR'] }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  department: { type: String, enum: ['registrar', 'admissions'], required: true },
  isActive: { type: Boolean, default: true },
  estimatedProcessingTime: { type: Number, default: 15 },
  category: { type: String, enum: ['Document Request', 'Enrollment', 'Inquiry', 'Claim', 'Other'], default: 'Other' }
}, { timestamps: true });

const windowSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  windowNumber: { type: Number, required: true, min: 1 },
  department: { type: String, enum: ['registrar', 'admissions'], required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  assignedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adminEmail: { type: String, trim: true, lowercase: true },
  isActive: { type: Boolean, default: true },
  isOpen: { type: Boolean, default: false }
}, { timestamps: true });

const queueSchema = new mongoose.Schema({
  queueNumber: { type: Number, required: true, min: 1, max: 99 },
  department: { type: String, enum: ['registrar', 'admissions'], required: true },
  windowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Window' },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  customerName: { type: String, required: true, trim: true },
  contactNumber: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  role: { type: String, enum: ['Visitor', 'Student', 'Teacher', 'Alumni'], required: true },
  priorityStatus: { type: String, enum: ['PWD', 'Senior Citizen', 'Pregnant', 'Regular'], default: 'Regular' },
  status: { type: String, enum: ['waiting', 'serving', 'completed', 'skipped', 'cancelled'], default: 'waiting' },
  queuedAt: { type: Date, default: Date.now }
}, { timestamps: true });

async function seedDatabase() {
  try {
    // Connect to database
    await connectDB();

    // Create models
    const User = mongoose.model('User', userSchema);
    const Service = mongoose.model('Service', serviceSchema);
    const Window = mongoose.model('Window', windowSchema);
    const Queue = mongoose.model('Queue', queueSchema);

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Service.deleteMany({}),
      Window.deleteMany({}),
      Queue.deleteMany({})
    ]);
    console.log('✅ Database cleared');

    // Seed Users
    console.log('👥 Creating users...');
    const users = await User.insertMany([
      {
        email: 'admin@lvcampusconnect.edu',
        name: 'MIS Super Admin',
        password: 'Admin123!',
        role: 'super_admin',
        department: 'MIS'
      },
      {
        email: 'registrar.admin@lvcampusconnect.edu',
        name: 'Registrar Administrator',
        password: 'Registrar123!',
        role: 'registrar_admin',
        department: 'Registrar'
      },
      {
        email: 'admissions.admin@lvcampusconnect.edu',
        name: 'Admissions Administrator',
        password: 'Admissions123!',
        role: 'admissions_admin',
        department: 'Admissions'
      }
    ]);
    console.log(`✅ Created ${users.length} users`);

    // Seed Services
    console.log('🔧 Creating services...');
    const services = await Service.insertMany([
      {
        name: 'Transcript Request',
        description: 'Official academic transcript request and processing',
        department: 'registrar',
        category: 'Document Request',
        estimatedProcessingTime: 20
      },
      {
        name: 'Enrollment Verification',
        description: 'Student enrollment status verification and certification',
        department: 'registrar',
        category: 'Document Request',
        estimatedProcessingTime: 15
      },
      {
        name: 'Application Assistance',
        description: 'Help with new student application process',
        department: 'admissions',
        category: 'Enrollment',
        estimatedProcessingTime: 25
      }
    ]);
    console.log(`✅ Created ${services.length} services`);

    // Seed Windows
    console.log('🪟 Creating windows...');
    const registrarAdmin = users.find(u => u.role === 'registrar_admin');
    const admissionsAdmin = users.find(u => u.role === 'admissions_admin');
    const transcriptService = services.find(s => s.name === 'Transcript Request');
    const applicationService = services.find(s => s.name === 'Application Assistance');

    const windows = await Window.insertMany([
      {
        name: 'Registrar Window 1',
        windowNumber: 1,
        department: 'registrar',
        serviceId: transcriptService._id,
        assignedAdmin: registrarAdmin._id,
        adminEmail: registrarAdmin.email,
        isActive: true,
        isOpen: true
      },
      {
        name: 'Admissions Window 1',
        windowNumber: 1,
        department: 'admissions',
        serviceId: applicationService._id,
        assignedAdmin: admissionsAdmin._id,
        adminEmail: admissionsAdmin.email,
        isActive: true,
        isOpen: true
      }
    ]);
    console.log(`✅ Created ${windows.length} windows`);

    // Seed Sample Queues
    console.log('📋 Creating sample queues...');
    const queues = await Queue.insertMany([
      {
        queueNumber: 1,
        department: 'registrar',
        windowId: windows[0]._id,
        serviceId: transcriptService._id,
        customerName: 'John Doe',
        contactNumber: '09123456789',
        email: 'john.doe@student.lv.edu.ph',
        role: 'Student',
        priorityStatus: 'Regular',
        status: 'completed',
        queuedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        queueNumber: 2,
        department: 'registrar',
        serviceId: transcriptService._id,
        customerName: 'Jane Smith',
        contactNumber: '09987654321',
        role: 'Student',
        priorityStatus: 'Regular',
        status: 'waiting',
        queuedAt: new Date(Date.now() - 30 * 60 * 1000)
      }
    ]);
    console.log(`✅ Created ${queues.length} queues`);

    console.log('');
    console.log('🎉 Database seeding completed successfully!');
    console.log('=====================================');
    console.log('📊 Summary:');
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   🔧 Services: ${services.length}`);
    console.log(`   🪟 Windows: ${windows.length}`);
    console.log(`   📋 Queues: ${queues.length}`);
    console.log('');
    console.log('🔐 Test Credentials:');
    console.log('   Super Admin: admin@lvcampusconnect.edu / Admin123!');
    console.log('   Registrar Admin: registrar.admin@lvcampusconnect.edu / Registrar123!');
    console.log('   Admissions Admin: admissions.admin@lvcampusconnect.edu / Admissions123!');
    console.log('');
    console.log('✅ MongoDB Atlas connection verified and working!');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seeding
seedDatabase();
