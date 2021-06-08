const express = require('express');
const router = express.Router();


//upload file
// http://localhost:5000/upload/img/ [POST]
// http://localhost:5000/upload/img/delete [POST]
require('../controller/studySetUploadController')(router);


module.exports = router;