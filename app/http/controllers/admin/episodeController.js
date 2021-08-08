const controller = require('app/http/controllers/controller');
const Engine = require('app/models/engine');
const Episode = require('app/models/episode');

class episodeController extends controller {
    async index(req , res) {
        try {
            let page = req.query.page || 1;
            let episodes = await Episode.paginate({} , { page , sort : { createdAt : 1 } , limit : 20, populate: 'engine' });
            res.render('admin/episodes/index',  { title : 'محصولات ویژه' , episodes });
        } catch (err) {
            next(err);
        }
    }

    async create(req , res) {
        let engines = await Engine.find({});
        res.render('admin/episodes/create' , { engines });        
    }

    async store(req , res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);
        
            let newEpisode = new Episode({ ...req.body });
            await newEpisode.save();

            // update engine Times

            return res.redirect('/admin/episodes');  
        } catch(err) {
            next(err);
        }
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);

            let episode = await Episode.findById(req.params.id);
            let engines = await Engine.find({});
            if( ! episode ) this.error('چنین محصول ویژه ای وجود ندارد' , 404);


            return res.render('admin/episodes/edit' , { episode , engines });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);

            
            let episode = await Episode.findByIdAndUpdate(req.params.id , { $set : { ...req.body }})
            
            // prev engine time update
            //this.updateEngineTime(episode.engine);
            // now engine time update
            //this.updateEngineTime(req.body.engine);


            return res.redirect('/admin/episodes');
        } catch(err) {
            next(err);
        }
    }

    async destroy(req , res , next) {
        try {
            this.isMongoId(req.params.id);

            let episode = await Episode.findById(req.params.id);
            if( ! episode ) this.error('چنین محصول ویژه ای وجود ندارد' , 404);

            // delete courses
            episode.remove();

            return res.redirect('/admin/episodes');
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new episodeController();