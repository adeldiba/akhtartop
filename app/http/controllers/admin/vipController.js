const controller = require('app/http/controllers/controller');
const passport = require('passport');
const Vip = require('app/models/vip');

class vipController extends controller{
    
   async index(req,res, next){
        try {
            const title = "ساختن کد ویژه برای مشتری";
            const vips = await Vip.find({});
            res.render('admin/vip_reg', { title,vips});
        } catch (err) {
           next(err);  
        }
    }

    async store(req , res, next) {
        
        let status = await this.validationData(req);
        if(! status) {
            if(req.file) 
                fs.unlinkSync(req.file.path);
            return this.back(req,res);
        }
        
        let {password} = req.body;

        let newVip = new Vip({
            user : req.user._id,
            password
        });

        await newVip.save();
        
        return res.redirect('/admin/vip_reg');     
    }
    async destroy(req , res, next) {
        try {
            this.isMongoId(req.params.id);
            let vip = await Vip.findById(req.params.id).populate().exec(); 
            if( ! vip ) this.error('چنین کدی وجود ندارد' , 404);

            // delete vip
            vip.remove();

            return res.redirect('/admin/vip_reg'); 
        } catch (err) {
            next(err)
        }        
    }

}

module.exports = new vipController();