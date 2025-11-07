module.exports = (sequelize, DataTypes) => {
  const Psychomotor = sequelize.define('Psychomotor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    compiled_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'compiled_results',
        key: 'id'
      }
    },
    attribute: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'e.g., Handwriting, Sports, Verbal Fluency'
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    remark: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'psychomotor',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['compiled_id'] }
    ]
  });

  Psychomotor.associate = (models) => {
    Psychomotor.belongsTo(models.CompiledResult, { foreignKey: 'compiled_id' });
  };

  return Psychomotor;
};
