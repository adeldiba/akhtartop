const validator = require('./validator');
const { check } = require('express-validator/check');

class vipHomeValidator extends validator {
    
    handle() {
        return [
            check('vips')
                .isLength({ min : 8 })
                .withMessage('کد ویژه وارد شده اشتباه است'),
        ]
    }
}

module.exports = new vipHomeValidator();