// const express = require("express")
// const userController = require("../controller/user.controller")
// const router = express.Router()


// //signup route from user controller
// router.post('/signup', userController.Signup);

// //signin route from user controller 
// router.post('/signin', userController.Signin);


// //signout route from user controller
// router.get('/signout', userController.Signout);

// module.exports = router;

const express = require("express");
const userController = require("../controller/user.controller");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User authentication and management
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */
router.post('/signup', userController.Signup);

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Authenticate an existing user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentication successful, returns a token
 *       401:
 *         description: Invalid credentials
 */
router.post('/signin', userController.Signin);

/**
 * @swagger
 * /signout:
 *   get:
 *     summary: Sign out the current user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully signed out
 */
router.get('/signout', userController.Signout);

module.exports = router;