const controller = require('app/http/controllers/controller');
const Engine = require('app/models/engine');
const Category = require('app/models/category');
const Brand = require('app/models/brand');
const Country = require('app/models/country');
const Device = require('app/models/device');
const fs = require('fs');
const { isEmpty, uploadDir } = require('app/helpers/upload-helper');

class engineController extends controller {
    async index(req , res, next) {
        try {
            let page = req.query.page || 1; 
            let engines = await Engine.paginate({} , { page , sort : { createdAt : -1 } , limit : 40 });
            res.render('admin/engines/index',  { title : 'لوازم یدکی ماشین آلات نیمه سنگین (کارگو)' , engines });
        } catch (err) {
            next(err);
        }
    }

    async create(req , res, next) {
        let categories = await Category.find({});
        let brands = await Brand.find({});
        let devices = await Device.find({});
        let countries = await Country.find({});
        return res.render('admin/engines/create', {categories, devices, brands, countries});            
    }

    async store(req , res, next) {
        
        let status = await this.validationData(req);
        if(! status) {
            if(req.file) 
                fs.unlinkSync(req.file.path);
            return this.back(req,res);
        }

        // create engine
        let filename = 'http://via.placeholder.com/640x360';

            if(!isEmpty(req.files)){
                let file = req.files.file;
                 filename = Date.now() + '-' + file.name;
                

                file.mv('./public/uploads/' + filename, function(err){
                    if(err) throw err;
            });
            }
        let { title,titleE, body,body2,body3,body4 ,model, type ,typetwo, price ,lang, key} = req.body;

        let newEngine = new Engine({
            user : req.user._id,
            title,
            titleE,
            slug : this.slug(title), 
            body,
            body2,
            body3,
            body4,
            model,
            type,
            typetwo,
            price,
            lang,
            file: filename,
            key,
            likes : 0
        });

        await newEngine.save();
        
        return res.redirect('/admin/engines');     
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);
            let engine = await Engine.findById(req.params.id);
            if( ! engine ) this.error('چنین محصولی وجود ندارد' , 404);

            let categories = await Category.find({});
            let brands = await Brand.find({});
            let devices = await Device.find({});
            let countries = await Country.find({});
            return res.render('admin/engines/edit' , { engine,  categories, devices, brands,countries});
        } catch (err) {
            next(err);
        }
    }

    async update(req, res , next) {
        try {
            let status = await this.validationData(req);
        if(! status) {
            if(req.file) 
                fs.unlinkSync(req.file.path);
            return this.back(req,res);
        }
        let objForUpdate = {};
        objForUpdate.slug = this.slug(req.body.title);
       await Engine.findByIdAndUpdate( req.params.id, { $set : { ...req.body, ...objForUpdate }}) 
        .then(function(engine){
        
           
        let filename = 'http://via.placeholder.com/640x360';    
        if(!isEmpty(req.files)){
            let file = req.files.file;
             filename = Date.now() + '-' + file.name;
             engine.file = filename;
    
            file.mv('./public/uploads/' + filename, function(err){
                if(err) throw err;
        });
        }
        
        engine.save().then(function(updatedPost){
            req.flash('success_message', 'Post was successfully updated');
            return res.redirect('/admin/engines');
        });
    });  
        } catch (err) {
            next(err);
        }
        
    }
    async destroy(req , res, next) {
        try {
            this.isMongoId(req.params.id);
             await Engine.findOne({_id: req.params.id}).populate('episodes').then(function (engine){
                if( ! engine ) this.error('چنین محصولی وجود ندارد' , 404);
                // delete episodes
                engine.episodes.forEach(episode => episode.remove());
                // delete Images
                fs.unlink(uploadDir + engine.file,(err)=>{
                    // delete engines
                    engine.remove().then(postRemoved=>{

                        req.flash('success_message', 'محصول با موفقیت حذف شد');
                        return res.redirect('/admin/engines');
                    });
                    
                }); 

            });      
        } catch (err) {
            next(err)
        }        
    }
    
    getUrlImage(dir) {
        return dir.substring(8);
    }

    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new engineController();