'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsToMany(models.User, {
        through: "UserCourses"
      })
    }

    static deleteCourse(idCourse){
      return Course.destroy({
        where: {
          id: idCourse
        }
      })
    }
  }
  Course.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name is Required"
        },
        notNull: {
          msg: "Name is Required"
        }
      }
    },
    imageURL: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "URL Required"
        },
        notNull: {
          msg: "URL required"
        },
        isUrl: {
          msg: "needs to be a url"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "description Required"
        },
        notNull: {
          msg: "description required"
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Number Required"
        },
        notNull: {
          msg: "Number required"
        },
        isNumeric: {
          msg: "onput must be number"
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};