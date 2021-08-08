const controller = require('app/http/controllers/controller');
const passport = require('passport');
const PasswordReset = require('app/models/password-reset');
const User = require('app/models/user');
const uniqueString = require('unique-string');
const Category = require('app/models/category');
const Logo = require('app/models/logo');
const mail = require('app/helpers/mail');

class forgotPasswordController extends controller {
    
   async showForgotPassword(req , res, next) {
       try {
        const title = 'فراموشی رمز عبور';
        let categories = await Category.find({ parent : null }).populate('childs').exec();
        let logo = await Logo.find({});
        res.render('home/auth/passwords/email' , {recaptcha: this.recaptcha.render(), title,categories,logo,key:''});
       } catch (error) {
           next(err);
       }
    }

    async sendPasswordResetLink(req  ,res , next) {
        try {
            await this.recaptchaValidation(req , res);
            let result = await this.validationData(req)
            if(result) {
                return this.sendResetLink(req, res)
            } 
            return this.back(req,res);
        } catch (err) {
            next(err);
        }
    }

    async sendResetLink(req ,res , next) {
        try {
            let user = await User.findOne({ email : req.body.email });
            if(! user) {
                req.flash('errors' , 'چنین کاربری وجود ندارد');
                return this.back(req, res);
            }

            const newPasswordReset = new PasswordReset({
                email : req.body.email,
                token : uniqueString()
            });
            await newPasswordReset.save();

            let mailOptions = {
                from: 'وبسایت فروشگاهی آختارتاپ', // sender address
                to: `${newPasswordReset.email}`, // list of receivers
                subject: 'ریست کردن پسورد', // Subject line
                html: `
                    <h2>ریست کردن پسورد</h2>
                    <p>برای ریست کردن پسورد بر روی لینک زیر کلیک کنید</p>
                    <a href="${config.siteurl}/auth/password/reset/${newPasswordReset.token}">ریست کردن</a>
                ` // html body
            };
    
            mail.sendMail(mailOptions  , (err , info) => {
                if(err) return console.log(err);
    
                this.alert(req, {
                    title : 'کاربر گرامی',
                    message : 'ایمیل حاوی لینک پسورد به ایمیل شما ارسال شد',
                    icon  : 'success'
                });
    
                return res.redirect('/');
    
            })
            
            //req.flash('success', 'ایمیل بازیابی رمز عبور با موفقیت انجام شد');
            res.redirect('/auth/password/reset');
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new forgotPasswordController();