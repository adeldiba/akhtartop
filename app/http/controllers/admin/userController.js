const controller = require('app/http/controllers/controller');
const User = require('app/models/user');

class userController extends controller {
    async index(req , res) {
        try {
            let page = req.query.page || 1;
            let users = await User.paginate({} , { page , sort : { createdAt : 1 } , limit : 20 });

            res.render('admin/users/index',  { title : 'کاربران وبسایت' , users });
        } catch (err) {
            next(err);
        }
    }

    async toggleadmin(req , res , next) {
        try {
            this.isMongoId(req.params.id);

            let user = await User.findById(req.params.id);
            user.set({ admin : ! user.admin});
            await user.save();

            return this.back(req , res);
        } catch (err) {
            next(err)
        }
    }

    async destroy(req , res , next) {
        try {
            this.isMongoId(req.params.id);

            let user = await User.findById(req.params.id).populate({ path : 'engines' , populate : [ 'episodes' ]}).exec();
            if( ! user ) this.error('چنین کاربری وجود ندارد' , 404);


            // delete user
            user.remove();

            return res.redirect('/admin/users');
        } catch (err) {
            next(err);
        }
    }

}

module.exports = new userController();