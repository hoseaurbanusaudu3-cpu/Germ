module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
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
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'sessions',
        key: 'id'
      }
    },
    term_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'terms',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    method: {
      type: DataTypes.ENUM('cash', 'bank_transfer', 'online', 'cheque'),
      allowNull: false
    },
    reference: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Transaction reference or receipt number'
    },
    proof_path: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Path to payment proof document'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'verified', 'rejected'),
      defaultValue: 'pending'
    },
    processed_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    processed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'payments',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['student_id'] },
      { fields: ['status'] },
      { fields: ['reference'] }
    ]
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Student, { foreignKey: 'student_id' });
    Payment.belongsTo(models.Class, { foreignKey: 'class_id' });
    Payment.belongsTo(models.Session, { foreignKey: 'session_id' });
    Payment.belongsTo(models.Term, { foreignKey: 'term_id' });
    Payment.belongsTo(models.User, { foreignKey: 'processed_by', as: 'processor' });
  };

  return Payment;
};
