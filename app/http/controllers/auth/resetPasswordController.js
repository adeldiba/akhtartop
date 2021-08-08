const controller = require('app/http/controllers/controller');
const passport = require('passport');
const PasswordReset = require('app/models/password-reset');
const User = require('app/models/user');
const uniqueString = require('unique-string');
const Category = require('app/models/category');
const Logo = require('app/models/logo');

class resetPasswordController extends controller {
    
   async showResetPassword(req , res, next) {
       try {
            const title = 'بازیابی رمز عبور';
            let categories = await Category.find({ parent : null }).populate('childs').exec();
            let logo = await Logo.find({ });
            res.render('home/auth/passwords/reset' , { 
            recaptcha: this.recaptcha.render(), title,categories,
                token : req.params.token,
                logo,
                key:''
            });
       } catch (err) {
           next(err);
       } 
    }

    async resetPasswordProccess(req  ,res , next) {
        try {
            await this.recaptchaValidation(req , res);
            let result = await this.validationData(req)
            if(result) {
                return this.resetPassword(req, res)
            } 
            this.back(req,res);
        } catch (err) {
            next(err);
        }
    }


    async resetPassword(req ,res, next) {
        try {
            let field = await PasswordReset.findOne({ $and : [ { email : req.body.email } , { token : req.body.token } ]});
            if(! field) {
                req.flash('errors' , 'اطلاعات وارد شده صحیح نیست لطفا دقت کنید');
                return this.back(req,res);
            }
    
            if(field.use) {
                req.flash('errors' , 'از این لینک برای بازیابی پسورد قبلا استفاده شده است');
                return this.back(req, res);
            }
    
            let user = await User.findOne({ email : field.email });
            user.$set({ password : user.hashPassword(req.body.password) })
            await user.save();
            if(! user) {
                req.flash('errors' , 'اپدیت شدن انجام نشد');
                return this.back();
            }
    
           await field.update({ use : true}); 
           return res.redirect('/auth/login');
        } catch (err) {
            next(err);
        }
       
    }

}

module.exports = new resetPasswordController();