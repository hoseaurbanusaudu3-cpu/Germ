module.exports = (sequelize, DataTypes) => {
  const CompiledResult = sequelize.define('CompiledResult', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id'
      }
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'classes',
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
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sessions',
        key: 'id'
      }
    },
    total_score: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      defaultValue: 0
    },
    average: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_students: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    times_present: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    times_absent: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    class_teacher_comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    principal_comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('draft', 'submitted', 'approved', 'rejected'),
      defaultValue: 'draft'
    },
    submitted_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    submitted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    approved_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'compiled_results',
    timestamps: true,
    underscored: true,
    indexes: [
      { 
        unique: true, 
        fields: ['student_id', 'term_id', 'session_id'],
        name: 'unique_student_term_session'
      },
      { fields: ['class_id'] },
      { fields: ['status'] }
    ]
  });

  CompiledResult.associate = (models) => {
    CompiledResult.belongsTo(models.Student, { foreignKey: 'student_id' });
    CompiledResult.belongsTo(models.Class, { foreignKey: 'class_id' });
    CompiledResult.belongsTo(models.Term, { foreignKey: 'term_id' });
    CompiledResult.belongsTo(models.Session, { foreignKey: 'session_id' });
    CompiledResult.belongsTo(models.User, { foreignKey: 'submitted_by', as: 'submitter' });
    CompiledResult.belongsTo(models.User, { foreignKey: 'approved_by', as: 'approver' });
    CompiledResult.hasMany(models.Affective, { foreignKey: 'compiled_id' });
    CompiledResult.hasMany(models.Psychomotor, { foreignKey: 'compiled_id' });
  };

  return CompiledResult;
};
