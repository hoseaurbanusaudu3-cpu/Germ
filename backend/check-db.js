// Quick script to check database connection and create tables
require('dotenv').config();
const { sequelize } = require('./src/models');

async function checkDatabase() {
  try {
    console.log('🔍 Checking database connection...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    // Check if tables exist
    const [results] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' OR table_schema = DATABASE()
    `);
    
    console.log('\n📊 Existing tables:', results.length);
    if (results.length > 0) {
      results.forEach(row => {
        console.log('  -', row.table_name || row.TABLE_NAME);
      });
    } else {
      console.log('  ⚠️  No tables found!');
    }
    
    // Sync database (create tables)
    console.log('\n🔨 Creating/updating tables...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized!');
    
    // Check tables again
    const [newResults] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' OR table_schema = DATABASE()
    `);
    
    console.log('\n📊 Tables after sync:', newResults.length);
    newResults.forEach(row => {
      console.log('  -', row.table_name || row.TABLE_NAME);
    });
    
    console.log('\n✅ Database is ready!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

checkDatabase();
