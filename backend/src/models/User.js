module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    role: {
      type: DataTypes.ENUM('admin', 'teacher', 'class_teacher', 'accountant', 'parent'),
      allowNull: false,
      defaultValue: 'teacher'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['email'] },
      { fields: ['role'] },
      { fields: ['status'] }
    ]
  });

  User.associate = (models) => {
    User.hasMany(models.ActivityLog, { foreignKey: 'user_id' });
    User.hasMany(models.Notification, { foreignKey: 'sender_id', as: 'sentNotifications' });
    User.hasMany(models.RefreshToken, { foreignKey: 'user_id' });
  };

  return User;
};
