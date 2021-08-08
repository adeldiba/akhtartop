const controller = require('app/http/controllers/controller');
const Return_p = require('app/models/return_p');


class returnController extends controller {
    async index(req , res, next) {
        try{
            let return_p = await Return_p.find({});
            res.render('admin/return_p/index',  { title : 'رویه باز گرداندن کالا', return_p});
        }catch(err){
            next(err);
        }
    }

   async create(req , res) {
        res.render('admin/return_p/create'); 
    }
    
    async store(req, res, next) {
        try{
            let status = await this.validationData(req); 
            if(! status){
                return this.back(req,res);
            }
           
            let {title, body, lang} = req.body;
    
            let newReturn = new Return_p({
                title,
                slug: this.slug(title),
                body,
                lang
            });
            await newReturn.save();
            return res.redirect('/admin/return_p');
        }catch(err){
            next(err);
        }
       
    }

    async edit(req, res ,next) {
        try{
            this.isMongoId(req.params.id);
            let return_p = await Return_p.findById(req.params.id);
            if( ! return_p ) {
                
                this.error('چنین محتوایی وجود ندارد', 404);
            }

            return res.render('admin/return_p/edit' , { return_p });
    
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
            
            await Return_p.findByIdAndUpdate(req.params.id , { $set : { ...req.body}})
            return res.redirect('/admin/return_p');
        }catch(err){
            next(err);
        }
    
    }
    async destroy(req , res  , next) {
        try {
            this.isMongoId(req.params.id);

            let return_p = await Return_p.findById(req.params.id).populate().exec();
            if( ! return_p ) this.error('چنین اطلاعاتی وجود ندارد' , 404);

            // delete return_p
            return_p.remove();

            return res.redirect('/admin/return_p');
        } catch (err) {
            next(err);
        }
    }
    getUrlImage(dir) {
        return dir.substring(8);
    }
}

module.exports = new returnController();