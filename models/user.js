// user.js
'use strict';
const { Model, Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Appointment, { foreignKey: 'userId' });
      User.belongsToMany(models.Doctor, { through: 'user_doctor', foreignKey: 'userId' });
    }

    static async findByEmail(email) {
      return await this.findOne({ where: { email } });
  }

    static async comparePassword(password) {
      return await bcrypt.compare(password, this.password);
    }

    static async calculateAge(DOB) {
      const foundDate = new Date(DOB);
      const currentDate = new Date();
      const ageInYears = currentDate.getFullYear() - foundDate.getFullYear();
      return ageInYears;
    }

    get toDate() {
      const today = new Date();
      const age = Math.floor((today - this.DOB) / (365.25 * 24 * 60 * 60 * 1000));
      return age;
    }

    get formatDOB(){
      return this.DOB.toISOString().substr(0,10)
    }
  }
  
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Email must be valid" }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "The password shouldn't be empty" },
        len: { args: [6, 255], msg: "Password must be at least 6 character" }
      }
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Full names shouldn't be blank" }
      }
    },
    DOB: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: { msg: "Invalid date of birth format" }
      }
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Phone Numbers shouldn't be empty" },
        isNumeric: { msg: "Phone Numbers have to be Numbers" }
      }
    },
    address: { 
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Addresses should not be empty" }
      },
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Gender must be filled"}
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate:  async (user) => {
        // console.log(user.password, "before");
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        // console.log(hash, "after");
        user.password = hash;
    },
      // beforeUpdate: async (user) => {
      //   if (user.changed('password')) {
      //     const salt = await bcrypt.genSalt();
      //     user.password = await bcrypt.hash(user.password, salt);
      //   }
      // }
    }
  });
  return User;
};
