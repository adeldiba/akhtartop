const controller = require('app/http/controllers/controller');
const About = require('app/models/about');


class aboutController extends controller {
    async index(req , res, next) {
        try{
            let abouts = await About.find({});
            res.render('admin/about_us/index',  { title : 'درباره ما', abouts});
    
        }catch(err){
            next(err);
        }
    }

   async create(req , res) {
        res.render('admin/about_us/create'); 
    }
    
    async store(req, res, next) {
        try{
            let status = await this.validationData(req); 
            if(! status){
                return this.back(req,res);
            }
           
            let {title, body, lang} = req.body;
    
            let newabout = new About({
                title,
                slug: this.slug(title),
                body,
                lang
            });
            await newabout.save();
            return res.redirect('/admin/about_us');
        }catch(err){
            next(err);
        }
       
    }

    async edit(req, res ,next) {
        try{
            this.isMongoId(req.params.id);
            let about = await About.findById(req.params.id);
            if( ! about ) {
                
                this.error('چنین محتوایی وجود ندارد', 404);
            }

            return res.render('admin/about_us/edit' , { about });
    
        }catch(err){
            next(err);
        }
    }

    async update(req, res , next) {
        try{
            let status = await this.validationData(req);
            if(! status) {
                return this.back(req,res);
            }
            
            await About.findByIdAndUpdate(req.params.id , { $set : { ...req.body}})
            return res.redirect('/admin/about_us');
        }catch(err){
            next(err);
        }
    
    }
    async destroy(req , res  , next) {
        try {
            this.isMongoId(req.params.id);

            let about = await About.findById(req.params.id).populate().exec();
            if( ! about ) this.error('چنین اطلاعاتی وجود ندارد' , 404);

            // delete about
            about.remove();

            return res.redirect('/admin/about_us');
        } catch (err) {
            next(err);
        }
    }
    getUrlImage(dir) {
        return dir.substring(8);
    }
}

module.exports = new aboutController();