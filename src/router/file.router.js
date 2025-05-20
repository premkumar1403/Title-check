const express = require("express")
const fileController = require("../controller/file.controller")
const router = express.Router();
const upload = require("../middleware/multer")

//file uploading route
router.post("/file-upload",upload.single("file"),fileController.createFile);
router.post("/file-update", upload.single("file"), fileController.updateField);


module.exports = router;