const controller = require('app/http/controllers/controller');
const Comment = require('app/models/comment');

class commentController extends controller {
    async index(req , res , next) {
        try {
            let page = req.query.page || 1;
            let comments = await Comment.paginate({ approved : true } , { page , sort : { createdAt : -1 } , limit : 20 ,
                populate : [
                    {
                        path : 'user',
                        select : 'name' 
                    },
                    'engine' ,
                    {
                        path : 'episode',
                        populate : [
                            {
                                path : 'engine' , 
                                select : 'slug'
                            }
                        ]
                    }
                ]
            });
            // return res.json(comments);
            res.render('admin/comments/index',  { title : 'کامنت ها' , comments });
        } catch (err) {
            next(err);
        }
    }

    async approved(req, res ,next) {
        try {
            let page = req.query.page || 1;
            let comments = await Comment.paginate({ approved : false } , { page , sort : { createdAt : -1 } , limit : 20 ,
                populate : [
                    {
                        path : 'user',
                        select : 'name'
                    },
                    'engine' ,
                    {
                        path : 'episode',
                        populate : [
                            {
                                path : 'engine' ,
                                select : 'slug'
                            }
                        ]
                    }
                ]
            });
            res.render('admin/comments/approved',  { title : 'کامنت های تایید نشده' , comments });
        } catch (err) {
            next(err);
        }
    }

    async update(req ,res , next) {
        try {
            this.isMongoId(req.params.id); 

            let comment = await Comment.findById(req.params.id).populate('belongTo').exec();
            if( ! comment ) this.error('چنین کامنتی وجود ندارد' , 404);

            await comment.belongTo.inc('commentCount');

            comment.approved = true;
            await comment.save();

            return this.back(req, res);

        } catch (err) {
            next(err);
        }
    }

    async destroy(req, res , next) {
        try {
            this.isMongoId(req.params.id);

            let comment = await Comment.findById(req.params.id).exec();
            if( ! comment ) this.error('چنین کامنتی وجود ندارد' , 404);

            // delete engine
            comment.remove();

            return this.back(req,res);
        } catch (err) {
            next(err);
        }
    }

}

module.exports = new commentController();