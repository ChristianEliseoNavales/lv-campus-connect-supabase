const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');

// Import all models
const { 
  User, 
  Queue, 
  VisitationForm, 
  Window, 
  Service, 
  Settings, 
  Rating, 
  Bulletin, 
  AuditTrail 
} = require('../models');

// Model mapping for dynamic access
const modelMap = {
  user: User,
  queue: Queue,
  visitationform: VisitationForm,
  window: Window,
  service: Service,
  settings: Settings,
  rating: Rating,
  bulletin: Bulletin,
  audittrail: AuditTrail
};

// Middleware to check if user is MIS Super Admin
const requireSuperAdmin = (req, res, next) => {
  // Check if DEV_BYPASS_AUTH is enabled
  if (process.env.DEV_BYPASS_AUTH === 'true') {
    console.log('🔓 DEV_BYPASS_AUTH: Bypassing authentication for database routes');
    req.user = { role: 'super_admin', email: 'dev@test.com', name: 'Development User' };
    return next();
  }

  // In production, check actual user role
  if (!req.user || req.user.role !== 'super_admin') {
    return res.status(403).json({
      error: 'Access denied. MIS Super Admin role required.'
    });
  }

  next();
};

// Middleware to get model from params
const getModel = (req, res, next) => {
  const modelName = req.params.model?.toLowerCase();
  const Model = modelMap[modelName];
  
  if (!Model) {
    return res.status(400).json({ 
      error: `Invalid model: ${modelName}. Available models: ${Object.keys(modelMap).join(', ')}` 
    });
  }
  
  req.Model = Model;
  req.modelName = modelName;
  next();
};

// Helper function to build search query
const buildSearchQuery = (searchTerm, modelName) => {
  if (!searchTerm) return {};

  const searchFields = {
    user: ['name', 'email'],
    queue: ['queueNumber', 'role', 'department'],
    visitationform: ['customerName', 'contactNumber', 'email'],
    window: ['name', 'department'],
    service: ['name', 'department'],
    rating: ['customerName', 'feedback', 'ratingType'],
    bulletin: ['title', 'content', 'category'],
    audittrail: ['action', 'actionDescription', 'resourceType'],
    settings: ['systemName', 'systemVersion']
  };

  const fields = searchFields[modelName] || [];
  if (fields.length === 0) return {};

  return {
    $or: fields.map(field => ({
      [field]: { $regex: searchTerm, $options: 'i' }
    }))
  };
};

// GET /api/database/:model - Get all records for a model with pagination and search
router.get('/:model', 
  requireSuperAdmin,
  getModel,
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('search').optional().isString().withMessage('Search must be a string')
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: errors.array() 
        });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const searchTerm = req.query.search || '';
      const skip = (page - 1) * limit;

      // Build search query
      const searchQuery = buildSearchQuery(searchTerm, req.modelName);

      // Get total count
      const totalRecords = await req.Model.countDocuments(searchQuery);
      const totalPages = Math.ceil(totalRecords / limit);

      // Get records with pagination
      let query = req.Model.find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      // Populate references for certain models
      if (req.modelName === 'queue') {
        query = query.populate('serviceId windowId visitationFormId');
      } else if (req.modelName === 'window') {
        query = query.populate('serviceIds assignedAdmin');
      }

      const records = await query.exec();

      res.json({
        records,
        totalRecords,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      });

    } catch (error) {
      console.error(`Error fetching ${req.modelName} records:`, error);
      res.status(500).json({ 
        error: `Failed to fetch ${req.modelName} records`,
        details: error.message 
      });
    }
  }
);

// GET /api/database/:model/:id - Get single record by ID
router.get('/:model/:id', 
  requireSuperAdmin,
  getModel,
  async (req, res) => {
    try {
      const record = await req.Model.findById(req.params.id);
      
      if (!record) {
        return res.status(404).json({ 
          error: `${req.modelName} record not found` 
        });
      }

      res.json(record);

    } catch (error) {
      console.error(`Error fetching ${req.modelName} record:`, error);
      res.status(500).json({ 
        error: `Failed to fetch ${req.modelName} record`,
        details: error.message 
      });
    }
  }
);

