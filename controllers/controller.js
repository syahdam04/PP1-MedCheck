const {User, Doctor, user_doctor, Appointment} = require('../models/index')
const { Op } = require('sequelize')
const bcrypt = require('bcrypt');
const passport = require('../config/passport');
const { error } = require('console');
const age = require('../helpers/helper')

class Controller{

    static async home(req, res) {
        try {
          const user = req.session.user
          const doctors = await Doctor.findAll();
            const { search } = req.query;
            let users = [];
    
            if (search) {
                users = await User.findAll({
                    where: {
                        fullName: {
                            [Op.like]: '%' + search + '%'
                        }
                    }
                });
            } else {
                users = await User.findAll();
            }
    
            res.render('home', { users, search, user, doctors });
        } catch (error) {
            res.send(error);
        }
    }

    static async userLogout(req, res){
        try {
            req.session.destroy((err) => {
                if (err) {
                  console.error('Error destroying session:', err);
                  return res.status(500).send('Error logging out');
                }
                res.redirect('/login');
              });
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async jadwalDokter(req, res){
        try {
            // const user = User.findById(req.session.user);
            // if (!user) {
            //   res.redirect('/login')
            // }
            // const appointments = await Appointment.find({ user: user.id });
            // res.render('jadwal',{ user, appointments });
        } catch (error) {
            
        }
    }
    
    

    static async service(req, res){
        try {
            res.render('service')
        } catch (error) {
            res.send(error)
        }
    }

    static async artikel(req, res){
        try {
            res.render('articles')
        } catch (error) {
            res.send(error)
        }
    }

    static async contact(req, res){
        try {
            res.render('contact')
        } catch (error) {
            res.send(error)
        }
    }

    static async renderLogin(req, res){
        try {
            const user = req.session.user
            res.render('login', { user: req.session.user, error:req.query.error, user });
        } catch (error) {
            res.send(error)
        }
    }

    static async handlerLogin(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findByEmail(email);
    
            if (!user) {
                const error = "Email tidak terdaftar";
                res.redirect('/login?error='+ error)
            }
    
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                const error = "Password salah";
                res.redirect('/login?error='+ error)
            }
            
            req.session.user = user;
            
            res.redirect('/home');
        } catch (error) {
            // return res.send(error);
            console.log(error.name);
        }
    }

    static async listDokter(req, res){
        try {
            const data = await Doctor.findAll()
            res.render('listdokter', {data})
        } catch (error) {
            res.send(error)
        }
    }
    
    static async getCreateAppointment(req, res){
        try {
            const users = await User.findAll();
            const doctors = await Doctor.findAll();
            res.render('buatjanji', { users, doctors });
        } catch (error) {
            console.error(error);
            res.send(error);
        }
    }

    static async postCreateAppointment(req, res){
        try {
            const { user, doctor, appointment_date } = req.body;
            await Appointment.create({
                userId: user,
                doctorId: doctor,
                appointment_date,
                status: 'Scheduled'
            });
            res.redirect('/listdokter');
        } catch (error) {
            console.error(error);
            res.send(error);
        }
    }
    

    static async renderRegister(req, res) {
        try {
            const { errors } = req.query
            res.render('register', {error:req.query.error, errors });
        } catch (error) {
            res.send(error);
        }
    }

    static async handlerRegister(req, res) {
        try {
            const { email, password, fullName, DOB, gender, phone_number, address } = req.body;
    
            const user = await User.findOne({ where: { email } });
            if (user) {
                const error = "Email sudah digunakan";
                res.redirect('/register?error='+ error)
            }
    
            await User.create({
                email,
                password,
                fullName,
                gender: gender,
                DOB,
                phone_number,
                address,
            });
    
            res.redirect('/login');
        } catch (error) {
            // console.log(error.name);
            if (error.name === 'SequelizeValidationError') {
              // res.send(error.errors)
              const errors = error.errors.map(err => err.message);
              res.redirect(`/register?errors=` + errors)
            } else {
              // console.error(error);
              res.redirect(`/register?errors=internal-server-error`)
            }
          }
    }

    static async about(req, res){
        try {
            res.render('about')
        } catch (error) {
            res.send(error)
        }
    }



    static async getAllUsers(req, res) {
        try {
            const user = req.session.user
            const { search} = req.query;
            let options = {};
            
 

            if (search) {
                options.where = {
                    fullName: {
                        [Op.iLike]: `%${search}%`
                    }
                };
                
            }

            const users = await User.findAll(options);
            res.render('user', { users, age, user, notification:req.query.notification});
        } catch (error) {
            res.send(error);
        }
    }

    static async userDoctorAppoint(req, res){
        try {
            const data = await User.findAll({
                include: [
                    {
                        model: Doctor,
                    },
                    {
                        model: Appointment,
                    }
                ]
            });
            res.render('gabungan', {data})
        } catch (error) {
            res.send(error);
        }
    }
    

    static async renderAddUser(req, res) {
        try {
            res.render('adduser')
        } catch (error) {
            res.send(error)
        }
    }

    static async handlerAddUser(req, res) {
        try {
            const { email, password, fullName, DOB, gender, phone_number, address } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);

            await User.create({
                email,
                password: hashedPassword,
                fullName,
                DOB,
                gender,
                phone_number,
                address,
            });

            res.redirect('/users');
        } catch (error) {
            res.send(error);
        }
    }

    static async getUserDetails(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findByPk(userId);
            if (!user) {
                res.send('User not found');
                return;
            }

            res.render(`/users/${userId}`, { user });
        } catch (error) {
            res.send(error);
        }
    }

    static async renderUpdateUser(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findByPk(userId);
            if (!user) {
                res.send('User not found');
                return;
            }

            res.render(`updateuser`, { user });
        } catch (error) {
            res.send(error);
        }
    }

    static async handlerUpdateUser(req, res) {
        try {
            const userId = req.params.id;
            const { fullName, email, DOB, gender, phone_number, address } = req.body;
    
            const user = await User.findByPk(userId);
            if (!user) {
                res.send('User not found');
                return;
            }
    
            await user.update({
                fullName,
                email,
                DOB,
                gender,
                phone_number,
                address,
            });
    
            res.redirect(`/users`);
        } catch (error) {
            res.send(error);
        }
    }
    

    static async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findByPk(userId);
            if (!user) {
                res.send('User not found');
                return;
            }

            await user.destroy();
            const notification = `user dengan ${user.fullName} berhasil di hapus dari bumi`
            res.redirect('/users?notification='+notification);
        } catch (error) {
            // console.log(error.name);
            // if(error.name === "SequelizeValidationError")
            res.send(error);
        }
    }
}




module.exports = Controller