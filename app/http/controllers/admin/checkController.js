const controller = require('app/http/controllers/controller');
const passport = require('passport');
const Check = require('app/models/check');

class checkController extends controller{
    
   async index(req,res, next){ 
        try {
            let page = req.query.page || 1; 
            const title = "تایید چک";
            let checks = await Check.paginate({} , { page , sort : { createdAt : 1 } , limit : 10,populate : [ 'user' ] });
            //return res.json(adminChecks)
            res.render('admin/checks', { title,checks});
        } catch (err) {
           next(err);  
        }
    }

    async approved(req, res ,next) {
        try {
            let page = req.query.page || 1;
            let checks = await Check.paginate({ approved : null } , { page , sort : { createdAt : -1 } , limit : 20 ,
                populate : [
                    {
                        path : 'user' 
                    }
                ]
            });

            res.render('admin/checks/approved',  { title : 'چک های تایید نشده' , checks });
        } catch (err) {
            next(err);
        }
    }
    async update(req ,res , next) {
        try {
            this.isMongoId(req.params.id); 

            let check = await Check.findById(req.params.id).populate().exec();
            if( ! check ) this.error('چنین چکی وجود ندارد' , 404);

            check.approved = true;
            await check.save();

            return this.back(req, res);

        } catch (err) {
            next(err);
        }
    }
    async notupdate(req ,res , next) {
        try {
            this.isMongoId(req.params.id); 

            let check = await Check.findById(req.params.id).populate().exec();
            if( ! check ) this.error('چنین چکی وجود ندارد' , 404);

            check.approved = false;
            await check.save();

            return this.back(req, res);

        } catch (err) {
            next(err);
        }
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

module.exports = new checkController();