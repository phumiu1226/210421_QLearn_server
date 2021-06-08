const express = require('express');
const router = express.Router();
const studySetController = require('../controller/studySetController');


// http://localhost:5000/studysets/add
router.post('/add', studySetController.add); //tu day bay den src/controller/studySetController de xy ly;

// http://localhost:5000/studysets/add-word?_method=PUT
router.put('/add-word', studySetController.addWord);

// http://localhost:5000/studysets/list
router.get('/list', studySetController.list);


// http://localhost:5000/studysets/detail/:id
router.get('/detail/:id', studySetController.detail);

// http://localhost:5000/studysets/delete/:id?_method=DELETE
router.delete('/delete/:id', studySetController.delete);


router.put('/edit-word', studySetController.editWord);

// http://localhost:5000/studysets/remove-word/:id?_method=PUT
router.put('/remove-word', studySetController.removeWord);





module.exports = router;