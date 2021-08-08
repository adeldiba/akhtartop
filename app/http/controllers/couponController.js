const controller = require('./controller');
const Engine = require('app/models/engine');
const Episode = require('app/models/episode');
const Category = require('app/models/category');
const Available = require('app/models/available');
const Coupon_text = require('app/models/coupon_text');
const Logo = require('app/models/logo');

class couponController extends controller{
   async coupon(req,res, next){
        try {
            let title = "مقاله بن تخفیف";

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
            let engines = Engine.find({ ...query, lang : req.getLocale() }).limit(30).populate([{
                path : 'episodes',
                options : {
                    sort : { number : 1},
                    limit: (1)
                }
            }]);

            let episode = await Episode.findOneAndUpdate({ slug : req.params.engine },{$inc : {viewCount : 1}}) 
                                .populate([
                                    {
                                        path : 'user', 
                                        select : 'name'    
                                    } ,
                                    {
                                        path : 'engines',
                                        options : { sort : { number : 1} }
                                    }]);

            if(req.query.order) 
                engines.sort({ createdAt : 1})

            engines = await engines.exec();
            let categories = await Category.find({ parent : null, lang : req.getLocale() }).populate('childs').exec();
            let available = await Available.find({}).populate('engine').exec();
            let coupon_texts = await Coupon_text.find({ ...query,lang : req.getLocale() }).populate().exec();
            let logo = await Logo.find({}).populate().exec();
                                
            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/cart");
            } else {
                res.render("home/coupon/coupon_text", {
                    title,
                    cart: req.session.cart,
                    engines,
                    categories,
                    episode,
                    available,
                    coupon_texts,
                    logo,
                    key: engines.key
                });
            }
        } catch (err) {
            next(err);
        }
    }
    async single(req , res) { 
        let coupon_text = await Coupon_text.findOneAndUpdate({ slug : req.params.coupon_text },{$inc : {viewCount : 1}}).exec();
                               
        let categories = await Category.find({ parent : null }).populate('childs').exec();
        let logo = await Logo.find({});
        if (req.session.cart && req.session.cart.length == 0) {
            delete req.session.cart;
            res.redirect('/cart');
        }else{
            res.render("home/coupon/single-coupon", {
                coupon_text,categories, cart: req.session.cart,logo,title:coupon_text.title,key:coupon_text.title
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

module.exports = new couponController();