const User = require('../model/userModel');
const md5 = require('md5');

class UserController {

    // [GET] /user/list
    async list(req, res, next) {
        const { pagesize, pagenum } = req.query;
        let rs;
        try {
            if (pagesize) {
                /*
                -ham find({dieu kien},callback(error, result))
                -Nếu bạn ném vào môt hàm callback, như ở trên, câu truy vấn sẽ được thực thi ngay lập tức. Hàm callback sẽ được gọi khi câu truy vấn hoàn tất.
                -Nếu bạn không truyền vào một hàm callback nào thì API sẽ trả về một giá trị kiểu Query
                -Bạn có thể sử dụng đối tượng query này để kéo dài câu truy vấn trước khi thực thi nó 
                (thông qua việc truyền vào một hàm callback) sau sử dụng phương thức exec().
                */
                rs = await User.find() // tìm kiếm tất cả các iser
                    //.select('username password') //tên field
                    .limit(pagesize * 1)// giới hạn kết quả lại 5 bản ghi
                    .skip(((pagenum > 1 ? pagenum : 1) - 1) * pagesize) // nhảy qua bao nhiêu bản ghi
                    // .sort({ username: 1 })  //sắp xếp theo field , nó ưu tiên sắp xếp trước mới tới limit và skip
                    .exec(); //thực thi câu truy vấn
            } else {
                rs = await User.find();
            }
        } catch (error) {
            data = {
                status: 1,
                msg: 'Get user data failer'
            }
        }
        //ket qua tra ve
        res.json({
            status: 0,
            data: [...rs]
        });
    }


    // [POST] /user/add
    async addUser(req, res, next) {
        const user = { ...req.body };
        if (!user.avatar) user.avatar = 'http://localhost:5000/images/icon-avatar-default.png';
        user.password = md5(user.password);
        let rs;
        try {
            rs = await User.create(user);
            res.json({ status: 0, data: { ...rs._doc } });
        } catch (error) {
            console.log('Insert failure', error);
            res.json({ status: 1, msg: 'Network error, please try again later' });
        }
    }


    // [POST] /login
    async login(req, res, next) {
        let { username, password } = req.body;
        password = md5(password);
        let data;
        console.log('login');
        try {
            const rs = await User.findOne({ username, password });
            if (rs) {
                data = { status: 0, data: { ...rs._doc } };
            } else {
                data = { status: 1, msg: 'Username or Password is wrong !' }
            }
        } catch (error) {
            console.log('login failure', error);
            data = { status: 1, msg: 'Network error, please try again later !' }
        }

        return res.json(data);
    }

}

module.exports = new UserController;