const validator = require('./validator');
const { check } = require('express-validator/check');
const Panel = require('app/models/panel');
const path = require('path');

class realPersonValidator extends validator {
    
    handle() {
        return [
            check('nameP')
                .isLength({min : 3})
                .withMessage('نام شما نباید کمتر از سه کاراکتر باشد'),
                check('nameP_family')
                .isLength({min : 3})
                .withMessage('نام خانوادگی شما نباید کمتر از سه کاراکتر باشد'),
            check('birth_yearP')
                .not().isEmpty()
                .withMessage('لطفا سال تولد خود را مشخص کنید'),
            check('birth_monthP')
                .not().isEmpty()
                .withMessage('لطفا ماه تولد خود را مشخص کنید'),
            check('birth_dayP')
                .not().isEmpty()
                .withMessage('لطفا روز تولد خود را مشخص کنید'),
            check('certificateP')
                .not().isEmpty()
                .withMessage('لطفا شماره شناسنامه خود را وارد کنید'),
            check('codeMP')
                .not().isEmpty()
                .withMessage('لطفا کد ملی خود را وارد کنید'),   
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

module.exports = new realPersonValidator();