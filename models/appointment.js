'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Appointment.belongsTo(models.User, { foreignKey: 'userId' });
      Appointment.belongsTo(models.Doctor, { foreignKey: 'doctorId' });
    }
    
  }
  Appointment.init({
    userId: DataTypes.INTEGER,
    doctorId: DataTypes.INTEGER,
    appointment_date: DataTypes.DATE,
    status: DataTypes.STRING,
    medicineId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Appointment',
  });
  return Appointment;
};