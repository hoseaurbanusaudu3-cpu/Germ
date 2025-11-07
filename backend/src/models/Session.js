module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: 'e.g., 2024/2025'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'sessions',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['is_active'] }
    ]
  });

  Session.associate = (models) => {
    Session.hasMany(models.Term, { foreignKey: 'session_id' });
    Session.hasMany(models.Score, { foreignKey: 'session_id' });
    Session.hasMany(models.CompiledResult, { foreignKey: 'session_id' });
    Session.hasMany(models.Fee, { foreignKey: 'session_id' });
  };

  return Session;
};
