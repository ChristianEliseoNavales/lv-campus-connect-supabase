const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
  queueNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 99
  },
  department: {
    type: String,
    enum: ['registrar', 'admissions'],
    required: true
  },
  windowId: {
    type: String // Changed to String for hybrid system compatibility
  },
  serviceId: {
    type: String, // Changed to String for hybrid system compatibility
    required: true
  },
  // Visitation Form Reference (optional for Enroll service)
  visitationFormId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VisitationForm',
    required: false // Made optional to support Enroll service which doesn't require visitation form
  },
  idNumber: {
    type: String,
    trim: true,
    maxlength: 50
  },
  // Queue Details
  role: {
    type: String,
    enum: ['Visitor', 'Student', 'Teacher', 'Alumni'],
    required: true
  },
  studentStatus: {
    type: String,
    enum: ['incoming_new', 'continuing'],
    required: false // Will be validated in the route based on service type
  },

  isPriority: {
    type: Boolean,
    default: false
  },
  // Status Management
  status: {
    type: String,
    enum: ['waiting', 'serving', 'completed', 'skipped', 'cancelled'],
    default: 'waiting'
  },
  isCurrentlyServing: {
    type: Boolean,
    default: false
  },
  // Timestamps
  queuedAt: {
    type: Date,
    default: Date.now
  },
  calledAt: {
    type: Date
  },
  servedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  skippedAt: {
    type: Date
  },
  // Estimated wait time in minutes
  estimatedWaitTime: {
    type: Number,
    default: 0
  },
  // Feedback
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  // Admin remarks for transaction logs
  remarks: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  },
  // Admin who processed the queue
  processedBy: {
    type: mongoose.Schema.Types.Mixed, // Allow any type for now
    ref: 'User',
    required: false,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for better query performance
queueSchema.index({ department: 1, status: 1 });
queueSchema.index({ queueNumber: 1, department: 1 });
queueSchema.index({ status: 1, queuedAt: 1 });
queueSchema.index({ windowId: 1, status: 1 });
queueSchema.index({ isCurrentlyServing: 1 });

// Static method to get next queue number for a department
queueSchema.statics.getNextQueueNumber = async function(department) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Find the highest queue number for today in this department
  const lastQueue = await this.findOne({
    department,
    createdAt: { $gte: today, $lt: tomorrow }
  }).sort({ queueNumber: -1 });

  if (!lastQueue) {
    return 1; // Start from 1 if no queues today
  }

  // If we've reached 99, cycle back to 1
  return lastQueue.queueNumber >= 99 ? 1 : lastQueue.queueNumber + 1;
};

// Static method to get current serving number for a department
queueSchema.statics.getCurrentServingNumber = async function(department, windowId = null) {
  const query = { 
    department, 
    isCurrentlyServing: true,
    status: 'serving'
  };
  
  if (windowId) {
    query.windowId = windowId;
  }

  const currentServing = await this.findOne(query);
  return currentServing ? currentServing.queueNumber : 0;
};

// Static method to get waiting queue for a department
queueSchema.statics.getWaitingQueue = async function(department, windowId = null) {
  const query = { 
    department, 
    status: 'waiting'
  };
  
  if (windowId) {
    query.windowId = windowId;
  }

  return this.find(query)
    .sort({ queuedAt: 1 });
};

// Instance method to mark as serving
queueSchema.methods.markAsServing = async function(windowId, processedBy) {
  // First, unmark any other queue as currently serving for this window
  await this.constructor.updateMany(
    { windowId, isCurrentlyServing: true },
    { isCurrentlyServing: false }
  );

  this.status = 'serving';
  this.isCurrentlyServing = true;
  this.windowId = windowId;

  // Set processedBy (now accepts any type)
  if (processedBy) {
    this.processedBy = processedBy;
  }

  this.calledAt = new Date();

  return this.save();
};

// Instance method to mark as completed
queueSchema.methods.markAsCompleted = async function(rating = null, feedback = null) {
  this.status = 'completed';
  this.isCurrentlyServing = false;
  this.completedAt = new Date();
  
  if (rating) this.rating = rating;
  if (feedback) this.feedback = feedback;
  
  return this.save();
};

module.exports = mongoose.model('Queue', queueSchema);
