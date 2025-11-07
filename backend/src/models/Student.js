module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    reg_no: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: 'Registration/Admission Number'
    },
    full_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Date of Birth'
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female'),
      allowNull: false
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'classes',
        key: 'id'
      }
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    photo_path: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    genotype: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    blood_group: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    health_note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    parent_phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    parent_email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'graduated', 'withdrawn'),
      defaultValue: 'active'
    }
  }, {
    tableName: 'students',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['reg_no'] },
      { fields: ['class_id'] },
      { fields: ['parent_id'] },
      { fields: ['status'] }
    ]
  });

  Student.associate = (models) => {
    Student.belongsTo(models.Class, { foreignKey: 'class_id' });
    Student.belongsTo(models.User, { foreignKey: 'parent_id', as: 'parent' });
    Student.hasMany(models.Score, { foreignKey: 'student_id' });
    Student.hasMany(models.CompiledResult, { foreignKey: 'student_id' });
    Student.hasMany(models.Payment, { foreignKey: 'student_id' });
  };

  return Student;
};
