const homeRouter = require('./homeRouter');
const userRouter = require('./userRouter');
const folderRouter = require('./folderRouter');
const studySetRouter = require('./studySetRouter');
const uploadRouter = require('./uploadRouter');

function route(app) {
    app.use('/studysets', studySetRouter);
    app.use('/folder', folderRouter)  // // tu day bay den src/routes/librayRouter (xu ly folder va study sets)
    app.use('/user', userRouter); // tu day bay den src/routes/userRouter
    app.use('/login', userRouter);
    app.use('/upload', uploadRouter);
    app.use('/', homeRouter);
}



module.exports = route;