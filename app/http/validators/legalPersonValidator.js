const validator = require('./validator');
const { check } = require('express-validator/check');
const Panel = require('app/models/panel');
const path = require('path');

class legalPersonValidator extends validator {
    
    handle() {
        return [
            check('company_name')
                .not().isEmpty()
                .withMessage('لطفا نام شرکت خود را وارد کنید'),
            check('company_type')
                .not().isEmpty()
                .withMessage('لطفا نوع شرکت خود را وارد کنید'), 
            check('register_number')
                .not().isEmpty()
                .withMessage('لطفا شماره ثبت را وارد کنید'),   
            check('national_ID')
                .not().isEmpty()
                .withMessage('لطفا شناسه ملی را وارد کنید'),  
            check('economic_code')
                .not().isEmpty()
                .withMessage('لطفا کد اقتصادی خود را وارد کنید'), 
            check('holders_sign')
                .not().isEmpty()
                .withMessage('لطفا فیلد صاحبان حق امظاء را به درستی پر کنید'),   
            check('stateP')
                .not().isEmpty()
                .withMessage('لطفا استان مورد نظر خود را انتخاب کنید'),   
            check('cityP')
                .not().isEmpty()
                .withMessage('لطفا شهر خود را انتخاب کنید'),
            check('addressP')
                .not().isEmpty()
                .withMessage('لطفا آدرس خود را وارد کنید'),
            check('postal_codeP')
                .isLength({min : 10})
                .withMessage('کد پستی وارد شده نامعتبر است'),
            check('locationP')
                .not().isEmpty()
                .withMessage('لطفا موقعیت مکانی خود را وارد کنید'),
            check('phoneP')
                .isLength({min : 11})
                .withMessage('شماره موبایل وارد شده معتبر نیست'),
            check('telphoneP')
                .isLength({min : 11})
                .withMessage('شماره تلفن ثابت وارد شده معتبر نیست'),
            check('store_name')
                .not().isEmpty()
                .withMessage('لطفا نام فروشگاه خود را وارد کنید'),
            check('Shaba_number')
                .not().isEmpty()
                .withMessage('لطفا شماره شبا را به درستی وارد کنید'),
            check('kala')
                .not().isEmpty()
                .withMessage('لطفا نام کالای خود را وارد کنید'),
            check('variety')
                .not().isEmpty()
                .withMessage('لطفا تعداد تنوع محصول خود را وارد کنید')

        ]
    }

    slug(title){
        return title.replace(/([^آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new legalPersonValidator();