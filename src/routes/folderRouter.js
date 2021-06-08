const express = require('express');
const router = express.Router();
const folderController = require('../controller/folderController');



// http://localhost:5000/folder/delete/:id
router.get('/find', folderController.find);

// http://localhost:5000/folder/delete/:id?_method=DELETE
router.delete('/delete/:id', folderController.deleteFolder);

// http://localhost:5000/folder/update?_method=PUT
router.put('/update', folderController.updateFolder);

// http://localhost:5000/folder/add
router.post('/add', folderController.addFolder); //tu day bay den src/controller/folder/Controller de xy ly;

// http://localhost:5000/folder/list
router.get('/list', folderController.list);



module.exports = router;