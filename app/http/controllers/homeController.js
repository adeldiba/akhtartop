const controller = require('./controller');
const Engine = require('app/models/engine');
const Episode = require('app/models/episode');
const Comment = require('app/models/comment');
const Slider = require('app/models/slider');
const Category = require('app/models/category');
const Logo = require('app/models/logo');
const Available = require('app/models/available');
const Device = require('app/models/device');
const User = require('app/models/user');
const sm = require('sitemap');
const rss = require('rss');
const striptags = require('striptags');

class homeController extends controller{
   async index(req,res, next){
        try {
            let title = "وبسایت فروشگاهی آختارتاپ";

            let query = {};
            let{search, type,typetwo,device, category } = req.query;
            if(search) 
                query.title = new RegExp(search , 'gi');

            if(type && type != 'all')
                query.type = type;

            if(typetwo && typetwo != 'notavailable')
                query.typetwo = typetwo;

            if(device && device != 'all'){
                device = await Device.findOne({slug: device}); 
            } 

            if(category && category != 'all'){
                 category = await Category.findOne({slug: category}); 
            } 
            let engines = Engine.find({ ...query, lang : req.getLocale() }).limit(30).populate([{
                path : 'episodes',
                options : {
                    sort : { number : -1},
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
                        options : { sort : { number : -1} }
                    }]);

            if(req.query.order) 
                engines.sort({ createdAt : -1})

            engines = await engines.exec();
            let categories = await Category.find({ parent : null, lang : req.getLocale() }).populate('childs').exec();
            let devices = await Device.find({ parent : null,lang : req.getLocale() }).populate('childs').exec();
            let available = await Available.find({}).populate('engine').exec();
            let sliders = await Slider.find({}).populate().exec();
            let logo = await Logo.find({}).populate().exec();
                                
            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/cart");
            } else {
                res.render("home/index", {
                    title,
                    cart: req.session.cart,
                    engines,
                    categories,
                    episode,
                    available,
                    devices,
                    sliders,
                    logo,
                    key: engines.key
                });
            }
        } catch (err) {
            next(err);
        }
    }
    async comment(req, res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);
        
            let newComment = new Comment({ 
                user : req.user.id,
                ...req.body
            });

            await newComment.save();

            return this.back(req, res);
        } catch (err) {
            next(err);
        }
    }

    async sitemap(req , res , next) {
        try {
            let sitemap = sm.createSitemap({
                hostname : config.siteurl
                // cacheTime : 600000
            });

            sitemap.add({ url : '/' , changefreq : 'daily' ,priority : 1 });
            sitemap.add({ url : '/engines' , priority : 1});


            let engines = await Engine.find({ }).sort({ createdAt : -1 }).exec();
            engines.forEach(engine => {
                sitemap.add({ url : engine.path() , changefreq : 'weekly' , priority : 0.8 })
            })

            let episodes = await Episode.find({ }).populate('engine').sort({ createdAt : -1 }).exec();
            episodes.forEach(episode => {
                sitemap.add({ url : episode.path() , changefreq : 'weekly' , priority : 0.8 })
            })

            res.header('Content-type' , 'application/xml');
            res.send(sitemap.toString());

        } catch (err) {
            next(err);
        }
    }

    async feedEngines(req , res , next) {
        try {
            let feed = new rss({
                title : 'فید خوان وبسایت فروشگاهی آختارتاپ',
                description : 'www.akhtartop.com',
                feed_url : `${config.siteurl}/feed/engines`,
                site_url : config.site_url,
            });

            let engines = await Engine.find({ }).sort({ createdAt : -1 }).exec();
            engines.forEach(engine => {
                feed.item({
                    title : engine.title,
                    description : striptags(engine.body.substr(0,100)),
                    date : engine.createdAt,
                    url : engine.path()
                })
            })

            res.header('Content-type' , 'application/xml');
            res.send(feed.xml());

        } catch (err) {
            next(err);
        }
    }
    async feedEpisodes(req , res , next) {
        try {
            let feed = new rss({
                title : 'فید خوان محصولات ویژه آختارتاپ',
                description : 'www.akhtartop.com',
                feed_url : `${config.siteurl}/feed/engines`,
                site_url : config.site_url,
            });

            let episodes = await Episode.find({ }).populate({ path :'engine' , populate : 'user'}).sort({ createdAt : -1 }).exec();
            episodes.forEach(episode => {
                feed.item({
                    title : episode.title,
                    description : striptags(episode.body.substr(0,100)),
                    date : episode.createdAt,
                    url : episode.path(),
                    author : episode.engine.user.name
                })
            })

            res.header('Content-type' , 'application/xml');
            res.send(feed.xml());
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new homeController();