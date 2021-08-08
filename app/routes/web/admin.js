const express = require('express');
const router = express.Router();

// Controllers
const adminController = require('app/http/controllers/admin/adminController');
const engineController = require('app/http/controllers/admin/engineController');
const commentController = require('app/http/controllers/admin/commentController');
const categoryController = require('app/http/controllers/admin/categoryController');
const deviceController = require('app/http/controllers/admin/deviceController');
const logoController = require('app/http/controllers/admin/logoController');
const sliderController = require('app/http/controllers/admin/sliderController');
const responseController = require('app/http/controllers/admin/responseController');
const episodeController = require('app/http/controllers/admin/episodeController');
const userController = require('app/http/controllers/admin/userController');
const shoppingController = require('app/http/controllers/admin/shoppingController');
const userAddressController = require('app/http/controllers/admin/userAddressController');
const vendorController = require('app/http/controllers/admin/vendorController');
const aboutController = require('app/http/controllers/admin/aboutController');
const brandController = require('app/http/controllers/admin/brandController');
const countryController = require('app/http/controllers/admin/countryController');
const messageController = require('app/http/controllers/admin/messageController');
const contactController = require('app/http/controllers/admin/contactController');
const availableController = require('app/http/controllers/admin/availableController');
const vipController = require('app/http/controllers/admin/vipController');
const checkController = require('app/http/controllers/admin/checkController');
const articleController = require('app/http/controllers/admin/articleController');
const returnController = require('app/http/controllers/admin/returnController');
const guideController = require('app/http/controllers/admin/guideController');
const couponController = require('app/http/controllers/admin/couponController');

// validators 
const engineValidator = require('app/http/validators/engineValidator');
const categoryValidator = require('app/http/validators/categoryValidator');
const deviceValidator = require('app/http/validators/deviceValidator');
const logoValidator = require('app/http/validators/logoValidator');
const sliderValidator = require('app/http/validators/sliderValidator');
const responseValidator = require('app/http/validators/responseValidator');
const episodeValidator = require('app/http/validators/episodeValidator');
const aboutValidator = require('app/http/validators/aboutValidator');
const brandValidator = require('app/http/validators/brandValidator');
const countryValidator = require('app/http/validators/countryValidator');
const messageValidator = require('app/http/validators/messageValidator');
const vipValidator = require('app/http/validators/vipValidator');
const articleValidator = require('app/http/validators/articleValidator');
const returnValidator = require('app/http/validators/returnValidator');
const guideValidator = require('app/http/validators/guideValidator');
const couponValidator = require('app/http/validators/couponValidator');
// Helpers
const upload = require('app/helpers/uploadImage');

// Middlewares
const convertFileToField = require('app/http/middleware/convertFileToField')

router.use((req , res , next) => {
    res.locals.layout = "admin/master"; 
    next();
})

//about As
router.get('/about_us' , aboutController.index);
router.get('/about_us/create' , aboutController.create);
router.post('/about_us/create' , convertFileToField.handle , aboutValidator.handle() , aboutController.store);
router.get('/about_us/:id/edit' , aboutController.edit);
router.put('/about_us/:id' ,
    convertFileToField.handle ,
    aboutValidator.handle() ,    
    aboutController.update
);
router.delete('/about_us/:id' , aboutController.destroy);

//returns
router.get('/return_p' , returnController.index);
router.get('/return_p/create' , returnController.create);
router.post('/return_p/create' , convertFileToField.handle , returnValidator.handle() , returnController.store);
router.get('/return_p/:id/edit' , returnController.edit);
router.put('/return_p/:id' ,
    convertFileToField.handle ,
    returnValidator.handle() ,    
    returnController.update
);
router.delete('/return_p/:id' , returnController.destroy);

//guide
router.get('/guides' , guideController.index);
router.get('/guides/create' , guideController.create);
router.post('/guides/create' , convertFileToField.handle , guideValidator.handle() , guideController.store);
router.get('/guides/:id/edit' , guideController.edit);
router.put('/guides/:id' ,
    convertFileToField.handle ,
    guideValidator.handle() ,    
    guideController.update
);
router.delete('/guides/:id' , guideController.destroy);

//articleVip
router.get('/articles' , articleController.index);
router.get('/articles/create' , articleController.create);
router.post('/articles/create' , convertFileToField.handle , articleValidator.handle() , articleController.store);
router.get('/articles/:id/edit' , articleController.edit);
router.put('/articles/:id' ,
    convertFileToField.handle ,
    articleValidator.handle() ,    
    articleController.update
);
router.delete('/articles/:id' , articleController.destroy);

// Admin Routes
router.get('/' , adminController.index);
router.post('/generate-fake-posts' , adminController.fake);
// Engine Routes
router.get('/engines' , engineController.index);
router.get('/engines/create' , engineController.create);
router.post('/engines/create' , engineValidator.handle() , engineController.store);
router.get('/engines/:id/edit' , engineController.edit);
router.put('/engines/:id' ,
    engineValidator.handle() ,    
    engineController.update
);
router.delete('/engines/:id' , engineController.destroy);

