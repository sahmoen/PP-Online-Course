"use strict"
const HomeController = require("../controllers/homeController")
const express = require("express");
const router = express.Router();

router.get("/", HomeController.home);

router.use((req, res, next) => {
    if(!req.session.iduser){
        let errors = 'Silahkan login terlebih dahulu'
      return res.redirect(`/login?errors=${errors}`)
    } else {
      return next()
    }

})



router.get("/courses", HomeController.coursesList);
router.get("/courses/add", HomeController.addCourseForm);
router.post("/courses/add", HomeController.addCourse);
router.get("/courses/edit/:id", HomeController.editCourseForm);
router.post("/courses/edit/:id", HomeController.editCourse);
router.get("/courses/buy/:id", HomeController.buy);
router.get("/courses/delete/:id", HomeController.delete);

module.exports = router;