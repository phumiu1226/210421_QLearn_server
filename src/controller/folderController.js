//file nay dung de xy ly cac folder - study sets
const FolderModel = require('../model/folderModel');



class folderController {
    // [POST] /folder/add
    async addFolder(req, res, next) {
        let rs = { status: 0 };
        //get data
        try {
            const folder = { ...req.body };
            if (folder.isPublic !== undefined) {
                if (typeof folder.isPublic === 'string') {
                    folder.isPublic = !folder.isPublic || folder.isPublic.toLowerCase() === 'true'; //khong truyen se tra ve true , truyen roi thi xet' thoi
                    folder.isPublicEdit = !folder.isPublic || folder.isPublicEdit.toLowerCase() === 'true';
                }
            }

            //save to database , and set return values to rs 
            let data;

            //insert data into db , using save , return an promise but we cant use , mongoose provide we a toObject method to get data
            data = await new FolderModel(folder).save();
            rs.data = data.toObject();
        } catch (error) {
            console.log('Library insert failure !', error.message);
            rs.status = 1
            rs.msg = 'Network error, please try it again later !';
        }

        //send rs to client
        res.json(rs);

    }

    // [POST] /folder/list
    async list(req, res, next) {
        const { pagenum = 1, pagesize, parentId, userId } = req.query;
        const rs = { status: 0 };
        let query = {}
        let folders;
        try {
            //find by parentId
            if (parentId) query.parentId = parentId;
            //find by userId
            if (userId) query.userId = userId;
            //if have pageNum , pageSize => pagination
            if (pagesize)
                folders = await FolderModel.find(query).limit(pagesize * 1).skip(((pagenum > 1 ? pagenum : 1) - 1) * pagesize).exec();
            else //find all
                folders = await FolderModel.find(query).exec();

            //return iterator , we convert it to array 
            const data = folders.map(folder => folder.toObject());
            rs.data = data;
        } catch (err) {
            console.log(err.message);
            rs.status = 1;
            rs.msg = 'Network error, please try it again later !';
        }
        res.json(rs);
    }


    // [PUT] /folder/update?_method=PUT
    async updateFolder(req, res, next) {
        const folder = { ...req.body };
        const rs = { status: 0 };
        try {
            //Model.findOneAndUpdate(conditions, update, options, callback)  ----- { new: true } return new values
            const data = await FolderModel.findOneAndUpdate({ _id: folder._id }, folder, { new: true });
            rs.data = data.toObject();
        } catch (err) {
            console.log(err.message);
            rs.status = 1;
            rs.msg = 'Network error, please try it again later !';
        }
        res.json(rs);
    }

    // [GET] /folder/delete/:id?_method=DELETE
    async deleteFolder(req, res, next) {
        const rs = { status: 0, msg: 'Delete successfully !' };
        try {
            const id = req.params.id;
            await FolderModel.findByIdAndDelete({ _id: id });
        } catch (err) {
            rs.status = 1;
            rs.msg = 'Network error, please try it again later !';
        }
        res.json(rs);
    }

    // [GET] /folder/find
    async find(req, res, next) {
        let rs = { status: 0 };
        let query = {};
        try {
            const { q, userId } = req.query;
            if (q) query.title = { $regex: (new RegExp(q, 'igm')) };
            if (userId) query.userId = userId;

            const folders = await FolderModel.find(query).exec();

            //return iterator , we convert it to array 
            const data = folders.map(folder => folder.toObject());

            //set return data
            rs.data = data;
        } catch (err) {
            console.log(err.message);
            rs.status = 1;
            rs.msg = 'Network error, please try it again later !';
        }
        res.json(rs);
    }

}








module.exports = new folderController;