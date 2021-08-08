const controller = require('./controller');
const Engine = require('app/models/engine');
const Episode = require('app/models/episode');
const Category = require('app/models/category');
const User = require('app/models/user');
const Check = require('app/models/check');
const Logo = require('app/models/logo');
const fs = require('fs');
const path = require('path');
const { isEmpty, uploadDir } = require('app/helpers/upload-helper');

class checkController extends controller{
   async index(req,res, next){
        try {
            let title = "کد مشتری ویژه";

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
            let categories = await Category.find({ parent : null, lang : req.getLocale() }).populate('childs').exec();
            let checks = await Check.find({user:req.user.id}).populate('user').exec();
            let logo = await Logo.find({}).populate().exec();

            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/cart");
            } else {
                res.render("home/vip/check", {
                    title,
                    cart: req.session.cart,
                    engines,
                    categories,
                    episodes,
                    checks,
                    logo,
                    key: engines.key
                });
            }
        } catch (err) {
            next(err);
        }
    }

    async check(req , res, next) {

        let filename = 'http://via.placeholder.com/640x360';

            if(!isEmpty(req.files)){
                let file = req.files.file;
                 filename = Date.now() + '-' + file.name;
                

                file.mv('./public/uploads/' + filename, function(err){
                    if(err) throw err;
            });
            }
        let newCheck = new Check({
            user : req.user._id,
            file: filename,
            ...req.body
        });

        await newCheck.save();
        this.alertAndBack(req ,res , {
            title : 'با تشکر',
            message : 'تصویر چک شما با موفقیت ارسال شد',
            type : 'success',
            button : 'بسیار خوب'
        })
        //return res.json(newCheck)
        return this.back(req, res);     
    }
    getUrlImage(dir) {
        return dir.substring(8);
    }

}

module.exports = new checkController();