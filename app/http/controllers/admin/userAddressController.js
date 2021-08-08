const controller = require('app/http/controllers/controller');
const Payment = require('app/models/payment');
const Panel = require('app/models/panel');
const User = require('app/models/user');


class userAddressController extends controller { 
    async index(req , res, next) {
        try {
            //let panels = await Profile.find({user : req.user.id});
            let page = req.query.page || 1;
            let panels = await Panel.paginate({} , { page , sort : { createdAt : -1 } , limit : 20, populate:('user') });
            //return res.json(profiles);
            res.render('admin/userAddress/index',  { title : 'آدرس کاربران' ,panels});
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new userAddressController();
