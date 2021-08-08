const validator = require('./validator');
const { check } = require('express-validator/check');
const Engine = require('app/models/engine');
const path = require('path');

class episodeValidator extends validator {
    
    handle() {
        return [
            check('discount')
            .not().isEmpty()
                .withMessage('افزودن درصد تخفیف به محصول نباید خالی باشد'),

            check('notPrice')
                .not().isEmpty()
                .withMessage('قیمت قبلی محصول نمیتواند خالی بماند'),

            check('engine')
                .not().isEmpty()
                .withMessage('فیلد محصولی که قرار است قیمت تخفیف به آن اعمال شود نمیتواند خالی بماند'),
        ]
    }

    
    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new episodeValidator();