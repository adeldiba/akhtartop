const validator = require('./validator');
const { check } = require('express-validator/check');
const path = require('path');
const Response = require('app/models/response');

class responseValidator extends validator {
    
    handle() {
        return [
            check('title')
                .isLength({min : 3})
                .withMessage('فیلد عنوان نباید کمتر از چهار کاراکتر باشد')
                .custom(async (value, { req }) =>{
                    if(req.query._method === 'put') {
                        let response = await Response.findById(req.params.id);
                        if(response.title === value) return;
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

module.exports = new responseValidator();