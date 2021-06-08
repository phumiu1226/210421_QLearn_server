const express = require('express');
const app = express();
const methodOverride = require('method-override'); //override dung de sua request post , thanh request put , delete
const db = require('./config/db');
const path = require('path'); //dung cho static file
const route = require('./routes')
const morgan = require('morgan'); //hien thi HTTP logger de xem co gui request thanh cong hay khong

//---------------------------------cors-----------------------------------
//muon ben client co then gui request qua day chung ta phai them CORS (Cross-Origin Resource Sharing) , de xy ly :
//cach 1 : them Access-Control-Allow-Origin: *     vao header
//cach 2 :  npm install cors
const cors = require('cors');
// Set up a whitelist and check against it:
let whitelist = ['http://localhost:5000/'];
let corsOptions = {
    origin: function (origin, callback) {
        console.log('whitelist : ' + whitelist, 'origin : ' + origin);
        if (origin === undefined) callback(null, true)
        else if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}
// Then pass them to cors:
app.use(cors(corsOptions));
// app.use(cors());
//---------------------------------end cors-----------------------------------

//---------------------------------over ride-----------------------------------
//npm install method-override :  Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn’t support it.
// override with POST having ?_method=DELETE
/*
    <form method="POST" action="/resource?_method=DELETE">
        <button type="submit">Delete resource</button>
    </form>
*/
app.use(methodOverride('_method'));
//---------------------------------end over ride-----------------------------------
const port = 5000;


//static files
//truy cap http://localhost:5000/images/icon-avatar-default.png de xem anh 
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('combined')); //cai dat morgan


//The json and urlencoded middleware are both part of bodyParser.
//phan nay de them middleware xy ly du lieu tu form(method post) => truyen du lieu cho req.body (express tu phien ban 4.16.0 moi co)
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

route(app); // tu day bay den src/routers/index

db.connectDB()
    .then(value => {
        console.log('connect database success !!')
        //khi ket noi db thanh con moi start server
        app.listen(port, () => { console.log('server started , port : ' + port) });
    })
    .catch(
        //ket noi db that bai
        e => {
            console.log('connect database failure', e)
        }
    );



