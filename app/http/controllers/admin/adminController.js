const controller = require('app/http/controllers/controller');
const Engine = require('app/models/engine');
const User = require('app/models/user');
const Comment = require('app/models/comment');
const Like = require('app/models/like');
const Payment = require('app/models/payment');
const Category = require('app/models/category');
const faker = require('faker');

class indexController extends controller{
   async index(req,res, next){ 
        const promises = [Engine.count().exec(),User.count().exec(),Comment.count().exec(),Payment.count().exec(),Like.count().exec(),
                        Category.count().exec()];
        Promise.all(promises).then(([enginCount,userCount,commentCount,paymentCount,likeCount,categoryCount])=>{res.render("admin/index", {
            enginCount,userCount,commentCount,paymentCount,likeCount,
            categoryCount
        });}) 
          
    }

    fake(req, res, next) {
       for(let i = 0;i < req.body.amount; i++){
            let engine = new Engine();
            engine.title = faker.name.title(),
            engine.slug = faker.name.title(),
            engine.titleE = faker.name.title(),
            engine.body = faker.lorem.sentence();
            engine.body2 = faker.lorem.sentence();
            engine.body3 = faker.lorem.sentence();
            engine.body4 = faker.lorem.sentence();
            engine.thumb = faker.image.fashion();
            engine.images = faker.image.fashion();
            engine.model = faker.vehicle.model();
            engine.price = faker.commerce.price();
            engine.lang = faker.name.title();
            engine.type = faker.name.title();
            engine.typetwo = faker.name.title();
            engine.key = faker.name.title();
            engine.save(function(err){
                if (err) throw err;
            });
       } 
       res.redirect('/admin/engines');
    }

    uploadImage(req, res) {
        let image = req.file;
        res.json({
            "uploaded" : 1,
           "fileName" : image.originalname,
           "url" : `${image.destination}/${image.filename}`.substring(8)
        });
    }
}

module.exports = new indexController();