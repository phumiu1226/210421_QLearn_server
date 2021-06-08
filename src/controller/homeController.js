class HomeController {
    //[GET] /
    index(req, res, next) {
        res.send('day la trang home');
    }
}



module.exports = new HomeController;