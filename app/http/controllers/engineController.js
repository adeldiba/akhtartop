const controller = require('./controller');
const Engine = require('app/models/engine');
const Comment = require('app/models/comment');
const Category = require('app/models/category');
const Brand = require('app/models/brand');
const Device = require('app/models/device');
const Country = require('app/models/country');
const Like = require('app/models/like');
const Episode = require('app/models/episode');
const Payment = require('app/models/payment');
const Logo = require('app/models/logo');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const requestt = require('request-promise');
const engine = require('../../models/engine');


class engineController extends controller{
   async index(req,res, next){
        try {
            let title = 'لوازم یدکی ماشین آلات سنگین و نیمه سنگین ';
            let query = {};
            let{search , type,typetwo, category,brand,device,country } = req.query;
            if(search) 
                query.title = new RegExp(search , 'gi');

            if(type && type != 'all')
                query.type = type;

            if(typetwo && typetwo != 'notavailable')
                query.typetwo = typetwo;

            if(category && category != 'all'){
                 category = await Category.findOne({slug: category}); 
                 if(category)
                 query.categories = {$in : [category.id]}
            } 
            if(device && device != 'all'){
                device = await Device.findOne({slug: device}); 
                if(device)
                query.devices = {$in : [device.id]}
           } 
           if(country && country != 'all'){
            country = await Country.findOne({slug: country}); 
            if(country)
            query.countries = {$in : [country.id]}
       } 
           if(brand && brand != 'all'){
            brand = await Brand.findOne({slug: brand}); 
            if(brand)
            query.brands = {$in : [brand.id]}
       } 
            let page = req.query.page || 1; 
            let engines = await Engine.paginate({...query,lang : req.getLocale()} , { page , limit : 21 ,populate:[
                {
                    path : 'user', 
                    select : 'name'    
                } ,
                {
                    path : 'episodes',
                    options : { sort : { number : 1} }
                }  
            ]});
            if(req.query.order) 
                engines.sort({ createdAt : -1})

            
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
            let categories = await Category.find({ parent : null }).populate('childs').exec();
            let brands = await Brand.find({ parent : null }).populate('childs').exec();
            let devices = await Device.find({ parent : null }).populate('childs').exec();
            let countries = await Country.find({ parent : null }).populate('childs').exec();
            let logo = await Logo.find({}).populate().exec();
            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/engines");
            } else {
                const promises = [Engine.count({...query}).exec() ];
                Promise.all(promises).then(([engineCount])=>{res.render("home/engines", {engineCount,episode,engines,categories,logo,brands,devices,countries, title, cart: req.session.cart,
                key: engine.key});})
            
            }
            
        } catch (err) {
            next(err);
        }
    }

    async payment(req, res , next) {
        try {
            this.isMongoId(req.body.engine);

            let engine = await Engine.findById(req.body.engine);
            if(! engine) {
                return this.alertAndBack(req, res , {
                    title : 'دقت کنید',
                    message : 'چنین محصولی یافت نشد',
                    icon : 'error'
                });
            }

            // buy proccess
            let params = {
                MerchantID : 'f83cc956-f59f-11e6-889a-005056a205be',
                Amount : engine.price.replace(/,/g, ""),
                CallbackURL : 'http://localhost:3000/engines/payment/checker',
                Description : `بابت خرید محصول ${engine.title}`,
                Email : req.user.email
            };

            let options = this.getUrlOption(
                'https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json' ,
                 params
                );

          requestt(options)
                .then(async data => {
                    let payment = new Payment({
                        user : req.user.id,
                        engine : engine.id,
                        resnumber : data.Authority,
                        price : engine.price.replace(/,/g, "")
                    })
                
                    await payment.save();

                    res.redirect(`https://www.zarinpal.com/pg/StartPay/${data.Authority}`)
                })
                .catch(err => res.json(err.message));

        } catch (err) {
            next(err);
        }
    }
   
    async checker(req , res , next) {
        try {
            if(req.query.Status && req.query.Status !== 'OK')
                return this.alertAndBack(req, res , {
                    title : 'کاربر گرامی',
                    message : 'پرداخت شما با موفقیت انجام نشد',
                    icon : 'error',
                    button : 'خیلی خوب'
                });

            let payment = await Payment.findOne({ resnumber : req.query.Authority }).populate('engine').exec();

            if(! payment.engine) 
                return this.alertAndBack(req, res , {
                    title : 'دقت کنید',
                    message : 'محصولی که شما پرداخت کرده اید وجود ندارد',
                    icon : 'error'
                });

            let params = {
                MerchantID : 'f83cc956-f59f-11e6-889a-005056a205be',
                Amount : payment.engine.price,
                Authority : req.query.Authority
            }

            let options = this.getUrlOption('https://www.zarinpal.com/pg/rest/WebGate/PaymentVerification.json' , params)

            requestt(options)
                .then(async data => {
                    if(data.Status == 100) {
                        payment.set({ payment : true});
                        req.user.learning.push(payment.engine.id);

                        await payment.save();
                        await req.user.save();

                        this.alert(req , {
                            title : 'با تشکر',
                            message : 'عملیات مورد نظر با موفقیت انجام شد',
                            icon : 'success',
                            button : 'بسیار خوب'
                        })  

                        res.redirect(payment.engine.path());
                    } else {
                        this.alertAndBack(req, res , {
                            title : 'کاربر گرامی',
                            message : 'پرداخت شما با موفقیت انجام نشد',
                            icon : 'error',
                            button : 'خیلی خوب'
                        });
                    }
                }).catch(err => {
                    next(err);
                })
        } catch (err) {
            next(err);
        }
    }
    async single(req , res) { 
        let engine = await Engine.findOneAndUpdate({ slug : req.params.engine },{$inc : {viewCount : 1}}) 
                                .populate([
                                    {
                                        path : 'user', 
                                        select : 'name'    
                                    } ,
                                    {
                                        path : 'episodes',
                                        options : { sort : { number : 1} }
                                    } ,
                                    {
                                    path: 'likes'
                                    }
                                ])
                                .populate([
                                    {
                                        path : 'comments',
                                        match : {
                                            parent : null,
                                            approved : true
                                        },
                                        populate : [
                                            {
                                                path : 'user',
                                                select : 'name'
                                            },
                                            
                                            {
                                                path : 'comments',
                                                match : {
                                                    approved : true
                                                },
                                                populate : { path : 'user' , select : 'name'}
                                            }   
                                        ],
                                        populate : [
                                            {
                                                path : 'like',
                                            }
                                        ]
                                    }
                                ]);
                                            
        //let canUserUse = await this.canUse(req , engine);
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
        let likes = await Like.findOne({}).populate('engine').exec();
        let logo = await Logo.find({});                    
        let engines = await Engine.find({ }).populate('like').exec();
        let categories = await Category.find({ parent : null }).populate('childs').exec();
        if (req.session.cart && req.session.cart.length == 0) {
            delete req.session.cart;
            res.redirect('/singl-engine');
        }else{
            const promises = [Comment.count().exec() ];
            Promise.all(promises).then(([commentCount ])=>{res.render("home/single-engine", {
                commentCount,engine,categories, cart: req.session.cart,
                engines,likes,episode,logo,title:engine.title,key:engine.key
            });})
        
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

module.exports = new engineController();