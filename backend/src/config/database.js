require('dotenv').config();

// Determine dialect from environment (postgres for Supabase, mysql for local/other)
const dialect = process.env.DB_DIALECT || 'mysql';
const defaultPort = dialect === 'postgres' ? 5432 : 3306;

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'graceland_db',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || defaultPort,
    dialect: dialect,
    logging: console.log,
    dialectOptions: dialect === 'postgres' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {},
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME + '_test' || 'graceland_db_test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || defaultPort,
    dialect: dialect,
    logging: false
  },
  production: {
    // Support for DATABASE_URL (Render, Heroku, Supabase, etc.)
    use_env_variable: 'DATABASE_URL',
    dialect: dialect,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000
    }
  }
};
