const controller = require('app/http/controllers/controller');
const passport = require('passport');
const Category = require('app/models/category');
const Logo = require('app/models/logo');
const ActivationCode = require('app/models/activationCode');
const uniqueString = require('unique-string')
const mail = require('app/helpers/mail');

class loginController extends controller {
    
   async showLoginForm(req , res, next) {
        try{
            const title = 'صفحه ورود';
            let categories = await Category.find({ parent : null }).populate('childs').exec();
            let logo = await Logo.find({});
            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/cart");
            }else{
            res.render('home/auth/login' , { recaptcha : this.recaptcha.render() ,logo, title,key:'', categories,cart: req.session.cart});
            }
        }catch (err){
            next(err);
        }  
    }

    async loginProccess(req  ,res , next) {
        try {
            await this.recaptchaValidation(req , res);
            let result = await this.validationData(req)
            if(result) {
                return this.login(req, res , next)
            } 
        
            this.back(req,res);
        } catch (err) {
            next(err);
        }
    }

   async login(req ,res , next) {
        try {
            passport.authenticate('local.login' , async(err , user) => {
                if(!user) return res.redirect('/auth/login');
    
                req.logIn(user , err => {
                    if(req.body.remember) {
                        user.setRememberToken(res);
                        this.alert(req , {
                            title : 'با تشکر',
                            message : 'اکانت شما فعال شد',
                            button : 'بسیار خوب',
                            icon : 'success'
                        });
                    }
                        
                    return res.redirect('/');
                })
    
            })(req, res , next);
        } catch (err) {
            next(err);
        }  
    }
}

module.exports = new loginController();