const controller = require('app/http/controllers/controller');
const Payment = require('app/models/payment');
const Panel = require('app/models/panel');
const RealPerson = require('app/models/realPerson');
const LegalPerson = require('app/models/legalPerson');
const Engine = require('app/models/engine');
const Logo = require('app/models/logo');
const Episode = require('app/models/episode');
const Category = require('app/models/category');
const Comment = require('app/models/comment');
const Message = require('app/models/message');
const Like = require('app/models/like');
const ActivationCode = require('app/models/activationCode');
const Available = require('app/models/available');

class userController extends controller {
    async activation(req , res ,next) {
        try {
            let activationCode = await ActivationCode.findOne({ code : req.params.code }).populate('user').exec();

            if( ! activationCode ) {
                this.alert(req , {
                    title : 'دقت کنید',
                    message : 'متاسفانه چنین لینک فعال سازی وجود ندارد',
                    button : 'بسیار خوب'
                });

                return res.redirect('/');
            }

            if( activationCode.expire < new Date() ) {
                this.alert(req , {
                    title : 'دقت کنید',
                    message : 'مهلت استفاده از این لینک به پایان رسیده است',
                    button : 'بسیار خوب'
                });

                return res.redirect('/');
            }

            if( activationCode.used  ) {
                this.alert(req , {
                    title : 'دقت کنید',
                    message : 'این لینک قبلا مورد استفاده قرار گرفته است',
                    button : 'بسیار خوب'
                });

                return res.redirect('/');
            }

            let user = activationCode.user;
            user.$set({ active : true });
            activationCode.$set({ used : true });

            await user.save();
            await activationCode.save();


            req.logIn(user , err => {
                user.setRememberToken(res);
                this.alert(req , {
                    title : 'با تشکر',
                    message : 'اکانت شما فعال شد',
                    button : 'بسیار خوب',
                    icon : 'success'
                });
                return res.redirect('/');
            })
            

        } catch (err) {
            next(err);
        }
    }
    async index(req , res , next) {
        try {
            let title = "پنل کاربری";

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
            let panels = await Panel.find({user: req.user.id});
            let logo = await Logo.find({});
            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/panel/index");
            } else {
                res.render("home/panel/index", {
                    recaptcha: this.recaptcha.render(),
                    title,
                    cart: req.session.cart,
                    engines,
                    categories,
                    episodes,
                    panels,
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
        
        let { name ,name_family ,phone , certificate, codeM, telphone,birth_year ,birth_day ,birth_month  ,men, woman ,genders, location ,state , city , address, postal_code, cart  } = req.body;

        let newPanel = new Panel({
            user : req.user._id,
            name ,
            name_family,
            phone ,
            telphone, 
            birth_year ,
            birth_day ,
            birth_month ,
            certificate,
            codeM,
            men,
            woman,
            genders,
            location,
            state ,
            city ,
            address,
            postal_code,
            cart
        });

        await newPanel.save();
        return res.redirect('/user/panel');   
    }

    async editAddress(req , res , next){
        try {

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
            this.isMongoId(req.params.id);
            let panel = await Panel.findById(req.params.id);
            if( ! panel ) this.error('چنین پروفایلی وجود ندارد' , 404);

            return res.render('home/panel/editAddress' , { recaptcha: this.recaptcha.render(),panel,logo, engines,  categories,episodes});
        } catch (err) {
            next(err);
        }
    }

    async update(req, res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);

            
            let panel =  await Panel.findByIdAndUpdate(req.params.id , { $set : { ...req.body }})
            
            // prev engine time update
            //this.updateEngineTime(episode.engine);
            // now engine time update
            //this.updateEngineTime(req.body.engine);


            return res.redirect('/user/panel');
        } catch(err) {
            next(err);
        }
    }


    async profile(req, res, next){
        try {
            let title = "آدرس های من";

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
            let panels = await Panel.find({user:req.user.id }).populate('user').exec();
            let logo = await Logo.find({});

            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/panel/profile");
            } else {
                res.render("home/panel/profile", {
                    recaptcha: this.recaptcha.render(),
                    title,
                    cart: req.session.cart,
                    engines,
                    categories,
                    episodes,
                    panels,
                    logo,
                    key: engines.key
                });
            }
        } catch (err) {
            next(err);
        }
    }
    async comment(req, res, next){
        try {
            let title = "نظرات";

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
            let logo = await Logo.find({});
            let categories = await Category.find({ parent : null }).populate('childs').exec();
            let comments = await Comment.find({ user:req.user.id }).populate([
                {
                    path : 'user', 
                    select : 'name'   
                } ,
                {
                    path : 'episodes',
                    options : { sort : { number : 1} }
                } 
            ]).populate([
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
                    ]
                }
            ]).exec();

            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/panel/comment");
            } else {
                res.render("home/panel/comment", {
                    recaptcha: this.recaptcha.render(),
                    title,
                    cart: req.session.cart,
                    engines,
                    categories,
                    episodes,
                    comments,
                    logo,
                    key: engines.key
                });
            }
        } catch (err) {
            next(err);
        }
    }

    async destroy(req , res, next) {
        try {
            this.isMongoId(req.params.id);
            let panel = await Panel.findById(req.params.id).populate('user').exec(); 
            if( ! panel ) this.error('چنین آدرسی وجود ندارد' , 404);
            
            // delete panel
            panel.remove();

            return res.redirect('/user/panel'); 
        } catch (err) {
            next(err)
        }        
    }

    async message(req , res, next) {
        let title = "پیغام از طرف سایت";

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
                },
                path: 'payment'
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
            let logo = await Logo.find({});
            let categories = await Category.find({ parent : null }).populate('childs').exec();
            let messages = await Message.find({}).populate().exec();

            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/panel/messages");
            } else {
                res.render("home/panel/messages", {
                    title,
                    cart: req.session.cart,
                    engines,
                    categories,
                    episodes,
                    messages,
                    logo,
                    key: engines.key
                });
            }       
    }
  
    async favorites(req , res, next) {
        let title = "لیست علاقه مندی ها";

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
                },
                path: 'payment'
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
            let logo = await Logo.find({});
            let engine = await Engine.findOneAndUpdate({ slug : req.params.engine }) 
                                .populate([
                                    {
                                        path : 'user', 
                                        select : 'name'    
                                    } ,
                                    {
                                        path : 'episodes',
                                        options : { sort : { number : 1} }
                                    }                         
                                ]);
            let categories = await Category.find({ parent : null }).populate('childs').exec();
            let likes = await Like.find({ user : req.user.id }).populate('engine').exec();
            let available = await Available.find({}).populate('engine').exec();

            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/cart");
            } else {
                res.render("home/panel/favorites", {
                    title,
                    cart: req.session.cart,
                    engines,
                    categories,
                    episodes,
                    likes,
                    engine,
                    available,
                    logo,
                    key: engines.key
                });
            }       
    }

    async history(req , res , next) {
        let title = "سفارش ها";

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
                },
                path: 'payment'
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
            let logo = await Logo.find({});
            let categories = await Category.find({ parent : null }).populate('childs').exec();
            let page = req.query.page || 1;
            let payments = await Payment.paginate({ user : req.user.id } , { page , sort : { createdAt : -1} , limit : 10 , populate : 'engine'});

            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/panel/history");
            } else {
                res.render("home/panel/history", {
                    title,
                    cart: req.session.cart,
                    engines,
                    categories,
                    episodes,
                    payments,
                    logo,
                    key: engines.key
                });
            }
        }
   

    async expert(req,res, next){
            try {
                let title = 'درخواست متخصص فنی';
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
                     if(category)
                     query.categories = {$in : [category.id]}
                } 
                let engines = Engine.find({ ...query });
    
    
                if(req.query.order) 
                    engines.sort({ createdAt : -1})
    
                engines = await engines.exec();
                let logo = await Logo.find({});
                let categories = await Category.find({ parent : null }).populate('childs').exec();
                if (req.session.cart && req.session.cart.length == 0) {
                    delete req.session.cart;
                    res.redirect("/panel/experts");
                } else {
                    res.render("home/panel/experts", {
                        recaptcha: this.recaptcha.render(),
                        title,
                        cart: req.session.cart,
                        engines,
                        categories,
                        logo,
                        key: engines.key
                    });
                }
                
            } catch (err) {
                next(err);
            }
        }

    async realPerson(req,res, next){
        await this.recaptchaValidation(req , res);
        let status = await this.validationData(req);
        if(! status) {
            return this.back(req,res);
        }
        
        let { nameP ,nameP_family ,phoneP , certificateP, codeMP, telphoneP,birth_yearP ,birth_dayP ,birth_monthP ,men, woman ,genders,store_name,kala,Shaba_number,variety, locationP ,stateP , cityP , addressP, postal_codeP  } = req.body;

        let newrealPerson = new RealPerson({
            user : req.user._id,
            nameP ,
            nameP_family,
            phoneP ,
            certificateP,
            codeMP,
            telphoneP, 
            birth_yearP ,
            birth_dayP ,
            birth_monthP,
            men,
            woman,
            genders,
            store_name,
            kala,
            Shaba_number,
            variety,
            locationP,
            stateP ,
            cityP ,
            addressP,
            postal_codeP
        });
        this.alert(req , {
            title : 'با تشکر',
            message : 'اطلاعات شما با موفقیت ثبت شد',
            icon : 'success',
            button : 'بسیار خوب'
        })
        await newrealPerson.save();
        
        return res.redirect('/user/panel/experts');  
        } 

    async legal(req,res, next){
            try {
                let title = 'شخص حقوقی';
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
                     if(category)
                     query.categories = {$in : [category.id]}
                } 
                let engines = Engine.find({ ...query });
    
    
                if(req.query.order) 
                    engines.sort({ createdAt : -1})
    
                engines = await engines.exec();
                let logo = await Logo.find({});
                let categories = await Category.find({ parent : null }).populate('childs').exec();
                if (req.session.cart && req.session.cart.length == 0) {
                    delete req.session.cart;
                    res.redirect("/panel/experts/legal");
                } else {
                    res.render("home/panel/experts/legal", {
                        recaptcha: this.recaptcha.render(),
                        title,
                        cart: req.session.cart,
                        engines,
                        categories,
                        logo,
                        key: engines.key
                    });
                }
                
            } catch (err) {
                next(err);
            }
        }
    async storeLegal(req,res, next){
            await this.recaptchaValidation(req , res);
            let status = await this.validationData(req);
            if(! status) {
                return this.back(req,res);
            }
            
            let { company_name ,company_type , register_number,national_ID,economic_code,holders_sign,phoneP ,  telphoneP ,store_name,kala,Shaba_number,variety, locationP ,stateP , cityP , addressP, postal_codeP  } = req.body;
    
            let newlegalPerson = new LegalPerson({
                user : req.user._id,
                company_name ,
                company_type,
                phoneP ,
                register_number,
                national_ID,
                telphoneP, 
                economic_code ,
                holders_sign ,
                store_name,
                kala,
                Shaba_number,
                variety,
                locationP,
                stateP ,
                cityP ,
                addressP,
                postal_codeP
            });
            this.alert(req , {
                title : 'با تشکر',
                message : 'اطلاعات شما با موفقیت ثبت شد',
                icon : 'success',
                button : 'بسیار خوب'
            })
            await newlegalPerson.save();
            return res.redirect('/user/panel/experts/legal');  
        }  
}

module.exports = new userController();