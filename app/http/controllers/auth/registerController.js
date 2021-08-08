const controller = require('app/http/controllers/controller');
const passport = require('passport');
const Category = require('app/models/category');
const User = require('app/models/user');
const Logo = require('app/models/user');

class registerController extends controller{
    
  // async showRegisterForm(req,res, next){
   //     try {
    //        const title = "صفحه عضویت";
    //        let categories = await Category.find({ parent : null }).populate('childs').exec();
     //       res.render('home/auth/register', { recaptcha: this.recaptcha.render(), title, categories});
     //   } catch (err) {
    //       next(err);  
    //    }
   // }
    async showMobileForm(req, res) {
        const title = "صفحه عضویت";

        let query = {};
        let { search, type, category } = req.query;
        if (search) query.title = new RegExp(req.query.search, "gi");

        if (type && type != "all") query.type = type;

        if (category && category != "all") {
            category = await Category.findOne({ slug: category });
            if (category) query.categories = { $in: [category.id] };
        }
        let logo = await Logo.find({ });
        let categories = await Category.find({ parent: null })
            .populate("childs")
            .exec();
        if (req.session.cart && req.session.cart.length == 0) {
            delete req.session.cart;
            res.redirect("home/auth/mobile");
        } else {
            res.render("home/auth/mobile", {
                 recaptcha: this.recaptcha.render(),
                cart: req.session.cart,
                title,
                categories,
                key:categories.key,
                logo
            });
        }
    }

    async sendSMS(req, res, next) {
        
        req.session.ok = false;
        let { mobile } = req.body;
        const now = Math.floor(new Date().getTime() / 1000);
        if (req.session.mobile && now - (req.session.time || 0) < 300) {
            req.flash("errors", "کد تایید ارسال شده است");
            return res.redirect("/auth/register/validate");
        }
        if ("" === mobile) {
            req.flash("errors", "شماره تلفن همراه اجباری است");
            return res.redirect("/auth/register/mobile");
        }
        mobile = "0" + mobile.substr(-10);
        let user = await User.findOne({ phone: mobile });
        if (user) {
            req.flash("errors", "شماره تلفن تکراری است");
            return res.redirect("/auth/register/mobile");
        }
        req.session.mobile = mobile;
        req.session.time = Math.floor(new Date().getTime() / 1000);
        req.session.code = Math.floor(
            Math.random() * (999999 - 100000) + 100000
        );
        // const TrezSmsClient = require("trez-sms-client");
        // const client = new TrezSmsClient("omidkeyri", "node300px300px");

        // await client.sendMessage(
        //     "5000248351",
        //     "09301234567",
        //     `کد تایید شما ${req.session._code} است`,
        //     client.getRandomGroupId()
        // );

        const Kavenegar = require("kavenegar");
        const api = Kavenegar.KavenegarApi({
            apikey:
                "6A3746624868316C56694A3564517373384E64616B394535316178394E764A6157356755747171394435513D"
        });

        api.VerifyLookup(
            {
                receptor: mobile,
                token: req.session.code,
                template: "register"
            },
            function(response, status) {
                console.log(response);
                console.log(status);
            }
        );
        res.redirect("/auth/register/validate");
    }
    async showValidateForm(req, res) {
        const title = "صفحه عضویت";

        let query = {};
        let { search, type, category } = req.query;
        if (search) query.title = new RegExp(req.query.search, "gi");

        if (type && type != "all") query.type = type;

        if (category && category != "all") {
            category = await Category.findOne({ slug: category });
            if (category) query.categories = { $in: [category.id] };
        }
        let logo = await Logo.find({ });
        let categories = await Category.find({ parent: null })
            .populate("childs")
            .exec();
        
        if (req.session.cart && req.session.cart.length == 0) {
            delete req.session.cart;
            res.redirect("/cart");
        } else {
            res.render("home/auth/validate", {
                recaptcha: this.recaptcha.render(),
                cart: req.session.cart,
                title,
                key: "",
                categories,
                mobile: req.session.mobile,
                logo
            });
        }
    }
    async validate(req, res) {
        await this.recaptchaValidation(req , res); 
        const { mobile, code } = req.body;
        if (mobile !== req.session.mobile) {
            req.flash("errors", "شماره تلفن همراه نامعتبر است");
            return res.redirect("/auth/register/mobile");
        }
        const now = Math.floor(new Date().getTime() / 1000);
        if (
            Number(code) !== Number(req.session.code) ||
            (now - req.session.time || 0) > 300
        ) {
            req.flash("errors", "کد تایید نامعتبر است");
            return res.redirect("/auth/register/validate");
        }
        
        const user = await User.find({phone: mobile});
        if(user.length > 0) {
            req.flash("errors", "با این شماره تلفن قبلا ثبت نام کردند.");
            return res.redirect("/auth/register/mobile");
        }

        req.session.ok = true;

        return res.redirect("/auth/register");
    }

    async showRegsitrationForm(req, res, next) {
        if (!req.session.ok) {
            req.flash("errors", "لطفا شماره تلفن خود را وارد کنید.");
            return redirect("/auth/register/mobile");
        }
        try {
            const title = "صفحه عضویت";

            let query = {};
            let { search, type, category } = req.query;
            if (search) query.title = new RegExp(req.query.search, "gi");

            if (type && type != "all") query.type = type;

            if (category && category != "all") {
                category = await Category.findOne({ slug: category });
                if (category) query.categories = { $in: [category.id] };
            }
            let logo = await Logo.find({ });
            let categories = await Category.find({ parent: null })
                .populate("childs")
                .exec();
            
            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/auth/register");
            } else {
                res.render("home/auth/register", {
                    recaptcha: this.recaptcha.render(),
                    cart: req.session.cart,
                    title,
                    key: "",
                    logo,
                    categories,
                    mobile: req.session.mobile
                });
            }
        } catch (error) {
            next(error);
        }
    }

    async registerProccess(req, res, next) {
        const { phone: mobile } = req.body;
        if (!req.session.ok) {
            req.flash("errors", "لطفا شماره تلفن خود را وارد کنید.");
            return res.redirect("/auth/register/mobile");
        }
        if (mobile !== req.session.mobile) {
            req.flash("errors", "لطفا شماره تلفن خود را وارد کنید.");
            return res.redirect("/auth/register/mobile");
        }
        try {
            
            await this.recaptchaValidation(req, res);

            let result = await this.validationData(req);
            if (result) {
                return this.register(req, res, next);
            }
            

            return this.back(req, res);
        } catch (error) {
            next(err);
        }
    }

    register(req , res , next) {
        try {
            passport.authenticate('local.register' , { 
                successRedirect : '/',
                failureRedirect : '/auth/register',
                failureFlash : true
            })(req, res , next);
        } catch (err) {
           next(err) 
        }
    }
}

module.exports = new registerController();