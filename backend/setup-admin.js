/**
 * SIMPLE ADMIN SETUP SCRIPT
 * Run this once to create admin user
 */

const bcrypt = require('bcryptjs');
const { sequelize, User } = require('./src/models');

async function setupAdmin() {
  try {
    console.log('🔧 Setting up admin user...\n');

    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Check if admin exists
    const existingAdmin = await User.findOne({ 
      where: { email: 'admin@gra.edu.ng' } 
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('📧 Email: admin@gra.edu.ng');
      console.log('🔑 Password: admin123');
      console.log('👤 Role: admin\n');
      
      // Update password to ensure it's correct
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await existingAdmin.update({ 
        password_hash: hashedPassword,
        status: 'active'
      });
      console.log('✅ Password reset to: admin123\n');
    } else {
      // Create new admin
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await User.create({
        role: 'admin',
        name: 'System Administrator',
        email: 'admin@gra.edu.ng',
        phone: '+2348012345678',
        password_hash: hashedPassword,
        status: 'active'
      });

      console.log('✅ Admin user created successfully!\n');
      console.log('📧 Email: admin@gra.edu.ng');
      console.log('🔑 Password: admin123');
      console.log('👤 Role: admin\n');
    }

    console.log('═══════════════════════════════════════');
    console.log('  LOGIN CREDENTIALS');
    console.log('═══════════════════════════════════════');
    console.log('  Email:    admin@gra.edu.ng');
    console.log('  Password: admin123');
    console.log('  Role:     Admin');
    console.log('═══════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupAdmin();
