const controller = require('./controller');
const Engine = require('app/models/engine');
const Episode = require('app/models/episode');
const Category = require('app/models/category');
const Panel = require('app/models/panel');
const Payment = require('app/models/payment');
const Logo = require('app/models/logo');
const request = require("request-promise");
const _ = require("lodash");

class shoppingController extends controller{
   async index(req,res, next){
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
        let logo = await Logo.find({});
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
        res.render("home/shopping", {
            title: "خرید محصول",
            cart: req.session.cart,
            categories,
            payment,
            panels,
            shoppingList,
            totalPrice,
            episode,
            logo,
            key: engines.key
        });
    } catch (err) {
        next(err);
    }
}
   
    async payment(req, res, next) {
        try {
            // this.isMongoId(req.body.special);
            if (!req.session.cart || req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/shopping");
                return;
            }
            const carts = req.session.cart;
            
            const engine_ids = _.map(carts, (item) => {
                if (false === item.is_special) {
                    return item._id;
                }
            });
            
            const addressMan = [];
            const shoppingList = [];
            let totalPrice = 0;
            
            let panels = await Panel.find({ user: req.user.id }).populate('payment');
            
            let engines = await Engine.find({
                lang: req.getLocale(),
                _id: { $in: [...engine_ids] }
            }).exec();
              
            const mengine = [];
            
             let year = 0 ;
             panels.forEach(panel =>{ 
                                  
               let md = panel.city;
                if(panel.city == 'تبریز'){
                   year = md.replace('تبریز', '15000')
               
               }else if((panel.city == 'ارومیه')){
                    year = md.replace('ارومیه' , '65000')
               } else{
                    year = md.replace('' , '65000')
               }  
               parseFloat(year) 
                 
           })
            
            for (let i of panels) {
                const c = _.find( { _id: String(i._id) });
                if (!c) continue;
                 
                i = JSON.parse(JSON.stringify(i));
                addressMan.push({ 
                  i: i.name,
                  'نام خانوادگی': i.name_family,
                  'شماره موبایل' : i.phone,
                  'تلفن ثابت ' :  i.telphone ,
                  'کدملی' : i.codeM ,
                  'استان': i.state ,
                  'شهر' : i.city ,
                  'آدرس' : i.address ,
                  'کدپستی' : i.postal_code
                    
                });
            }
            
            for (let i of engines) {
                const c = _.find(carts, { _id: String(i._id) });
                if (!c) continue;
                totalPrice += parseInt(i.price.toString().replace(/,/g, ""),10) * c.qty;
                i.qty = c.qty;
                i.is_special = false;
                i = JSON.parse(JSON.stringify(i));
                shoppingList.push({ 'نام محصول': i.title, 'تعداد': c.qty });
            }
            // buy proccess
            let params = {
                MerchantID: "f83cc956-f59f-11e6-889a-005056a205be",
                Amount: totalPrice + parseInt(year),
                CallbackURL: "http://localhost:3000/shopping/payment/checker",
                Description: "بابت خرید محصول از آختارتاپ", 
                Email: req.user.email
            };

            let options = this.getUrlOption(
                "https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json",
                params
            );

            request(options)
                .then(async (data) => {
                    let payment = new Payment({
                        user: req.user.id,
                        resnumber: data.Authority,
                        price: totalPrice,
                        products: shoppingList,
                        proAddress: addressMan
                    });
                  
                    await payment.save();
                    

                    res.redirect(
                        `https://www.zarinpal.com/pg/StartPay/${data.Authority}`
                    );
                })
                .catch((err) => res.json(err.message));
        } catch (err) {
            next(err);
        }
    }

    async checker(req, res, next) {
        try {
            if (req.query.Status && req.query.Status !== "OK")
                return this.alertAndBack(req, res, {
                    title: "کاربر گرامی",
                    message: "پرداخت شما با موفقیت انجام نشد",
                    type: "errore",
                    button: "خیلی خوب"
                });

            let payment = await Payment.findOne({
                resnumber: req.query.Authority,
                user: req.user.id,
            })
                .populate("cart")
                .exec();

            if (!payment) {
                return this.alertAndBack(req, res, {
                    title: "کاربر گرامی",
                    message: "محصولی که شما پرداخت کرده اید وجود ندارد",
                    type: "error"
                });
            }

            let params = {
                MerchantID: "f83cc956-f59f-11e6-889a-005056a205be",
                Amount: payment.price,
                Authority: req.query.Authority
            };

            let options = this.getUrlOption(
                "https://www.zarinpal.com/pg/rest/WebGate/PaymentVerification.json",
                params
            );

            request(options)
                .then(async (data) => {
                    console.log(data);
                    if (data.Status == 100) {
                        payment.set({ payment: true });
                         //req.user.push(payment.profile.address);

                        await payment.save();
                        await req.user.save();
                        

                        delete req.session.cart;

                        this.alertAndBack(req, res, {
                            title: "با تشکر",
                            message: "عملیات مورد نظر با موفقیت انجام شد",
                            type: "success",
                            button: "بسیار خوب"
                        });
                    } else {
                        this.alertAndBack(req, res, {
                            title: "کاربرگرامی",
                            message: "پرداخت شما با موفقیت انجام نشد",
                            type: "errore",
                            button: "خیلی خوب"
                        });
                    }
                })
                .catch((err) => {
                    next(err);
                });
        } catch (err) {
            next(err);
        }
    }

    getUrlOption(url, params) {
        return {
            method: "POST",
            uri: url,
            headers: {
                "cache-control": "no-cache",
                "content-type": "application/json"
            },
            body: params,
            json: true
        };
    }




    
}



module.exports = new shoppingController();