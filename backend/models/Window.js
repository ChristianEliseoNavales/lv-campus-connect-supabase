const mongoose = require('mongoose');

const windowSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    enum: ['registrar', 'admissions'],
    required: true
  },
  serviceIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  assignedAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isOpen: {
    type: Boolean,
    default: false
  },
  isServing: {
    type: Boolean,
    default: true // Default to true when window is created
  },
  currentQueue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Queue'
  },
  // Audit fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
windowSchema.index({ department: 1, isOpen: 1 });
windowSchema.index({ assignedAdmin: 1 });
windowSchema.index({ serviceIds: 1 });
windowSchema.index({ name: 1, department: 1 }, { unique: true });

// Static method to get windows by department
windowSchema.statics.getByDepartment = function(department, openOnly = false) {
  const query = { department };
  if (openOnly) {
    query.isOpen = true;
  }
  return this.find(query)
    .populate('serviceIds', 'name')
    .populate('assignedAdmin', 'name email')
    .sort({ name: 1 });
};

// Static method to get available windows for a service
windowSchema.statics.getAvailableForService = function(serviceId) {
  return this.find({
    serviceIds: serviceId,
    isOpen: true
  }).populate('serviceIds', 'name');
};

// Static method to get all visible services for a department
windowSchema.statics.getVisibleServices = function(department) {
  return this.aggregate([
    {
      $match: {
        department: department,
        isOpen: true,
        serviceIds: { $exists: true, $not: { $size: 0 } }
      }
    },
    {
      $unwind: '$serviceIds'
    },
    {
      $group: {
        _id: '$serviceIds'
      }
    },
    {
      $lookup: {
        from: 'services',
        localField: '_id',
        foreignField: '_id',
        as: 'service'
      }
    },
    {
      $unwind: '$service'
    },
    {
      $match: {
        'service.department': department
      }
    },
    {
      $replaceRoot: { newRoot: '$service' }
    },
    {
      $sort: { name: 1 }
    }
  ]);
};

module.exports = mongoose.model('Window', windowSchema);
