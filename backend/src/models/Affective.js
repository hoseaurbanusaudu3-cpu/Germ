module.exports = (sequelize, DataTypes) => {
  const Affective = sequelize.define('Affective', {
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
      comment: 'e.g., Attentiveness, Honesty, Neatness, Obedience'
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
    tableName: 'affective',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['compiled_id'] }
    ]
  });

  Affective.associate = (models) => {
    Affective.belongsTo(models.CompiledResult, { foreignKey: 'compiled_id' });
  };

  return Affective;
};
