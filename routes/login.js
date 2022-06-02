"use strict"
const Controller = require('../controllers/controller')
const express = require("express");
const router = express.Router();

router.get("/", Controller.loginForm);
router.post("/", Controller.cekLogin);

module.exports = router;