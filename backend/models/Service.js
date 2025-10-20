const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  department: {
    type: String,
    enum: ['registrar', 'admissions'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
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
serviceSchema.index({ department: 1, isActive: 1 });
serviceSchema.index({ name: 1, department: 1 }, { unique: true });

// Static method to get services by department
serviceSchema.statics.getByDepartment = function(department, activeOnly = true) {
  const query = { department };
  if (activeOnly) {
    query.isActive = true;
  }
  return this.find(query).sort({ name: 1 });
};

module.exports = mongoose.model('Service', serviceSchema);
