module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define('Subject', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true
    },
    is_core: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Core subjects are mandatory'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    }
  }, {
    tableName: 'subjects',
    timestamps: true,
    underscored: true
  });

  Subject.associate = (models) => {
    Subject.hasMany(models.ClassSubject, { foreignKey: 'subject_id' });
    Subject.hasMany(models.Score, { foreignKey: 'subject_id' });
  };

  return Subject;
};
