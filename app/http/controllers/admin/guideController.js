const controller = require('app/http/controllers/controller');
const Guide = require('app/models/guide');


class guideController extends controller {
    async index(req , res, next) {
        try{
            let guides = await Guide.find({});
            res.render('admin/guides/index',  { title : 'راهنمای استفاده از سایت', guides});
    
        }catch(err){
            next(err);
        }
    }

   async create(req , res) {
        res.render('admin/guides/create'); 
    }
    
    async store(req, res, next) {
        try{
            let status = await this.validationData(req); 
            if(! status){
                return this.back(req,res);
            }
           
            let {title, body, lang} = req.body;
    
            let newguide = new Guide({
                title,
                slug: this.slug(title),
                body,
                lang
            });
            await newguide.save();
            return res.redirect('/admin/guides');
        }catch(err){
            next(err);
        }
       
    }

    async edit(req, res ,next) {
        try{
            this.isMongoId(req.params.id);
            let guide = await Guide.findById(req.params.id);
            if( ! guide ) {
                
                this.error('چنین محتوایی وجود ندارد', 404);
            }

            return res.render('admin/guides/edit' , { guide });
    
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
            
            await Guide.findByIdAndUpdate(req.params.id , { $set : { ...req.body}})
            return res.redirect('/admin/guides');
        }catch(err){
            next(err);
        }
    
    }
    async destroy(req , res  , next) {
        try {
            this.isMongoId(req.params.id);

            let guide = await Guide.findById(req.params.id).populate().exec();
            if( ! guide ) this.error('چنین اطلاعاتی وجود ندارد' , 404);

            // delete guide
            guide.remove();

            return res.redirect('/admin/guides');
        } catch (err) {
            next(err);
        }
    }
    getUrlImage(dir) {
        return dir.substring(8);
    }
}

module.exports = new guideController();