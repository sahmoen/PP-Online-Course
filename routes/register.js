"use strict"
const express = require("express")
const Controller = require('../controllers/controller')
const router = express.Router();

router.get('/', Controller.registerForm)
router.post('/', Controller.postRegister)

module.exports = router;