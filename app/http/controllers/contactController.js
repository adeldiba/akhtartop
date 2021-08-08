const controller = require('app/http/controllers/controller');
const Engine = require('app/models/engine');
const Episode = require('app/models/episode');
const Category = require('app/models/category');
const Logo = require('app/models/logo');
const Contact = require('app/models/contact');

class contactController extends controller {
    
    async index(req , res , next) {
        try {
            let title = "تماس با ما";

            let query = {};
            let{search, type,typetwo, category } = req.query;
            if(search) 
                query.title = new RegExp(search , 'gi');

            if(type && type != 'all')
                query.type = type;

            if(typetwo && typetwo != 'notavailable')
                query.typetwo = typetwo;

            if(category && category != 'all'){
                 category = await Category.findOne({slug: category}); 
            } 
            let engines = Engine.find({ ...query }).populate([{
                path : 'episodes',
                options : {
                    sort : { number : 1}
                }
            }]);

            let episodes = await Episode.find({ ...query }).populate([{
                path : 'engines',
                options : {
                    sort : { number : 1}
                }
            }]);

            if(req.query.order) 
                engines.sort({ createdAt : -1})

            engines = await engines.exec();
            let categories = await Category.find({ parent : null }).populate('childs').exec();
            let logo = await Logo.find({});
            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/contacts");
            } else {
                res.render("home/contacts", {
                    recaptcha: this.recaptcha.render(),
                    title,
                    cart: req.session.cart,
                    engines,
                    categories,
                    episodes,
                    logo,
                    key: engines.key
                });
            }
        } catch (err) {
            next(err);
        }
    }

    async store(req , res , next){
        await this.recaptchaValidation(req , res);
        let status = await this.validationData(req);
        if(! status) {
            return this.back(req,res);
        }
        
        let { name ,phone ,email,body  } = req.body;

        let newContact = new Contact({
            user : req.user._id,
            name ,
            phone,
            email,
            body
        });
        this.alert(req , {
            title : 'با تشکر کاربر گرامی',
            message : 'دیدگاه شما با موفقیت ارسال شد',
            icon : 'success',
            button : 'بسیار خوب'
        })
        await newContact.save();
        return res.redirect('/');   
    } 
}

module.exports = new contactController();