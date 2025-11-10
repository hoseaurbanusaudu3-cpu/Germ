const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User } = require('../models');

// Check admin status
router.get('/check-admin', async (req, res) => {
  try {
    const admin = await User.findOne({ where: { role: 'admin' } });
    
    if (admin) {
      return res.json({
        success: true,
        message: 'Admin user exists',
        data: {
          email: admin.email,
          name: admin.name,
          status: admin.status
        }
      });
    } else {
      return res.json({
        success: false,
        message: 'No admin user found'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking admin',
      error: error.message
    });
  }
});

// ONE-TIME SETUP ENDPOINT - Create initial admin user
router.post('/create-admin', async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { role: 'admin' } });
    
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin user already exists'
      });
    }

    // Create admin user with credentials from request or defaults
    const { email, password, firstName, lastName } = req.body;
    
    const adminEmail = email || 'admin@gra-gm.top';
    const adminPassword = password || 'Admin123!';
    const adminFirstName = firstName || 'Admin';
    const adminLastName = lastName || 'User';
    
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const admin = await User.create({
      role: 'admin',
      email: adminEmail,
      first_name: adminFirstName,
      last_name: adminLastName,
      password_hash: hashedPassword,
      status: 'active'
    });

    return res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create admin user',
      error: error.message
    });
  }
});

// Reset admin password
router.post('/reset-admin-password', async (req, res) => {
  try {
    const admin = await User.findOne({ where: { role: 'admin' } });
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found'
      });
    }

    // Reset password to admin123
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await admin.update({ 
      password_hash: hashedPassword,
      status: 'active'
    });

    return res.json({
      success: true,
      message: 'Admin password reset successfully',
      data: {
        email: admin.email,
        password: 'admin123'
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message
    });
  }
});

module.exports = router;
