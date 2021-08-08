const validator = require('./validator');
const { check } = require('express-validator/check');

class contactValidator extends validator {
    
    handle() {
        return [
            check('name')
                .isLength({ min : 4 })
                .withMessage('فیلد نام و نام خانوادگی نمیتواند کمتر از 4 کاراکتر باشد'),

            check('phone')
                .not().isEmpty()
                .withMessage('لطفا شماره موبایل خود را به درستی وارد کنید.'), 

            check('email')
                .isEmail()
                .withMessage('خواهشمندیم یک آدرس ایمیل معتبر وارد کنید.'),

            check('body')
                .isLength({ min : 10 })
                .withMessage('متن دیدگاه شما نمیتواند کمتر از 10 کاراکتر باشد'),
        ]
    }
}

module.exports = new contactValidator();