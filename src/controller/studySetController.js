const studySetModel = require('../model/studySetModal');
const mongoose = require('mongoose');

class studySetController {

    //[POST] http://localhost:5000/studysets/add
    add(req, res, next) {
        let rs = { status: 0 };
        try {
            const { studySet } = req.body;

            if (studySet.isPublic !== undefined) {
                if (typeof studySet.isPublic === 'string') {
                    studySet.isPublic = !studySet.isPublic || studySet.isPublic.toLowerCase() === 'true'; //khong truyen se tra ve true , truyen roi thi xet' thoi
                    studySet.isPublicEdit = !studySet.isPublic || studySet.isPublicEdit.toLowerCase() === 'true';
                }
            }
            //save to database , and set return values to rs 
            let data;

            //neu su dung promise thi res.json phai ben trong promise , khong thoi se khong tra ve du lieu chinh xac
            data = new studySetModel(studySet).save();
            data.then(response => {
                rs.data = response.toObject();
                res.json(rs);
            }).catch(err => {
                rs = { status: 1, msg: err.message };
                res.json(rs);
                console.log(err.message);
            });

        } catch (e) {
            rs = { status: 1, msg: err.message };
            res.json(rs);
            console.log(e);
        }

    }




    //[GET] http://localhost:5000/studysets/list
    //[GET] http://localhost:5000/studysets/list?userId= &pageSize= &pageNum= &q= &sort=
    list(req, res, next) {
        let rs;

        try {
            const pageSize = req.query.pageSize * 1;
            const pageNum = req.query.pageNum * 1;
            const pos = req.query.pos * 1;

            //Query ----
            let query;
            const userId = req.query.userId;
            const q = req.query.q;

            //sort (updatedAt : 1 or title : 1)
            const sort = req.query.sort;

            let title;
            if (q !== '') title = new RegExp(q, 'gi');   //(regex , option)

            if (title || userId) {
                query = {};
                title ? (query.title = title) : null;
                userId ? (query.userId = userId) : null;
            }
            //end Query ----

            const aggregate = studySetModel.aggregate([
                { $match: { ...query } }, //query and sort
                { $sort: { [sort]: sort === 'updateAt' ? -1 : 1 } }
                // { $addFields: { "count": { $size: "$words" } } },
                // { $project: { words: 0 } },
            ])

            //find by position or pageNum , and process result
            if (pos >= 0 || pageNum) {
                aggregate.facet(
                    {
                        "total": [
                            { $count: "count" }
                        ],
                        "data": [
                            { $skip: pos >= 0 ? pos : ((pageNum - 1) * pageSize) },
                            { $limit: pageSize },
                            { $addFields: { "count": { $size: "$words" } } },
                            { $project: { words: 0 } }
                        ]
                    }
                );
                // aggregate.skip(((pageNum - 1) * pageSize)).limit(pageSize);
            } else {
                aggregate.addFields({ "count": { $size: "$words" } })
                    .project({ words: 0 })
            }



            aggregate.exec();

            //response => (return data to client)
            aggregate.then(values => {
                if (pos >= 0 || pageNum) {
                    //neu aggregate tim thay ket qua thi`
                    if (values[0].total.length > 0) {
                        rs = { status: 0, pos, pageNum, pageSize, total: values[0].total[0].count };
                        rs.data = values[0].data;
                    } else {
                        rs = { status: 0, pageNum, pageSize, total: 0 };
                        rs.data = values[0].data;
                    }

                } else {
                    rs = { status: 0, data: values }
                }


                res.json(rs);
            }).catch(e => {
                rs = { status: 1, msg: e.message };
                res.json(rs);
            })

        } catch (e) {
            rs = { status: 1, msg: e.message };
            res.json(rs);
        }
    }


    //[GET] // http://localhost:5000/studysets/detail/:id   (studysetID) : get words from study sets 
    detail(req, res, next) {
        let rs = { status: 0 };
        try {
            const _id = req.params.id;
            const pageSize = req.query.pageSize * 1;
            const pageNum = req.query.pageNum * 1;
            const pos = req.query.pos * 1;


            const aggregate = studySetModel.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(_id) } },
                // { $project: { words: 0 } }
            ]);

            aggregate.addFields({ count: { $size: "$words" } });

            if (pageNum) {
                aggregate.addFields(
                    {
                        'words': {
                            $slice: ["$words", ((pageNum - 1) * pageSize), pageSize]
                        }
                    }
                )
            }

            if (pos >= 0) {
                aggregate.addFields(
                    {
                        'words': {
                            $slice: ["$words", pos, pageSize]
                        }
                    }
                )
            }


            aggregate.exec();

            aggregate.then(values => {
                rs.data = values;
                res.json(rs);
            }).catch(e => {
                rs = { status: 1, msg: e.message };
                res.json(rs);
            })
        } catch (e) {
            rs = { status: 1, msg: e.message };
            res.json(rs);
        }
    }

    //[POST] // http://localhost:5000/studysets/delete/:id?_method=DELETE   (studysetID) : get words from study sets 
    async delete(req, res, next) {
        const rs = { status: 0, msg: 'Delete study set successfully !' };

        try {
            const _id = req.params.id;
            if (_id) {
                await studySetModel.findByIdAndDelete({ _id });
            } else {
                rs.msg = 'please select an item to delete';
            }
        } catch (err) {
            rs.status = 1;
            rs.msg = err.message;
        }

        res.json(rs);
    }


    //[PUT] http://localhost:5000/studysets/add-word?_method=PUT
    addWord(req, res, next) {
        let rs = { status: 0 };
        try {
            const { word, description, types, _id, img } = req.body;
            const value = { word, description, types, img };
            value._id = mongoose.Types.ObjectId();
            studySetModel.updateOne(
                { _id },
                {
                    $push: {
                        words: value
                    }
                },
                function (err, docs) {
                    rs.data = {
                        ...value,
                        _id: value._id.toHexString()
                    }
                    res.json(rs);
                }
            )
        } catch (e) {
            rs = { status: 1, msg: err.message };
            res.json(rs);
        }

    }


    //[PUT] // http://localhost:5000/studysets/edit-word?_method=PUT
    editWord(req, res, next) {
        let rs;

        const { _id, wordId, word, description, types, img } = req.body;
        const value = { _id: wordId, word, description, types, img };

        studySetModel.updateOne(
            { _id, },
            {
                $set: { "words.$[i]": value }
            },
            {
                multi: false,
                arrayFilters:
                    [
                        { "i._id": wordId }
                    ]
            },
            function (err) {
                if (err) {
                    rs = { status: 1, msg: err.message };
                } else {
                    rs = { status: 0, data: value };
                }
                res.json(rs);
            }
        )

    }

    //[PUT] // http://localhost:5000/studysets/remove-word?_method=PUT 
    async removeWord(req, res, next) {
        const rs = { status: 0, msg: 'remove word successfully !' };

        try {
            const { _id, wordId } = req.body;
            if (_id) {
                const response = await studySetModel.updateOne(
                    {
                        _id,
                        words: { $elemMatch: { _id: wordId } }
                    },
                    {
                        $pull: {
                            words: { _id: wordId }
                        }
                    }
                );
                /*
                    res.n; // Number of documents matched
                    res.nModified; // Number of documents modified
                */
                if (response.n === 0) {
                    rs.status = 1
                    rs.msg = 'word not found'
                }
            } else {
                rs.status = 1
                rs.msg = 'please select a study set to delete';
            }
        } catch (err) {
            rs.status = 1;
            rs.msg = err.message;
        }

        res.json(rs);
    }

}


module.exports = new studySetController;