// const express = require("express")
// const fileController = require("../controller/file.controller")
// const router = express.Router();
// const upload = require("../middleware/multer")

// //file uploading route
// router.post("/file-upload",upload.single("file"),fileController.createFile);

// router.post('/file-get', upload.single('file'), fileController.getFile);

// module.exports = router;

const express = require("express");
const fileController = require("../controller/file.controller");
const upload = require("../middleware/multer");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Files
 *   description: File upload and retrieval
 */

/**
 * @swagger
 * /file-upload:
 *   post:
 *     summary: Upload a file
 *     tags: [Files]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         description: No file provided or invalid format
 */
router.post("/file-upload", upload.single("file"), fileController.createFile);

/**
 * @swagger
 * /file-get:
 *   post:
 *     summary: Retrieve a previously uploaded file
 *     tags: [Files]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File data returned
 *       404:
 *         description: File not found
 */
router.post('/file-get', upload.single('file'), fileController.getFile);

module.exports = router;