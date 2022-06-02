const { UserProfile, User } = require('../models')
const bcrypt = require('bcryptjs')
const nodemailer = require("nodemailer");

class Controller {

    static home(req, res){
        res.redirect('/home');
    }

    static registerForm(req, res) {
        let errors = req.query.errors
        res.render('register.ejs', {errors})
    }
    static loginForm(req, res) {
        let errors = req.query.errors
        res.render('login.ejs', {errors})
    }

    static postRegister(req, res) {
        // console.log(req.body);
        let subscribe = req.body.subscribe
        const { email, password, dateOfBirth, gender, firstName, lastName } = req.body
        User.create({
            email: email,
            password: password
        })
            .then(data => {
                return UserProfile.create({
                    firstName: firstName,
                    lastName: lastName,
                    dateOfBirth: dateOfBirth,
                    gender: gender,
                    UserId: data.id
                })
                    .then(data2 => {
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'watchus2022@gmail.com',
                                pass: 'postgres123'
                            }
                        });
                        
                        const mailOptions = {
                            from: 'watchus2022@gmail.com',
                            to: email,
                            subject: 'Thank you for subscribe',
                            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
                        };
                        if(subscribe){
                            transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Email sent: ' + info.response);
                                }
                                });
                        }
                        res.redirect('/login')
                    })
            })
                .catch(err => {
                let result = []
                if (err.name == "SequelizeValidationError") {
                err.errors.forEach(el=>{
                    result.push(el.message)
                })
                return res.redirect(`/register?errors=${result}`)
                } else {
                  console.log(err)
                  return res.send(err)

                }
                
            })      
    }

    static cekLogin(req, res) {
        const { email, password } = req.body
        User.findOne({
            where: {
                email: email
            }
        })
            .then(user => {
                if (user) {
                    const isValidPassword = bcrypt.compareSync(password, user.password)
                    if (isValidPassword) {   
                        // Case saat berhasil login
                        req.session.iduser = user.id //set session 
                        req.session.roleuser = user.role //set role
                        res.redirect('/home')
                    } else {
                        let errors = 'Invalid username/password'
                        return res.redirect(`/login?errors=${errors}`)
                        // return res.send('email dan password gak cocok boz')
                    }
                } else {
                    let errors = 'Invalid username/password'
                    return res.redirect(`/login?errors=${errors}`)
                //   return  res.send('E-mail belom terdaftar')
                }
            })
            .catch(err => {
                console.log(err);
                res.send(err)
            })
    }


        static logOutSesi(req,res){
            req.session.destroy(err=>{
                if(err){
                    res.send(err)
                } else {
                    res.redirect('/login')
                }
            })

        }

}
module.exports = Controller