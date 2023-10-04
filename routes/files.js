const express = require('express')
const router = express.Router()
const filesController = require('../controllers/FilesController')
const upload = require('../utils/multerUpload')

router.post('/action/upload',upload.array('file'),filesController.upload)

module.exports = router