// POST /api/database/:model - Create new record
router.post('/:model', 
  requireSuperAdmin,
  getModel,
  async (req, res) => {
    try {
      // Create new record
      const record = new req.Model(req.body);
      await record.save();

      res.status(201).json(record);

    } catch (error) {
      console.error(`Error creating ${req.modelName} record:`, error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }));
        
        return res.status(400).json({ 
          error: 'Validation failed',
          details: validationErrors
        });
      }

      // Handle duplicate key errors
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(400).json({ 
          error: `Duplicate ${field}. This ${field} already exists.`
        });
      }

      res.status(500).json({ 
        error: `Failed to create ${req.modelName} record`,
        details: error.message 
      });
    }
  }
);

// PUT /api/database/:model/:id - Update record by ID
router.put('/:model/:id', 
  requireSuperAdmin,
  getModel,
  async (req, res) => {
    try {
      const record = await req.Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { 
          new: true, 
          runValidators: true 
        }
      );

      if (!record) {
        return res.status(404).json({ 
          error: `${req.modelName} record not found` 
        });
      }

      res.json(record);

    } catch (error) {
      console.error(`Error updating ${req.modelName} record:`, error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }));
        
        return res.status(400).json({ 
          error: 'Validation failed',
          details: validationErrors
        });
      }

      // Handle duplicate key errors
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(400).json({ 
          error: `Duplicate ${field}. This ${field} already exists.`
        });
      }

      res.status(500).json({ 
        error: `Failed to update ${req.modelName} record`,
        details: error.message 
      });
    }
  }
);

// DELETE /api/database/:model/delete-all - Delete all records for a model (MUST BE BEFORE /:model/:id)
router.delete('/:model/delete-all',
  requireSuperAdmin,
  getModel,
  async (req, res) => {
    try {
      console.log(`🗑️ DELETE ALL request for ${req.modelName}`);

      const result = await req.Model.deleteMany({});
      console.log(`✅ Successfully deleted ${result.deletedCount} ${req.modelName} records`);

      res.json({
        message: `All ${req.modelName} records deleted successfully`,
        deletedCount: result.deletedCount
      });

    } catch (error) {
      console.error(`❌ Error deleting all ${req.modelName} records:`, error);
      res.status(500).json({
        error: `Failed to delete all ${req.modelName} records`,
        details: error.message
      });
    }
  }
);

// DELETE /api/database/:model/:id - Delete single record by ID
router.delete('/:model/:id',
  requireSuperAdmin,
  getModel,
  async (req, res) => {
    try {
      console.log(`🗑️ DELETE request for ${req.modelName} with ID: ${req.params.id}`);

      // Validate ObjectId format
      const mongoose = require('mongoose');
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        console.log(`❌ Invalid ObjectId format: ${req.params.id}`);
        return res.status(400).json({
          error: `Invalid ID format for ${req.modelName} record`
        });
      }

      const record = await req.Model.findByIdAndDelete(req.params.id);
      console.log(`🔍 Delete result for ${req.modelName}:`, record ? 'Found and deleted' : 'Not found');

      if (!record) {
        return res.status(404).json({
          error: `${req.modelName} record not found`
        });
      }

      console.log(`✅ Successfully deleted ${req.modelName} record with ID: ${req.params.id}`);
      res.json({
        message: `${req.modelName} record deleted successfully`,
        deletedRecord: record
      });

    } catch (error) {
      console.error(`❌ Error deleting ${req.modelName} record:`, error);
      res.status(500).json({
        error: `Failed to delete ${req.modelName} record`,
        details: error.message
      });
    }
  }
);

module.exports = router;
