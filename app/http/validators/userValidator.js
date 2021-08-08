const validator = require('./validator');
const { check } = require('express-validator/check');
const Panel = require('app/models/panel');
const path = require('path');

class userValidator extends validator {
    
    handle() {
        return [
            check('name')
                .isLength({min : 3})
                .withMessage('نام شما نباید کمتر از سه کاراکتر باشد'),
                check('name_family')
                .isLength({min : 3})
                .withMessage('نام خانوادگی شما نباید کمتر از سه کاراکتر باشد'),
            check('birth_year')
                .not().isEmpty()
                .withMessage('لطفا سال تولد خود را مشخص کنید'),
            check('birth_month')
                .not().isEmpty()
                .withMessage('لطفا ماه تولد خود را مشخص کنید'),
            check('birth_day')
                .not().isEmpty()
                .withMessage('لطفا روز تولد خود را مشخص کنید'),
            check('certificate')
                .not().isEmpty()
                .withMessage('لطفا شماره شناسنامه خود را وارد کنید'),
            check('codeM')
                .not().isEmpty()
                .withMessage('لطفا کد ملی خود را وارد کنید'),   
            
            check('state')
                .not().isEmpty()
                .withMessage('لطفا استان مورد نظر خود را انتخاب کنید'),
            check('location')
                .not().isEmpty()
                .withMessage('لطفا موقعیت مکانی خود را وارد کنید'),
            check('city')
                .not().isEmpty()
                .withMessage('لطفا شهر خود را انتخاب کنید'),
            check('address')
                .not().isEmpty()
                .withMessage('لطفا آدرس خود را وارد کنید'),
            check('postal_code')
            .isLength({min : 10})
                .withMessage('کد پستی وارد شده نامعتبر است'),

        ]
    }

    slug(title){
        return title.replace(/([^آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new userValidator();