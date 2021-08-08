const controller = require('./controller');
const Engine = require('app/models/engine');
const Category = require('app/models/category');
const Panel = require('app/models/panel');
const Episode = require('app/models/episode');
const Logo = require('app/models/logo');
const Payment = require('app/models/payment');
const request = require("request-promise");
const _ = require("lodash");

class cartController extends controller{
   async index(req,res, next){
        try {

            let query = {};
            let{search , type,typetwo, category } = req.query;
            if(search) 
                query.title = new RegExp(search , 'gi');

            if(type && type != 'all')
                query.type = type;

            if(typetwo && typetwo != 'notavailable')
                query.typetwo = typetwo;

            if(category && category != 'all'){
                 category = await Category.findOne({slug: category}); 
            } 
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
            let episodes = await Episode.find({ slug : req.params.engine }) 
                                                     
            let engines = Engine.find({...query, lang: req.getLocale()}).limit(30).populate([{
                path : 'episodes',
                options : {
                    sort : { number : 1},
                    limit: (1)
                },
                path: 'cart'
            }]);
            if(req.query.order) 
                engines.sort({ createdAt : 1})

            engines = await engines.exec();
            let categories = await Category.find({ parent : null }).populate('childs').exec();
            let panels = await Panel.find({user:req.user.id }).populate('user').exec();
            let logo = await Logo.find({}).populate().exec();
            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/cart");
            } else {
                res.render("home/cart", {
                    title: "سبد خرید شما",
                    cart: req.session.cart,
                    engines,
                    categories,
                    panels,
                    episode ,
                    episodes ,
                    logo,
                    key: engines.key
                });
            }
        } catch (err) {
            next(err);
        }
    }

    async add(req,res, next){
        try {
            let categories = await Category.find({ parent : null }).populate('childs').exec();
            var slug = req.params.engine;
            
           await Engine.findOne({slug: slug}, (err, engine)=>{
                if(err)
                   console.log(err);
              
                if (typeof req.session.cart == "undefined") {
                    req.session.cart = [];
                    req.session.cart.push({
                        _id: engine._id,
                        title: slug,
                        is_special: false,
                        model: engine.model,
                        qty: 1,
                         price: parseInt(
                        engine.price.toString().replace(/,/g, ""),
                        10
                    ),
                        file: engine.file         
                  });
                }else{
                    var cart = req.session.cart;
                    var newItem = true;
          
                    for (var i = 0; i < cart.length; i++){
                        if (cart[i].title == slug){
                            cart[i].qty++;
                            newItem = false;
                            break;
                        }
                    }
                    if (newItem) {
                        cart.push({
                            title: slug,
                            _id: engine._id,
                            is_special: false,
                            model: engine.model,
                            qty: 1,
                            price: parseInt(
                                engine.price.toString().replace(/,/g, ""),
                                10
                            ),
                            file:  engine.file ,  
                                
                        });
                    }
                }
                res.redirect('/cart', engine,categories);
             });
        } catch (err) {
            next(err)
        }
    }
    async addItem(req,res, next){
        try {
            let categories = await Category.find({ parent : null }).populate('childs').exec();
            var slug = req.params.cosmetic;
    
            Cosmetic.findOne({slug: slug}, (err, cosmetic)=>{
                if(err)
                   console.log(err);
              
                if (typeof req.session.cart == "undefined") {
                    req.session.cart = [];
                    req.session.cart.push({
                        _id: cosmetic._id,
                        is_special: false,
                        notprice: cosmetic.notprice,
                        title: cosmetic.title, 
                        model: cosmetic.model,
                        qty: 1,
                        price: parseInt(
                            cosmetic.price.toString().replace(/,/g, ""),
                            10
                        ),
                        file: cosmetic.file        
                  });
                }else{
                    var cart = req.session.cart;
                    var newItem = true;
          
                    for (var i = 0; i < cart.length; i++){
                        if (cart[i].title == slug){
                            cart[i].qty++;
                            newItem = false; 
                            break;
                        }
                    }
                    if (newItem) {
                        cart.push({
                            title: cosmetic.title,
                            _id: cosmetic._id,
                            is_special: false,
                            notprice: cosmetic.notprice,
                            model: cosmetic.model,
                            qty: 1,
                            price: parseInt(
                                cosmetic.price.toString().replace(/,/g, ""),
                                10
                            ), 
                            file:  cosmetic.file     
                        });
                    }
                }
                this.alert(req , {
                    message : 'محصول مورد نظر با موفقیت به سبد خرید اضافه شد',
                    icon : 'success'
                })  
                return this.back(req, res);
                
             });
        } catch (err) {
            next(err)
        }
    }

    async update(req, res) {
        var slug = req.params.cosmetic;
        var cart = req.session.cart;
        var action = req.query.action;

        for (var i = 0; i < cart.length; i++) {
            if (cart[i].title == slug) {
                switch (action) {
                    case "add":
                        cart[i].qty++;
                        break;
                    case "remove":
                        cart[i].qty--;
                        if (cart[i].qty < 1) cart.splice(i, 1);
                        break;
                    case "clear":
                        cart.splice(i, 1);
                        if (cart.length == 0) delete req.session.cart;
                        break;
                    default:
                        console.log("update problem");
                        break;
                }
                break;
            }
        }
        res.redirect("/cart");
    }

    async clear(req, res, next) { 
        delete req.session.cart;
        res.redirect("/cart");
    }

    async address(req,res, next){
            try {
                if (!req.session.cart || req.session.cart.length == 0) {
                    delete req.session.cart;
                    res.redirect("/shopping"); 
                    return;
                }
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
                const carts = req.session.cart;
                const engine_ids = _.map(carts, (item) => {
                    if (false === item.is_special) {
                        return item._id;
                    }
                });
        
        
                const shoppingList = [];
                let totalPrice = 0;
        
                let payment = await Payment.find({
                    parent: null
                }).populate("cart")
                    .exec();
                
                let categories = await Category.find({
                    parent: null,
                    lang: req.getLocale()
                })
                    .populate("childs")
                    .exec();
        
                let panels = await Panel.find({ user: req.user.id }).populate('payment');
                let engines = await Engine.find({
                    lang: req.getLocale(),
                    _id: { $in: [...engine_ids] }
                })
                .populate([{
                    path : 'episodes',
                    options : {
                        sort : { number : 1},
                        limit: (1)
                    },
                    path: 'cart'
                }]);
        
                for (let i of engines) {
                    const c = _.find(carts, { _id: String(i._id) });
                    if (!c) continue;
                    totalPrice += parseInt(i.price.toString().replace(/,/g, ""),10) * c.qty;
                    i.qty = c.qty;
                    shoppingList.push(i);
                }
                //return res.json(i);
                res.render("home/cart/address", {
                    title: "خرید محصول",
                    cart: req.session.cart,
                    categories,
                    payment,
                    panels,
                    shoppingList,
                    totalPrice,
                    episode,
                    key: engines.key
                });
            } catch (err) {
                next(err);
            }
    }
}

module.exports = new cartController();