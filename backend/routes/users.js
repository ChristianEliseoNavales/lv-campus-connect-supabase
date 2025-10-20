const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Validation middleware
const validateUser = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('role')
    .isIn(['super_admin', 'registrar_admin', 'admissions_admin', 'hr_admin'])
    .withMessage('Invalid role specified'),
  body('department')
    .optional()
    .isIn(['MIS', 'Registrar', 'Admissions', 'HR'])
    .withMessage('Invalid department specified'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const validateUserUpdate = [
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('role')
    .optional()
    .isIn(['super_admin', 'registrar_admin', 'admissions_admin', 'hr_admin'])
    .withMessage('Invalid role specified'),
  body('department')
    .optional()
    .isIn(['MIS', 'Registrar', 'Admissions', 'HR'])
    .withMessage('Invalid department specified'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];

// GET /api/users - Fetch all users
router.get('/', async (req, res) => {
  try {
    const { role, department, isActive, search } = req.query;
    
    // Build query object
    const query = {};
    
    if (role) {
      query.role = role;
    }
    
    if (department) {
      query.department = department;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query)
      .select('-password -googleId')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
      message: error.message
    });
  }
});

// GET /api/users/by-role/:role - Fetch users by specific role
router.get('/by-role/:role', async (req, res) => {
  try {
    const { role } = req.params;
    
    // Validate role parameter
    const validRoles = ['super_admin', 'registrar_admin', 'admissions_admin', 'hr_admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        error: 'Invalid role specified',
        validRoles
      });
    }
    
    const users = await User.find({ 
      role, 
      isActive: true 
    })
      .select('_id name email role department')
      .sort({ name: 1 });
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users by role:', error);
    res.status(500).json({
      error: 'Failed to fetch users by role',
      message: error.message
    });
  }
});

// GET /api/users/:id - Fetch single user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -googleId')
      .populate('createdBy', 'name email');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      error: 'Failed to fetch user',
      message: error.message
    });
  }
});

// POST /api/users - Create new user
router.post('/', validateUser, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }
    
    const { email, name, role, department, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'A user with this email already exists'
      });
    }
    
    // Validate department requirement based on role
    if (role !== 'super_admin' && !department) {
      return res.status(400).json({
        error: 'Department is required for non-super admin roles'
      });
    }
    
    // Create new user
    const userData = {
      email,
      name,
      role,
      isActive: true
    };
    
    if (department) {
      userData.department = department;
    }
    
    if (password) {
      userData.password = password;
    }
    
    const user = new User(userData);
    await user.save();
    
    // Emit real-time update
    const io = req.app.get('io');
    io.emit('user-created', {
      user: user.toJSON(),
      timestamp: new Date().toISOString()
    });
    
    res.status(201).json(user.toJSON());
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      error: 'Failed to create user',
      message: error.message
    });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', validateUserUpdate, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }
    
    const { id } = req.params;
    const updateData = req.body;
    
    // Remove password from update if empty
    if (updateData.password === '') {
      delete updateData.password;
    }
    
    // Validate department requirement based on role
    if (updateData.role && updateData.role !== 'super_admin' && !updateData.department) {
      const existingUser = await User.findById(id);
      if (!existingUser?.department) {
        return res.status(400).json({
          error: 'Department is required for non-super admin roles'
        });
      }
    }
    
    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -googleId');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    // Emit real-time update
    const io = req.app.get('io');
    io.emit('user-updated', {
      user: user.toJSON(),
      timestamp: new Date().toISOString()
    });
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      error: 'Failed to update user',
      message: error.message
    });
  }
});

// DELETE /api/users/:id - Delete user (soft delete by setting isActive to false)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).select('-password -googleId');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    // Emit real-time update
    const io = req.app.get('io');
    io.emit('user-deleted', {
      userId: id,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      message: 'User deactivated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      error: 'Failed to delete user',
      message: error.message
    });
  }
});

module.exports = router;
