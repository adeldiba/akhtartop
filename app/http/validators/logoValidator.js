const validator = require('./validator');
const { check } = require('express-validator/check');
const Logo = require('app/models/logo');
const path = require('path');

class logoValidator extends validator {
    
    handle() {
        return [
            check('email')
            .isLength({min : 6})
                .withMessage('فیلد ایمیل وبسایت نباید خالی باشد'),

            check('phone')
                .isLength({min : 11})
                .withMessage('فیلد شماره تلفن همراه معتبر نیست'),
            check('address')
                .not().isEmpty()
                .withMessage('لطفا آدرس خود را وارد کنید'),
                
            check('body')
                .isLength({min : 10})
                .withMessage('متن توضیح وبسایت نمیتواند کمتر از 10 کاراکتر باشد'),
        ]
    }

    slug(title){
        return title.replace(/([^آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new logoValidator();