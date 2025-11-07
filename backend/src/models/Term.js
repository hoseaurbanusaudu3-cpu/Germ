module.exports = (sequelize, DataTypes) => {
  const Term = sequelize.define('Term', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'e.g., First Term, Second Term, Third Term'
    },
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sessions',
        key: 'id'
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    next_term_begins: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    next_term_begins: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'terms',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['session_id'] },
      { fields: ['is_active'] }
    ]
  });

  Term.associate = (models) => {
    Term.belongsTo(models.Session, { foreignKey: 'session_id' });
    Term.hasMany(models.Score, { foreignKey: 'term_id' });
    Term.hasMany(models.CompiledResult, { foreignKey: 'term_id' });
    Term.hasMany(models.Fee, { foreignKey: 'term_id' });
  };

  return Term;
};
