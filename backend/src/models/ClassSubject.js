module.exports = (sequelize, DataTypes) => {
  const ClassSubject = sequelize.define('ClassSubject', {
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
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'subjects',
        key: 'id'
      }
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'sessions',
        key: 'id'
      }
    }
  }, {
    tableName: 'class_subjects',
    timestamps: true,
    underscored: true,
    indexes: [
      { 
        unique: true, 
        fields: ['class_id', 'subject_id', 'session_id'],
        name: 'unique_class_subject_session'
      },
      { fields: ['teacher_id'] }
    ]
  });

  ClassSubject.associate = (models) => {
    ClassSubject.belongsTo(models.Class, { foreignKey: 'class_id' });
    ClassSubject.belongsTo(models.Subject, { foreignKey: 'subject_id' });
    ClassSubject.belongsTo(models.User, { foreignKey: 'teacher_id', as: 'teacher' });
    ClassSubject.belongsTo(models.Session, { foreignKey: 'session_id' });
  };

  return ClassSubject;
};