// Vip
router.get('/vip_reg' , vipController.index);
router.post('/vip_reg', vipValidator.handle() , vipController.store);
router.delete('/vip_reg/:id', vipController.destroy);

// check
router.get('/checks' , checkController.index);
router.get('/checks/approved' , checkController.approved);
router.put('/checks/:id/approved' , checkController.update );
router.put('/checks/:id/approvedd' , checkController.notupdate );
// Episode Routes
router.get('/episodes' , episodeController.index);
router.get('/episodes/create' , episodeController.create);
router.post('/episodes/create' , episodeValidator.handle() , episodeController.store );
router.get('/episodes/:id/edit' , episodeController.edit);
router.put('/episodes/:id' , episodeValidator.handle() , episodeController.update );
router.delete('/episodes/:id' , episodeController.destroy);

// Comment Routes
router.get('/comments/approved' , commentController.approved);
router.get('/comments' , commentController.index);
router.put('/comments/:id/approved' , commentController.update );
router.delete('/comments/:id' , commentController.destroy);

// Category Routes
router.get('/categories' , categoryController.index);
router.get('/categories/create' , categoryController.create);
router.post('/categories/create' , categoryValidator.handle() , categoryController.store );
router.get('/categories/:id/edit' , categoryController.edit);
router.put('/categories/:id' , categoryValidator.handle() , categoryController.update );
router.delete('/categories/:id' , categoryController.destroy);

// brand
router.get('/brands' , brandController.index);
router.get('/brands/create' , brandController.create);
router.post('/brands/create' , brandValidator.handle() , brandController.store );
router.get('/brands/:id/edit' , brandController.edit);
router.put('/brands/:id' , brandValidator.handle() , brandController.update );
router.delete('/brands/:id' , brandController.destroy);

// Country
router.get('/countries' , countryController.index);
router.get('/countries/create' , countryController.create);
router.post('/countries/create' , countryValidator.handle() , countryController.store );
router.get('/countries/:id/edit' , countryController.edit);
router.put('/countries/:id' , countryValidator.handle() , countryController.update );
router.delete('/countries/:id' , countryController.destroy);

// Device Routes
router.get('/devices' , deviceController.index);
router.get('/devices/create' , deviceController.create);
router.post('/devices/create' , deviceValidator.handle() , deviceController.store );
router.get('/devices/:id/edit' , deviceController.edit);
router.put('/devices/:id' , deviceValidator.handle() , deviceController.update );
router.delete('/devices/:id' , deviceController.destroy);

// contacts
router.get('/contacts', contactController.index);

// contacts
router.get('/availables', availableController.index);
router.delete('/availables/:id', availableController.destroy);
// Logo Routes
router.get('/logo' , logoController.index);
router.get('/logo/create' , logoController.create);
router.post('/logo/create' ,
    logoValidator.handle() ,
    logoController.store 
);
router.get('/logo/:id/edit' , logoController.edit);
router.put('/logo/:id',
    logoValidator.handle() ,
    logoController.update 
);
router.delete('/logo/:id' , logoController.destroy);

// Slider Routes
router.get('/sliders' , sliderController.index);
router.get('/sliders/create' , sliderController.create);
router.post('/sliders/create' , sliderValidator.handle() , sliderController.store);
router.get('/sliders/:id/edit' , sliderController.edit); 
router.put('/sliders/:id',
    sliderValidator.handle() ,    
    sliderController.update
); 
router.delete('/sliders/:id' , sliderController.destroy);

//Response Routes
router.get('/response' , responseController.index);
router.get('/response/create' , responseController.create);
router.post('/response/create', responseValidator.handle(), responseController.store);
router.get('/response/:id/edit', responseController.edit);
router.put('/response/:id',  
    responseValidator.handle(),    
    responseController.update
);
router.delete('/response/:id' ,responseController.destroy);

//coupon_text
router.get('/coupon_text' , couponController.index);
router.get('/coupon_text/create' , couponController.create);
router.post('/coupon_text/create', couponValidator.handle(), couponController.store);
router.get('/coupon_text/:id/edit', couponController.edit);
router.put('/coupon_text/:id',  
    couponValidator.handle(),    
    couponController.update
);
router.delete('/coupon_text/:id' ,couponController.destroy);


//Users Routes
router.get('/users' , userController.index);
router.delete('/users/:id' , userController.destroy);
router.get('/users/:id/toggleadmin' , userController.toggleadmin);

//userAddress
router.get('/userAddress' , userAddressController.index); 

//shoppingList
router.get('/shoppings' , shoppingController.index); 
router.get('/shoppings/:id/title' , shoppingController.title); 
router.get('/shoppings/:id/address' , shoppingController.address);

// Message Admin
router.get('/messages' , messageController.index);
router.get('/messages/create' , messageController.create);
router.post('/messages/create', messageValidator.handle(), messageController.store);
router.get('/messages/:id/edit', messageController.edit);
router.put('/messages/:id',  
    messageValidator.handle(),    
    messageController.update
);
router.delete('/messages/:id' ,messageController.destroy);

// Vendors
router.get('/vendors' , vendorController.index); 

router.post('/upload-image' , upload.single('upload') , adminController.uploadImage);

module.exports = router;