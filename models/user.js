'use strict';
const bcrypt = require('bcryptjs')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.UserProfile, {foreignKey: "UserId"})
      User.belongsToMany(models.Course, { through: "UserCourses"})
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'E-mail is required'
        },
        isEmail: {
          args: true,
          msg: 'Fill e-mail with true format'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Password is required'
        }
      }
    },
    role: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate(instance, options) {
        let kata = ""
        var salt = bcrypt.genSaltSync(8);
        var hash = bcrypt.hashSync(instance.password, salt);
        instance.password = hash
        kata = instance.email.split("@")[1]
        kata = kata.split(".")[0]
        if (kata == 'admin' || kata == 'Admin') {
          instance.role = 1
        } else {
          instance.role = 2
        }
      }

    }
  });
  return User;
};