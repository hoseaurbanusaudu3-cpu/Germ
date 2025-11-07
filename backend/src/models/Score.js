module.exports = (sequelize, DataTypes) => {
  const Score = sequelize.define('Score', {
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
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'subjects',
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
    ca1: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 20
      }
    },
    ca2: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 20
      }
    },
    exam: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 60
      }
    },
    total: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0
    },
    grade: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    class_average: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    class_min: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    class_max: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('draft', 'submitted', 'locked'),
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
    }
  }, {
    tableName: 'scores',
    timestamps: true,
    underscored: true,
    indexes: [
      { 
        unique: true, 
        fields: ['student_id', 'subject_id', 'term_id', 'session_id'],
        name: 'unique_student_subject_term_session'
      },
      { fields: ['class_id'] },
      { fields: ['status'] }
    ]
  });

  Score.associate = (models) => {
    Score.belongsTo(models.Student, { foreignKey: 'student_id' });
    Score.belongsTo(models.Class, { foreignKey: 'class_id' });
    Score.belongsTo(models.Subject, { foreignKey: 'subject_id' });
    Score.belongsTo(models.Term, { foreignKey: 'term_id' });
    Score.belongsTo(models.Session, { foreignKey: 'session_id' });
    Score.belongsTo(models.User, { foreignKey: 'submitted_by', as: 'submitter' });
  };

  return Score;
};
