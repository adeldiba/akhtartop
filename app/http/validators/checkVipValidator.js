const validator = require('./validator');
const { check } = require('express-validator/check');
const Check = require('app/models/check');
const path = require('path');

class checkVipValidator extends validator {
    handle() {
        return [
            check('images')
            .custom(async (value, { req }) =>{
                if(req.query._method === 'put' && value === undefined) return;

                if(! value)
                    throw new Error('وارد کردن تصویر الزامی است');
                let fileExt = ['.png', '.jpg', '.jpeg', '.svg'];
                if(! fileExt.includes(path.extname(value)))
                    throw new Error('پسوند فایل وارد شده از پسوندهای تصاویر نیست')
            }),

        ]
    }
}

module.exports = new checkVipValidator();