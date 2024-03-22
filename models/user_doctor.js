'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user_doctor.belongsTo(models.User, { foreignKey: 'userId' });
      user_doctor.belongsTo(models.Doctor, { foreignKey: 'doctorId' });
    }
    
  }
  user_doctor.init({
    userId: DataTypes.INTEGER,
    doctorId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user_doctor',
  });
  return user_doctor;
};