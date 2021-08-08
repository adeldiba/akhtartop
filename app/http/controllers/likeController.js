const controller = require('./controller');
const Like = require('app/models/like');
const Engine = require('app/models/engine');


class likeController extends controller{
   async store(req,res, next){
        try {
            Like.findOne({$and: [{bywhom:req.user.name},{engine:req.params.engine}] },(err, info)=>{
                if(info)// already user liked the post
                {
                    if(info.totalcount >0 )
                    {
                        Like.findByIdAndUpdate(info._id,{
                                        $inc: {
                                            totalcount: -1
                                        }
                                    },{new: true },(err, newinfo)=>{
                                        //res.send(newinfo);
                                        this.back(req, res);
                                    });
                    }
                    else{
                        Like.findByIdAndUpdate(info._id,{
                                        $inc: {
                                            totalcount: +1
                                        }
                                    },{new: true },(err, info1)=>{
                                        //res.send(info);
                                        this.back(req, res);
                                    });
                    }
                //	res.send("already liked " + info.bywhom+" "+info.post_id);
                }
                else // first time liking the post
                {
                    var newlike = {
                        user : req.user.id,
                        engine: req.params.engine,
                        bywhom : req.user.name,
                    };
                    Like.create(newlike,(err, likeinfo)=>{
                        if(err)
                            {console.log(err);}
                        else{
                            Like.findByIdAndUpdate(likeinfo._id,{
                                        $inc: {
                                            totalcount: +1
                                        }
                                    },{new: true },(err, info)=>{
                                        //res.send(info);
                                        this.alert(req , {
                                            message : 'محصول شما به لیست علاقه مندی ها اضافه شد',
                                            icon : 'success'
                                        })
                                        this.back(req, res);
                                    });
                        }
                    });
                    //res.send(info.bywhom);
                }
            });
        } catch (err) {
            next(err);
        }
    }

}

module.exports = new likeController();