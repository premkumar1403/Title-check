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
router.get("/file-get", fileController.getFile);

/**
 * @swagger
 * /file-title:
 *   get:
 *     summary: Search files by title
 *     tags: [Files]
 *     parameters:
 *       - in: query
 *         name: Title
 *         required: true
 *         schema:
 *           type: string
 *         description: The title of the file to search for (case-insensitive and trimmed)
 *     responses:
 *       200:
 *         description: Title matched files fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: File object returned by the search
 *                 message:
 *                   type: string
 *                   example: Title matched files fetched successfully!
 *       400:
 *         description: Invalid title input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: user entered invalid title ensure the spelling and spaces carefully!
 */
router.get("/file-title", fileController.searchTitle);

module.exports = router;