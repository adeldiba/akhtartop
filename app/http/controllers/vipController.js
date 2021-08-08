const controller = require('./controller');
const Engine = require('app/models/engine');
const Episode = require('app/models/episode');
const Comment = require('app/models/comment');
const Category = require('app/models/category');
const User = require('app/models/user');
const Logo = require('app/models/logo');
const Vip = require('app/models/vip');
const Article = require('app/models/article');

class vipController extends controller{
   async index(req,res, next){
        try {
            let title = "کد مشتری ویژه";

            let query = {};
            let{search, type,typetwo, category, vipTrue } = req.query;
            if(search) 
                query.title = new RegExp(search , 'gi');
            

            if(type && type != 'all')
                query.type = type;

            if(typetwo && typetwo != 'notavailable')
                query.typetwo = typetwo;

            if(category && category != 'all'){
                 category = await Category.findOne({slug: category}); 
            } 
            let engines = Engine.find({ ...query, lang : req.getLocale() }).populate([{
                path : 'episodes',
                options : {
                    sort : { number : 1},
                    limit: (4)
                }
            }]);

            let episodes = await Episode.find({ ...query, lang : req.getLocale() }).sort({createdAt : -1}).limit(4).populate([{
                path : 'engines',
                options : {
                    sort : { number : 1} 
                }
            }]);

            if(req.query.order) 
                engines.sort({ createdAt : -1})

            engines = await engines.exec();
            let logo = await Logo.find({});
            let categories = await Category.find({ parent : null, lang : req.getLocale() }).populate('childs').exec();
            let vips = await Vip.find({ }).populate().exec();
           let password = await Vip.find({ }).populate().exec();
            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/cart");
            } else {
                res.render("home/vip", {
                    recaptcha : this.recaptcha.render(),
                    title,
                    cart: req.session.cart,
                    engines,
                    categories,
                    episodes,
                    vips,
                    password,
                    logo,
                    key: vips.key
                });
            }
        } catch (err) {
            next(err);
        }
    }

    async vipCode(req,res, next){
        try {
            await this.recaptchaValidation(req , res);
            const vips = await Vip.findOneAndUpdate({}).populate('user');
        
            if(req.body.password === vips.password ) {
               
                return res.redirect("/vip/check");
            }else{
                req.flash("errors", "کد وارد شده نامعتبر است.");
                return res.redirect('/vip');
            }
        } catch (err) {
            next(err);
        }
    }
    async article(req,res, next){
        try {
            let title = "توضیح بیشتر برای مشتری ویژه";

            let query = {};
            let{search, type,typetwo, category} = req.query;
            if(search) 
                query.title = new RegExp(search , 'gi');
            

            if(type && type != 'all')
                query.type = type;

            if(typetwo && typetwo != 'notavailable')
                query.typetwo = typetwo;

            if(category && category != 'all'){
                 category = await Category.findOne({slug: category}); 
            } 
            let engines = Engine.find({ ...query, lang : req.getLocale() }).populate([{
                path : 'episodes',
                options : {
                    sort : { number : 1},
                    limit: (4)
                }
            }]);

            let episodes = await Episode.find({ ...query, lang : req.getLocale() }).sort({createdAt : -1}).limit(4).populate([{
                path : 'engines',
                options : {
                    sort : { number : 1} 
                }
            }]);

            if(req.query.order) 
                engines.sort({ createdAt : -1})

            engines = await engines.exec();
            let logo = await Logo.find({});
            let categories = await Category.find({ parent : null, lang : req.getLocale() }).populate('childs').exec();
            let articles = Article.find({  ...query,lang : req.getLocale() }).populate();
            articles = await articles.exec();
            let vips = await Vip.find({ }).populate().exec();
           
            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/cart");
            } else {
                res.render("home/vip/articles", {
                    recaptcha : this.recaptcha.render(),
                    title,
                    cart: req.session.cart,
                    engines,
                    categories,
                    episodes,
                    vips,
                    articles,
                    logo,
                    key: articles.title  
                });
            }
        } catch (err) {
            next(err);
        }
    }
    async single(req , res) { 
        let article = await Article.findOneAndUpdate({ slug : req.params.article },{$inc : {viewCount : 1}}).exec();
        let logo = await Logo.find({});                       
        let categories = await Category.find({ parent : null }).populate('childs').exec();
        if (req.session.cart && req.session.cart.length == 0) {
            delete req.session.cart;
            res.redirect('/singl-engine');
        }else{
            res.render("home/vip/single-article", {
                article,categories, cart: req.session.cart,logo,key: article.title,title: article.title 
            });
        }   
    }

    getUrlOption(url , params) {
        return {
            method : 'POST',
            uri : url,
            headers : {
                'cache-control' : 'no-cache',
                'content-type' : 'application/json'
            },
            body : params,
            json: true
        }
    }
}

module.exports = new vipController();