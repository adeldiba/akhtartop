const controller = require('app/http/controllers/controller');
const Coupon_text = require('app/models/coupon_text');


class couponController extends controller {
    async index(req , res, next) {
        try{
            let coupon_text = await Coupon_text.find({});
            res.render('admin/coupon_text/index',  { title : 'محتوای بن تخفیف', coupon_text});
    
        }catch(err){
            next(err);
        }
    }

   async create(req , res) {
        res.render('admin/coupon_text/create'); 
    }
    
    async store(req, res, next) {
        try{
            let status = await this.validationData(req); 
            if(! status){
                return this.back(req,res);
            }
           
            let {title, body, lang} = req.body;
    
            let newcoupon_text = new Coupon_text({
                title,
                slug: this.slug(title),
                body,
                lang
            });
            await newcoupon_text.save();
            return res.redirect('/admin/coupon_text');
        }catch(err){
            next(err);
        }
       
    }

    async edit(req, res ,next) {
        try{
            this.isMongoId(req.params.id);
            let coupon_text = await Coupon_text.findById(req.params.id);
            if( ! coupon_text ) {
                
                this.error('چنین محتوایی وجود ندارد', 404);
            }

            return res.render('admin/coupon_text/edit' , { coupon_text });
    
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
            
            await Coupon_text.findByIdAndUpdate(req.params.id , { $set : { ...req.body}})
            return res.redirect('/admin/coupon_text');
        }catch(err){
            next(err);
        }
    
    }
    async destroy(req , res  , next) {
        try {
            this.isMongoId(req.params.id);

            let coupon_text = await Coupon_text.findById(req.params.id).populate().exec();
            if( ! coupon_text ) this.error('چنین اطلاعاتی وجود ندارد' , 404);

            // delete coupon_text
            coupon_text.remove();

            return res.redirect('/admin/coupon_text');
        } catch (err) {
            next(err);
        }
    }
    getUrlImage(dir) {
        return dir.substring(8);
    }
}

module.exports = new couponController();