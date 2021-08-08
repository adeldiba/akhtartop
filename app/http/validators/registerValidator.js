const validator = require('./validator');
const { check } = require('express-validator/check');

class registerValidator extends validator {
    
    handle() {
        return [
            check('name')
                .isLength({ min : 5 })
                .withMessage('فیلد نام و نام خانوادگی نمیتواند کمتر از 5 کاراکتر باشد'),

            check('phone')
                .not().isEmpty()
                .withMessage('لطفا شماره موبایل خود را به درستی وارد کنید.'), 

            check('email')
                .isEmail()
                .withMessage('خواهشمندیم یک آدرس ایمیل معتبر وارد کنید.'),

            check('password')
                .isLength({ min : 8 })
                .withMessage('فیلد پسورد نمیتواند کمتر از 8 کاراکتر باشد'),
        ]
    }
}

module.exports = new registerValidator();