"use strict";
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
const { User, Course, UserCourse, UserProfile } = require("../models");
const formatRupiah = require("../helper/formatRP");
const { options } = require("../routes");

class HomeController {
  static home(req, res) {
    let id = req.session.iduser;
    let option= {
      where: {}
    }
    if(id){
      option = {
        where: {
          id:id
        }
      }
    }
    UserProfile.findAll(option)
    .then((dataUser)=>{
      console.log(dataUser, "ini data user");
      console.log(id, "ini id user");
      res.render("home", { id, dataUser });
    })
    .catch((err)=>{
      console.log(err);
      res.send(err)
    })
  }

  static coursesList(req, res) {
    let options = {
      where: {},
    };
    if (req.query.searchName) {
      options.where = {
        ...options.where,
        name: {
          [Op.iLike]: `%${req.query.searchName}%`,
        },
      };
    }
    if (req.query.searchDesc) {
      options.where = {
        ...options.where,
        description: {
          [Op.iLike]: `%${req.query.searchDesc}%`,
        },
      };
    }
    const role = req.session.roleuser;
    const userid = req.session.iduser;
    let purchased;
    let output;
    Course.findAll(options)
      .then((data) => {
        output = data;
        return Course.findAll({
          attributes: ["id"],
          include: {
            model: User,
            where: {
              id: userid,
            },
          },
        });
      })
      .then((data) => {
        purchased = data;
        return UserProfile.findAll({
          where: {
            id: userid,
          },
        });
      })
      .then((userprofile) => {
        res.render("courses", { data: output, formatRupiah, role, userid, purchased: purchased, userprofile });
      })
      .catch((err) => {
        console.log(err);
        res.render(err);
      });
  }

  static buy(req, res) {
    const CourseId = req.params.id;
    UserCourse.create({
      CourseId: +CourseId,
      UserId: req.session.iduser,
    })
      .then(() => {
        res.redirect("/home/courses");
      })
      .catch((err) => {
        res.render(err);
      });
  }

  static addCourseForm(req, res) {
    let errors = req.query.errors;
    res.render("addPage", { errors });
  }

  static addCourse(req, res) {
    const body = req.body;
    let mailOptions
    let transporter
    const { name, imageURL, description, price } = body;
    Course.create({
      name: name,
      imageURL: imageURL,
      description: description,
      price: +price,
    })

    .then((dataUser)=> {
        return User.findAll({
            include: UserProfile
        })
    })
      .then((data) => {
           transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                      user: 'watchus2022@gmail.com',
                      pass: 'postgres123'
                  }
              });
          data.forEach((el)=>{
         mailOptions = {
            from: 'watchus2022@gmail.com',
            to: el.email,
            subject: `Hello ${el.UserProfile.fullName} Check our new Product Now`,
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
            });
    })
        res.redirect("/home/courses");
      })
      .catch((err) => {
        let result = [];
        console.log(err);
        if (err.name == "SequelizeValidationError") {
          err.errors.forEach((el) => {
            result.push(el.message);
          });
          return res.redirect(`/home/courses/add?errors=${result}`);
        } else {
          res.send(err);
        }
      });
  }

  static editCourseForm(req, res) {
    const id = req.params.id;
    Course.findAll({
      where: { id: +id },
    })
      .then((data) => {
        let errors = req.query.errors;
        res.render("editPage", { data, errors });
      })
      .catch((err) => {
        res.render(err);
      });
  }

  static editCourse(req, res) {
    const body = req.body;
    const { name, imageURL, description, price } = body;
    console.log(body);
    Course.update(
      {
        name: name,
        imageURL: imageURL,
        description: description,
        price: +price,
      },
      {
        where: {
          id: +req.params.id,
        },
      }
    )
      .then(() => {
        res.redirect("/home/courses");
      })
      .catch((err) => {
        let result = [];
        if (err.name == "SequelizeValidationError") {
          err.errors.forEach((x) => {
            result.push(x.message);
          });
          return res.redirect(`/home/courses/edit/${req.params.id}?errors=${result}`);
        } else {
          res.send(err);
        }
      });
  }

  static delete(req, res) {
    const CourseId = req.params.id;
    Course.deleteCourse(CourseId)
      .then(() => res.redirect("/home/courses"))
      .catch((err) => {
        res.render(err);
      });
  }
}

module.exports = HomeController;
