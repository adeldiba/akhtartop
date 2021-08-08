const validator = require('./validator');
const { check } = require('express-validator/check');
const path = require('path');
const Article = require('app/models/article');

class articleValidator extends validator {
    
    handle() {
        return [
            check('title')
                .isLength({min : 3})
                .withMessage('فیلد عنوان نباید کمتر از چهار کاراکتر باشد')
                .custom(async (value, { req }) =>{
                    if(req.query._method === 'put') {
                        let article = await Article.findById(req.params.id);
                        if(article.title === value) return;
                    }
                }),
            check('body')
                .isLength({min : 10})
                .withMessage('متن محتوا نمیتواند کمتر از 10 کاراکتر باشد'),
        ]
    }

    slug(title){
        return title.replace(/([^آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new articleValidator();