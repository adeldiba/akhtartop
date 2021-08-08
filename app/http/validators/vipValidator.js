const validator = require('./validator');
const { check } = require('express-validator/check');

class vipValidator extends validator {
    
    handle() {
        return [
            check('password')
                .isLength({ min : 8 })
                .withMessage('فیلد کد ویژه نمیتواند کمتر از 8 کاراکتر باشد'),
        ]
    }
}

module.exports = new vipValidator();