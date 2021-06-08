/*
处理文件上传的路由
 */
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const dirPath = path.join(__dirname, '..', 'public/images');


const storage = multer.diskStorage({
    // destination: 'upload' //destination 的value为string时,服务启动将会自动创建文件夹
    destination: function (req, file, cb) { //destination 的value为函数 需手动创建文件夹
        // console.log('destination()', file)

        //fs.existsSync(path) Returns true if the path exists, false otherwise.
        if (!fs.existsSync(dirPath)) {
            fs.mkdir(dirPath, function (err) {
                if (err) {
                    console.log(err)
                } else {
                    //destination is used to determine within which folder the uploaded files should be stored. This can also be given as a string (e.g. '/tmp/uploads')
                    cb(null, dirPath)
                }
            })
        } else {
            cb(null, dirPath)
        }
    },
    filename: function (req, file, cb) {
        // console.log(file);
        // var ext = path.extname(file.originalname)
        // cb(null, file.fieldname + '-' + Date.now() + ext)
        cb(null, file.originalname);
    }
})
const upload = multer({ storage })

const uploadSingle = upload.single('image') //HTML 里  element <input type='upload' name='image'/> 的 name

module.exports = function fileUpload(router) {

    // http://localhost:5000/upload/img/ [POST]
    // 上传图片
    router.post('/img', (req, res) => {
        uploadSingle(req, res, function (err) { //错误处理
            if (err) {
                return res.send({
                    status: 1,
                    msg: 'Upload file failure !'
                })
            }
            var file = req.file
            res.json({
                status: 0,
                data: {
                    name: file.filename,
                    url: 'http://localhost:5000/images/' + file.filename
                }
            })

        })
    })

    // http://localhost:5000/upload/img/delete [POST]
    // 删除图片
    router.post('/img/delete', (req, res) => {
        const { name } = req.body
        //fs.unlink(path, callback) : callback <Function> : err <Error>  
        //Asynchronously removes a file or symbolic link. No arguments other than a possible exception are given to the completion callback.
        fs.unlink(path.join(dirPath, name), (err) => {
            if (err) {
                console.log(err)
                res.json({
                    status: 1,
                    msg: 'Delete file failure !'
                })
            } else {
                res.json({
                    status: 0
                })
            }
        })
    })
}
