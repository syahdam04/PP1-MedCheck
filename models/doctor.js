'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Doctor.hasMany(models.Appointment, { foreignKey: 'doctorId' });
      Doctor.belongsToMany(models.User, { through: 'user_doctor', foreignKey: 'doctorId' });
    }
    
  }
  Doctor.init({
    specialization: DataTypes.STRING,
    license_number: DataTypes.STRING,
    hospital: DataTypes.STRING,
    consultation_fee: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Doctor',
  });
  return Doctor;
};