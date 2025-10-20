const express = require('express');
const { Window, Service, User } = require('../models');
const router = express.Router();

// GET /api/windows - Get all windows
router.get('/', async (req, res) => {
  try {
    const windows = await Window.find()
      .populate('serviceIds', 'name')
      .populate('assignedAdmin', 'name email')
      .sort({ department: 1, name: 1 });

    res.json(windows.map(window => ({
      id: window._id,
      name: window.name,
      department: window.department,
      serviceIds: window.serviceIds,
      assignedAdmin: window.assignedAdmin,
      isOpen: window.isOpen,
      currentQueue: window.currentQueue,
      createdAt: window.createdAt,
      updatedAt: window.updatedAt
    })));
  } catch (error) {
    console.error('Error fetching windows:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/windows/:department - Get windows by department
router.get('/:department', async (req, res) => {
  try {
    const { department } = req.params;

    // Validate department
    if (!['registrar', 'admissions'].includes(department)) {
      return res.status(400).json({ error: 'Invalid department' });
    }

    const windows = await Window.find({ department })
      .populate('serviceIds', 'name')
      .populate('assignedAdmin', 'name email')
      .sort({ name: 1 });

    res.json(windows.map(window => ({
      id: window._id,
      name: window.name,
      department: window.department,
      serviceIds: window.serviceIds,
      assignedAdmin: window.assignedAdmin,
      isOpen: window.isOpen,
      currentQueue: window.currentQueue,
      createdAt: window.createdAt,
      updatedAt: window.updatedAt
    })));
  } catch (error) {
    console.error('Error fetching department windows:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/windows - Create new window
router.post('/', async (req, res) => {
  try {
    const { name, department, serviceIds, assignedAdmin } = req.body;

    if (!name || !department || !serviceIds || !Array.isArray(serviceIds) || serviceIds.length === 0) {
      return res.status(400).json({
        error: 'Name, department, and at least one serviceId are required'
      });
    }

    // Validate department
    if (!['registrar', 'admissions'].includes(department)) {
      return res.status(400).json({ error: 'Invalid department' });
    }

    // Check if all services exist and belong to the same department
    const services = await Service.find({ _id: { $in: serviceIds } });
    if (services.length !== serviceIds.length) {
      return res.status(404).json({ error: 'One or more services not found' });
    }

    // Check if all services belong to the same department
    const invalidServices = services.filter(service => service.department !== department);
    if (invalidServices.length > 0) {
      return res.status(400).json({ error: 'All services must belong to the same department as the window' });
    }

    // Check for duplicate window names in the department (case-insensitive)
    const existingWindow = await Window.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      department
    });

    if (existingWindow) {
      return res.status(409).json({ error: 'Window with this name already exists in the department' });
    }

    // Validate assigned admin if provided
    let adminUser = null;
    if (assignedAdmin) {
      adminUser = await User.findById(assignedAdmin);
      if (!adminUser) {
        return res.status(404).json({ error: 'Assigned admin not found' });
      }
    }

    const newWindow = new Window({
      name: name.trim(),
      department,
      serviceIds,
      assignedAdmin: assignedAdmin || null,
      isOpen: false
    });

    await newWindow.save();

    // Populate the window for response
    await newWindow.populate('serviceIds', 'name');
    await newWindow.populate('assignedAdmin', 'name email');

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`admin-${department}`).emit('windows-updated', {
      type: 'window-added',
      department,
      data: {
        id: newWindow._id,
        name: newWindow.name,
        department: newWindow.department,
        serviceIds: newWindow.serviceIds,
        assignedAdmin: newWindow.assignedAdmin,
        isOpen: newWindow.isOpen
      }
    });

    // Also emit service visibility update since window assignments changed
    io.to('kiosk').emit('services-updated', {
      type: 'visibility-changed',
      department
    });

    res.status(201).json({
      id: newWindow._id,
      name: newWindow.name,
      department: newWindow.department,
      serviceIds: newWindow.serviceIds,
      assignedAdmin: newWindow.assignedAdmin,
      isOpen: newWindow.isOpen,
      currentQueue: newWindow.currentQueue,
      createdAt: newWindow.createdAt,
      updatedAt: newWindow.updatedAt
    });
  } catch (error) {
    console.error('Error creating window:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/windows/:id - Update window
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, serviceIds, assignedAdmin } = req.body;

    const window = await Window.findById(id);
    if (!window) {
      return res.status(404).json({ error: 'Window not found' });
    }

    // Check for duplicate window names in the department (case-insensitive)
    if (name && name.trim() !== window.name) {
      const existingWindow = await Window.findOne({
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
        department: window.department,
        _id: { $ne: id }
      });

      if (existingWindow) {
        return res.status(409).json({ error: 'Window with this name already exists in the department' });
      }
    }

    // Validate services if provided
    if (serviceIds) {
      if (!Array.isArray(serviceIds)) {
        return res.status(400).json({ error: 'serviceIds must be an array' });
      }

      if (serviceIds.length > 0) {
        const services = await Service.find({ _id: { $in: serviceIds } });
        if (services.length !== serviceIds.length) {
          return res.status(404).json({ error: 'One or more services not found' });
        }

        const invalidServices = services.filter(service => service.department !== window.department);
        if (invalidServices.length > 0) {
          return res.status(400).json({ error: 'All services must belong to the same department as the window' });
        }
      }
    }

    // Validate assigned admin if provided
    if (assignedAdmin) {
      const adminUser = await User.findById(assignedAdmin);
      if (!adminUser) {
        return res.status(404).json({ error: 'Assigned admin not found' });
      }
    }

    // Update window data
    if (name) window.name = name.trim();
    if (serviceIds !== undefined) window.serviceIds = serviceIds;
    if (assignedAdmin !== undefined) window.assignedAdmin = assignedAdmin || null;

    await window.save();

    // Populate the window for response
    await window.populate('serviceIds', 'name');
    await window.populate('assignedAdmin', 'name email');

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`admin-${window.department}`).emit('windows-updated', {
      type: 'window-updated',
      department: window.department,
      data: {
        id: window._id,
        name: window.name,
        serviceIds: window.serviceIds,
        assignedAdmin: window.assignedAdmin,
        isOpen: window.isOpen
      }
    });

    // Also emit service visibility update since window assignments may have changed
    io.to('kiosk').emit('services-updated', {
      type: 'visibility-changed',
      department: window.department
    });

    res.json({
      id: window._id,
      name: window.name,
      department: window.department,
      serviceIds: window.serviceIds,
      assignedAdmin: window.assignedAdmin,
      isOpen: window.isOpen,
      currentQueue: window.currentQueue,
      createdAt: window.createdAt,
      updatedAt: window.updatedAt
    });
  } catch (error) {
    console.error('Error updating window:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/windows/:id/toggle - Toggle window open status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;

    const window = await Window.findById(id);
    if (!window) {
      return res.status(404).json({ error: 'Window not found' });
    }

    // Toggle the isOpen status
    window.isOpen = !window.isOpen;
    await window.save();

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`admin-${window.department}`).emit('windows-updated', {
      type: 'window-toggled',
      department: window.department,
      data: {
        id: window._id,
        name: window.name,
        isOpen: window.isOpen
      }
    });

    // Also emit service visibility update since window visibility changed
    io.to('kiosk').emit('services-updated', {
      type: 'visibility-changed',
      department: window.department
    });

    res.json({
      id: window._id,
      name: window.name,
      department: window.department,
      isOpen: window.isOpen,
      updatedAt: window.updatedAt
    });
  } catch (error) {
    console.error('Error toggling window:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/windows/:id - Delete window
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const window = await Window.findById(id);
    if (!window) {
      return res.status(404).json({ error: 'Window not found' });
    }

    const deletedWindow = {
      id: window._id,
      name: window.name,
      department: window.department
    };

    await Window.findByIdAndDelete(id);

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`admin-${deletedWindow.department}`).emit('windows-updated', {
      type: 'window-deleted',
      department: deletedWindow.department,
      data: { id: deletedWindow.id }
    });

    // Also emit service visibility update since window was deleted
    io.to('kiosk').emit('services-updated', {
      type: 'visibility-changed',
      department: deletedWindow.department
    });

    res.json({
      message: 'Window deleted successfully',
      window: deletedWindow
    });
  } catch (error) {
    console.error('Error deleting window:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
