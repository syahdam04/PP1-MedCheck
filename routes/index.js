const express = require('express')
const Controller = require('../controllers/controller')
const router = express.Router()
const session = require('express-session');

router.get('/home', Controller.home)
router.get('/logout', Controller.userLogout)

router.get('/users', Controller.getAllUsers);
router.get('/users/add', Controller.renderAddUser);
router.post('/users/add', Controller.handlerAddUser);
router.get('/users/:id/update', Controller.renderUpdateUser);
router.post('/users/:id/update', Controller.handlerUpdateUser);
router.get('/users/:id', Controller.getUserDetails);
router.get('/users/:id/delete', Controller.deleteUser)

// router.use(function(req, res, next) {
//     console.log('Time:', Date.now())
//     next()
// })

const coba = function (req, res, next){
    console.log('Time:', Date.now());
    next()
}

router.get('/jadwal', Controller.jadwalDokter)
router.get('/listdokter', Controller.listDokter)
router.get('/janjisetia', Controller.getCreateAppointment)
router.post('/janjisetia', Controller.getCreateAppointment)
router.get('/service', Controller.service)
router.get('/contact', Controller.contact);
router.get('/artikel', Controller.artikel)
router.get('/login', coba, Controller.renderLogin)
router.post('/login', coba,  Controller.handlerLogin)
router.get('/register', Controller.renderRegister);
router.post('/register', Controller.handlerRegister);
router.get('/about', Controller.about)





module.exports = router