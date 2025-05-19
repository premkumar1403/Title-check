const express = require("express")
const userController = require("../controller/user.controller")
const router = express.Router()


//signup route from user controller
router.post('/signup', userController.Signup);

//signin route from user controller 
router.post('/signin', userController.Signin);


//signout route from user controller
router.get('/signout', userController.Signout);

module.exports = router;