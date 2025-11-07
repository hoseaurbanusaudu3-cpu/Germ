module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define('Class', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'e.g., JSS 1A, SSS 2B'
    },
    level: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'e.g., JSS 1, SSS 2'
    },
    class_teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      defaultValue: 40
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    no_in_class: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'classes',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['level'] },
      { fields: ['class_teacher_id'] }
    ]
  });

  Class.associate = (models) => {
    Class.belongsTo(models.User, { foreignKey: 'class_teacher_id', as: 'classTeacher' });
    Class.hasMany(models.Student, { foreignKey: 'class_id' });
    Class.hasMany(models.ClassSubject, { foreignKey: 'class_id' });
    Class.hasMany(models.Score, { foreignKey: 'class_id' });
    Class.hasMany(models.CompiledResult, { foreignKey: 'class_id' });
    Class.hasMany(models.Fee, { foreignKey: 'class_id' });
    Class.hasMany(models.Payment, { foreignKey: 'class_id' });
  };

  return Class;
};
