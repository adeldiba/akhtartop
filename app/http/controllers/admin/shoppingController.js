const controller = require('app/http/controllers/controller');
const Payment = require('app/models/payment');
const Panel = require('app/models/panel');


class shoppingController extends controller {
    async index(req , res) {
        try {
            let page = req.query.page || 1;
            let payments = await Payment.paginate({} , { page , sort : { createdAt : -1 } , limit : 20 });
            
            res.render('admin/shoppings/index',  { title : 'لیست خریدات' , payments });
        } catch (err) {
            next(err);
        }
    }
    async title(req, res ,next) {
        try{
            this.isMongoId(req.params.id);
            let payment = await Payment.findById(req.params.id)
            populate : [
                    {
                        path : 'user',
                        select : 'name'
                    },
                    'engine' ,
                    'panel',
                    {
                        path : 'episode',
                        populate : [
                            {
                                path : 'engine' ,
                                select : 'slug',
                                path : 'panel',
                                select : 'address'
                            }
                        ]
                    },
                    
                ]
            ;
            return res.render('admin/shoppings/title' , { payment });
    
        }catch(err){
            next(err);
        }
    }

 async address(req, res ,next) {
        try{
            this.isMongoId(req.params.id);
            let payment = await Payment.findById(req.params.id).populate('user').exec(); 
           
            return res.render('admin/shoppings/address' , { payment});
        
        }catch(err){
                next(err);
        }
    }
}

module.exports = new shoppingController();
