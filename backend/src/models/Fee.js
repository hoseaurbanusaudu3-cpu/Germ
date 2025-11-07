module.exports = (sequelize, DataTypes) => {
  const Fee = sequelize.define('Fee', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'classes',
        key: 'id'
      }
    },
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sessions',
        key: 'id'
      }
    },
    term_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'terms',
        key: 'id'
      }
    },
    breakdown_json: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: 'JSON object with fee breakdown: {tuition, development, sports, exam, books, uniform, transport}'
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    tableName: 'fees',
    timestamps: true,
    underscored: true,
    indexes: [
      { 
        unique: true, 
        fields: ['class_id', 'session_id', 'term_id'],
        name: 'unique_class_session_term'
      }
    ]
  });

  Fee.associate = (models) => {
    Fee.belongsTo(models.Class, { foreignKey: 'class_id' });
    Fee.belongsTo(models.Session, { foreignKey: 'session_id' });
    Fee.belongsTo(models.Term, { foreignKey: 'term_id' });
  };

  return Fee;
};
