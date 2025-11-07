module.exports = (sequelize, DataTypes) => {
  const ActivityLog = sequelize.define('ActivityLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'e.g., CREATE, UPDATE, DELETE, LOGIN, SUBMIT_SCORES'
    },
    target_table: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Table affected by the action'
    },
    target_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID of the affected record'
    },
    details_json: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Additional details about the action'
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'activity_log',
    timestamps: true,
    underscored: true,
    updatedAt: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['action'] },
      { fields: ['target_table'] },
      { fields: ['created_at'] }
    ]
  });

  ActivityLog.associate = (models) => {
    ActivityLog.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return ActivityLog;
};
