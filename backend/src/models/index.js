const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions
  }
);

const db = {};

// Import models
db.User = require('./User')(sequelize, Sequelize.DataTypes);
db.Session = require('./Session')(sequelize, Sequelize.DataTypes);
db.Term = require('./Term')(sequelize, Sequelize.DataTypes);
db.Class = require('./Class')(sequelize, Sequelize.DataTypes);
db.Subject = require('./Subject')(sequelize, Sequelize.DataTypes);
db.ClassSubject = require('./ClassSubject')(sequelize, Sequelize.DataTypes);
db.Student = require('./Student')(sequelize, Sequelize.DataTypes);
db.Score = require('./Score')(sequelize, Sequelize.DataTypes);
db.CompiledResult = require('./CompiledResult')(sequelize, Sequelize.DataTypes);
db.Affective = require('./Affective')(sequelize, Sequelize.DataTypes);
db.Psychomotor = require('./Psychomotor')(sequelize, Sequelize.DataTypes);
db.Fee = require('./Fee')(sequelize, Sequelize.DataTypes);
db.Payment = require('./Payment')(sequelize, Sequelize.DataTypes);
db.Notification = require('./Notification')(sequelize, Sequelize.DataTypes);
db.ActivityLog = require('./ActivityLog')(sequelize, Sequelize.DataTypes);
db.RefreshToken = require('./RefreshToken')(sequelize, Sequelize.DataTypes);

// Define associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
