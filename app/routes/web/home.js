const express = require('express');
const router = express.Router();


// Controllers
const homeController = require('app/http/controllers/homeController');
const engineController = require('app/http/controllers/engineController');
const cartController = require('app/http/controllers/cartController');
const userController = require('app/http/controllers/userController');
const shoppingController = require('app/http/controllers/shoppingController');
const likeController = require('app/http/controllers/likeController');
const contactController = require('app/http/controllers/contactController');
const availableController = require('app/http/controllers/availableController');
const vipController = require('app/http/controllers/vipController');
const checkController = require('app/http/controllers/checkController');
const aboutController = require('app/http/controllers/aboutController');
const responseController = require('app/http/controllers/responseController');
const return_procedureController = require('app/http/controllers/return_procedureController');
const websiteController = require('app/http/controllers/websiteController');
const couponController = require('app/http/controllers/couponController');

//const articleController = require('app/http/controllers/checkController');
// validators 
const commentValidator = require('app/http/validators/commentValidator');
const userValidator = require('app/http/validators/userValidator');
const realPersonValidator = require('app/http/validators/realPersonValidator');
const legalPersonValidator = require('app/http/validators/legalPersonValidator');
const contactValidator = require('app/http/validators/contactValidator');
const checkVipValidator = require('app/http/validators/checkVipValidator');
const vipHomeValidator = require('app/http/validators/vipHomeValidator');

// Helpers
const upload = require('app/helpers/uploadImage'); 

// Middlewares
const redirectIfNotAuthenticated = require('app/http/middleware/redirectIfNotAuthenticated');
const redirectifPanelNotAuthenticated = require('app/http/middleware/redirectifPanelNotAuthenticated');
const convertFileToField = require('app/http/middleware/convertFileToField');
const redirectifVipNotAuthenticated = require('app/http/middleware/redirectifVipNotAuthenticated');

router.get('/user/activation/:code' , userController.activation);

router.get('/', homeController.index);

//about_us
router.get('/about_us', aboutController.about);

//response
router.get('/response', responseController.response);
//response
router.get('/coupon/coupon_text', couponController.coupon);
router.get('/coupon/coupon_text/:coupon_text', couponController.single);
//Return procedure
router.get('/return_procedure', return_procedureController.return_procedure); 
//Website Usage Guide
router.get('/website_Usage_Guide', websiteController.website);

// vip
router.get('/vip',redirectIfNotAuthenticated.handle, vipController.index);
router.post('/vip',vipHomeValidator.handle(), vipController.vipCode);
router.get('/vip/check',redirectIfNotAuthenticated.handle, checkController.index);
router.post('/vip/check',redirectIfNotAuthenticated.handle ,checkVipValidator.handle(),
     checkController.check
);
router.get('/vip/articles', vipController.article);
router.get('/vip/articles/:article', vipController.single);

router.get('/engines', engineController.index);
router.get('/engines/:engine', engineController.single);
router.post('/engines/payment' , redirectIfNotAuthenticated.handle , engineController.payment);
router.get('/engines/payment/checker' , redirectIfNotAuthenticated.handle , engineController.checker);  

//Contact
router.get('/contacts', contactController.index);
router.post('/contacts' , contactValidator.handle() , contactController.store);
// cart
router.get('/cart',redirectIfNotAuthenticated.handle, cartController.index);
router.get('/cart/add/engines/:engine', cartController.add);

router.get('/cart/addItem/engines/:engine', cartController.addItem);
router.get('/cart/update/:engine' , cartController.update );
router.get('/clear' , cartController.clear);
router.get('/cart/address' ,redirectifPanelNotAuthenticated.handle ,cartController.address);

// Shopping
router.get('/shopping' ,redirectIfNotAuthenticated.handle, shoppingController.index);
router.post('/shopping/payment' , redirectIfNotAuthenticated.handle , shoppingController.payment);
router.get('/shopping/payment/checker' , redirectIfNotAuthenticated.handle , shoppingController.checker);

// articleVip
//router.get('/articleVip' , articleController.index);
// panel
router.get('/user/panel' , userController.index);
router.post('/user/panel', userValidator.handle(), userController.store);
router.get('/user/panel/:id/editAddress' , userController.editAddress);
router.put('/user/panel/:id', userValidator.handle(), userController.update);

router.get('/user/panel/history' , userController.history);
router.get('/user/panel/messages' , userController.message);
router.get('/user/panel/favorites' , userController.favorites);
router.get('/user/panel/comment' , userController.comment);
router.get('/user/panel/experts' , userController.expert);
router.post('/user/panel/experts' ,realPersonValidator.handle(), userController.realPerson);
router.get('/user/panel/experts/legal' , userController.legal);
router.post('/user/panel/experts/legal' ,legalPersonValidator.handle(), userController.storeLegal);
router.get('/user/panel/profile' , userController.profile);
router.delete('/user/panel/:id' ,userController.destroy);

// like
router.post('/like/:engine',redirectIfNotAuthenticated.handle,likeController.store);
// available
router.post('/available/:engine',redirectIfNotAuthenticated.handle,availableController.store);

// Router Comment
router.post('/comment' , redirectIfNotAuthenticated.handle , commentValidator.handle() ,homeController.comment);

// sitemap
router.get('/sitemap.xml' , homeController.sitemap);
router.get('/feed/engines' , homeController.feedEngines);
router.get('/feed/episodes' , homeController.feedEpisodes);


router.get('/logout', (req, res)=>{
    req.logout();
    res.clearCookie('remember_token');
    res.redirect('/');
});

module.exports = router;