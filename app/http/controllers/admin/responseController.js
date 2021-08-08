const controller = require('app/http/controllers/controller');
const Response = require('app/models/response');


class responseController extends controller {
    async index(req , res, next) {
        try{
            let response = await Response.find({});
            res.render('admin/response/index',  { title : 'پاسخ به پرسش های متداول', response});
    
        }catch(err){
            next(err);
        }
    }

   async create(req , res) {
        res.render('admin/response/create'); 
    }
    
    async store(req, res, next) {
        try{
            let status = await this.validationData(req); 
            if(! status){
                return this.back(req,res);
            }
           
            let {title, body, lang} = req.body;
    
            let newresponse = new Response({
                title,
                slug: this.slug(title),
                body,
                lang
            });
            await newresponse.save();
            return res.redirect('/admin/response');
        }catch(err){
            next(err);
        }
       
    }

    async edit(req, res ,next) {
        try{
            this.isMongoId(req.params.id);
            let response = await Response.findById(req.params.id);
            if( ! response ) {
                
                this.error('چنین محتوایی وجود ندارد', 404);
            }

            return res.render('admin/response/edit' , { response });
    
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
            
            await Response.findByIdAndUpdate(req.params.id , { $set : { ...req.body}})
            return res.redirect('/admin/response');
        }catch(err){
            next(err);
        }
    
    }
    async destroy(req , res  , next) {
        try {
            this.isMongoId(req.params.id);

            let response = await Response.findById(req.params.id).populate().exec();
            if( ! response ) this.error('چنین اطلاعاتی وجود ندارد' , 404);

            // delete response
            response.remove();

            return res.redirect('/admin/response');
        } catch (err) {
            next(err);
        }
    }
    getUrlImage(dir) {
        return dir.substring(8);
    }
}

module.exports = new responseController();