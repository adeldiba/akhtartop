const controller = require('./controller');
const Engine = require('app/models/engine');
const Episode = require('app/models/episode');
const Category = require('app/models/category');
const Available = require('app/models/available');
const About = require('app/models/about');
const Logo = require('app/models/logo');

class aboutController extends controller{
   async about(req,res, next){
        try {
            let title = "درباره ما";

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
            let abouts = await About.find({}).populate().exec();
            let logo = await Logo.find({}).populate().exec();

            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/cart");
            } else {
                res.render("home/about_us", {
                    title,
                    cart: req.session.cart,
                    engines,
                    categories,
                    episode,
                    available,
                    abouts,
                    logo,
                    key: engines.key
                });
            }
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new aboutController();