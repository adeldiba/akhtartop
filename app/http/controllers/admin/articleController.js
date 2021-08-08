const controller = require('app/http/controllers/controller');
const Article = require('app/models/article');


class articleController extends controller {
    async index(req , res, next) {
        try{
            let articles = await Article.find({});
            res.render('admin/articles/index',  { title : 'متن کد مشتری ویژه', articles});
    
        }catch(err){
            next(err);
        }
    }

   async create(req , res) {
        res.render('admin/articles/create'); 
    }
    
    async store(req, res, next) {
        try{
            let status = await this.validationData(req); 
            if(! status){
                return this.back(req,res);
            }
           
            let {title, body, lang} = req.body;
    
            let newarticle = new Article({
                title,
                slug: this.slug(title),
                body,
                lang
            });
            await newarticle.save();
            return res.redirect('/admin/articles');
        }catch(err){
            next(err);
        }
       
    }

    async edit(req, res ,next) {
        try{
            this.isMongoId(req.params.id);
            let article = await Article.findById(req.params.id);
            if( ! article ) {
                
                this.error('چنین محتوایی وجود ندارد', 404);
            }

            return res.render('admin/articles/edit' , { article });
    
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
            
            await Article.findByIdAndUpdate(req.params.id , { $set : { ...req.body}})
            return res.redirect('/admin/articles');
        }catch(err){
            next(err);
        }
    
    }
    async destroy(req , res  , next) {
        try {
            this.isMongoId(req.params.id);

            let article = await Article.findById(req.params.id).populate().exec();
            if( ! article ) this.error('چنین اطلاعاتی وجود ندارد' , 404);

            // delete article
            article.remove();

            return res.redirect('/admin/articles');
        } catch (err) {
            next(err);
        }
    }
    getUrlImage(dir) {
        return dir.substring(8);
    }
    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new articleController();