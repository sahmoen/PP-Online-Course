"use strict"
const Controller = require('../controllers/controller')
const express = require("express");
const router = express.Router();

router.use('/', Controller.logOutSesi)

module.exports = router;