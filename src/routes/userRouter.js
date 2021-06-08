const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');


// http://localhost:5000/user/add
router.post('/add', userController.addUser)
// http://localhost:5000/user/list
router.get('/list', userController.list); //tu day bay den src/controller/userController de xy ly;
// http://localhost:5000/login
router.post('/', userController.login) //cai nay la localhost:5000/login


/*
-----------------------cac vi du co ban--------------------------------
router.get('/list', (req, res, next) => {
    console.log('query : ', req.query); //http://localhost:5000/user/list?q=abc
    res.send(`query : tham so truyen vao la  q =  + ${req.query.q}`);
});


router.post('/list', (req, res, next) => {
    console.log('body : ', req.body); // su dung cho post request
    res.send('body : thuong dung co post request , xem cosole');
});



router.get('/list/:slug', (req, res, next) => {
    console.log('params.slug : ', req.params.slug); //http://localhost:5000/user/list/something 
    res.send(`query : tham so truyen vao la  q =  + ${req.params.slug}`);
});
*/

module.exports = router;