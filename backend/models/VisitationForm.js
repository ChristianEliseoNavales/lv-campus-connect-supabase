const mongoose = require('mongoose');

const visitationFormSchema = new mongoose.Schema({
  // Customer Information
  customerName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^(\+63|0)[0-9]{10}$/.test(v);
      },
      message: 'Contact number must be a valid Philippine phone number'
    }
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Email must be valid'
    }
  },
  address: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  },
  // ID Number for priority users (PWD/Senior Citizen/Pregnant)
  idNumber: {
    type: String,
    trim: true,
    maxlength: 50,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes for better query performance
visitationFormSchema.index({ customerName: 1 });
visitationFormSchema.index({ email: 1 });
visitationFormSchema.index({ contactNumber: 1 });

// Instance method to get full customer info
visitationFormSchema.methods.getCustomerInfo = function() {
  return {
    name: this.customerName,
    contact: this.contactNumber,
    email: this.email,
    address: this.address || 'Not provided',
    idNumber: this.idNumber || 'Not provided'
  };
};

// Static method to create form with validation
visitationFormSchema.statics.createForm = async function(formData) {
  const { customerName, contactNumber, email, address, idNumber } = formData;
  
  // Validate required fields
  if (!customerName || !contactNumber || !email) {
    throw new Error('Customer name, contact number, and email are required');
  }
  
  const form = new this({
    customerName: customerName.trim(),
    contactNumber: contactNumber.trim(),
    email: email.trim().toLowerCase(),
    address: address ? address.trim() : '',
    idNumber: idNumber ? idNumber.trim() : ''
  });
  
  return form.save();
};

module.exports = mongoose.model('VisitationForm', visitationFormSchema);
