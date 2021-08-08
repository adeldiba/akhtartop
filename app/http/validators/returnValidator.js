const validator = require('./validator');
const { check } = require('express-validator/check');
const path = require('path');
const Return_p = require('app/models/return_p');

class returnValidator extends validator {
    
    handle() {
        return [
            check('title')
                .isLength({min : 3})
                .withMessage('فیلد عنوان نباید کمتر از چهار کاراکتر باشد')
                .custom(async (value, { req }) =>{
                    if(req.query._method === 'put') {
                        let return_p = await Return_p.findById(req.params.id);
                        if(return_p.title === value) return;
                    }
                }),
            check('body')
                .isLength({min : 10})
                .withMessage('متن محصول نمیتواند کمتر از 10 کاراکتر باشد'),
        ]
    }

    slug(title){
        return title.replace(/([^آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new returnValidator();