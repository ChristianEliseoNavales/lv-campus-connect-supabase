const express = require('express');
const { Service } = require('../models');
const router = express.Router();

// GET /api/services - Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ department: 1, name: 1 });
    res.json(services.map(service => ({
      id: service._id,
      name: service.name,
      department: service.department,
      isActive: service.isActive,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt
    })));
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/services/:department - Get services by department
router.get('/:department', async (req, res) => {
  try {
    const { department } = req.params;

    // Validate department
    if (!['registrar', 'admissions'].includes(department)) {
      return res.status(400).json({ error: 'Invalid department' });
    }

    const services = await Service.find({ department }).sort({ name: 1 });
    res.json(services.map(service => ({
      id: service._id,
      name: service.name,
      department: service.department,
      isActive: service.isActive,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt
    })));
  } catch (error) {
    console.error('Error fetching department services:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/services/:department/active - Get active services by department
router.get('/:department/active', async (req, res) => {
  try {
    const { department } = req.params;

    // Validate department
    if (!['registrar', 'admissions'].includes(department)) {
      return res.status(400).json({ error: 'Invalid department' });
    }

    const services = await Service.find({
      department,
      isActive: true
    }).sort({ name: 1 });

    res.json(services.map(service => ({
      id: service._id,
      name: service.name,
      department: service.department,
      isActive: service.isActive
    })));
  } catch (error) {
    console.error('Error fetching active services:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/services - Create new service
router.post('/', async (req, res) => {
  try {
    const { name, department } = req.body;

    if (!name || !department) {
      return res.status(400).json({ error: 'Name and department are required' });
    }

    // Validate department
    if (!['registrar', 'admissions'].includes(department)) {
      return res.status(400).json({ error: 'Invalid department' });
    }

    // Check if service name already exists in the department
    const existingService = await Service.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      department
    });

    if (existingService) {
      return res.status(409).json({ error: 'Service with this name already exists in the department' });
    }

    const newService = new Service({
      name: name.trim(),
      department,
      isActive: true
    });

    await newService.save();

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`admin-${department}`).emit('services-updated', {
      type: 'service-added',
      department,
      data: {
        id: newService._id,
        name: newService.name,
        department: newService.department,
        isActive: newService.isActive
      }
    });

    res.status(201).json({
      id: newService._id,
      name: newService.name,
      department: newService.department,
      isActive: newService.isActive,
      createdAt: newService.createdAt,
      updatedAt: newService.updatedAt
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/services/:id/toggle - Toggle service active status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Toggle the isActive status
    service.isActive = !service.isActive;
    await service.save();

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`admin-${service.department}`).emit('services-updated', {
      type: 'service-toggled',
      department: service.department,
      data: {
        id: service._id,
        name: service.name,
        isActive: service.isActive
      }
    });

    res.json({
      id: service._id,
      name: service.name,
      department: service.department,
      isActive: service.isActive,
      updatedAt: service.updatedAt
    });
  } catch (error) {
    console.error('Error toggling service:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/services/:id - Delete service
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const deletedService = {
      id: service._id,
      name: service.name,
      department: service.department
    };

    await Service.findByIdAndDelete(id);

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`admin-${deletedService.department}`).emit('services-updated', {
      type: 'service-deleted',
      department: deletedService.department,
      data: { id: deletedService.id }
    });

    res.json({
      message: 'Service deleted successfully',
      service: deletedService
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
