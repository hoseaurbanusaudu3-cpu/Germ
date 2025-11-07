module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    receiver_role: {
      type: DataTypes.ENUM('all', 'admin', 'teacher', 'class_teacher', 'accountant', 'parent'),
      allowNull: false,
      defaultValue: 'all'
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: 'Specific user ID if targeted notification, null for role-based'
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    link: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Optional link to related resource'
    },
    type: {
      type: DataTypes.ENUM('info', 'warning', 'success', 'error'),
      defaultValue: 'info'
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'notifications',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['receiver_id'] },
      { fields: ['receiver_role'] },
      { fields: ['is_read'] }
    ]
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: 'sender_id', as: 'sender' });
    Notification.belongsTo(models.User, { foreignKey: 'receiver_id', as: 'receiver' });
  };

  return Notification;
};
