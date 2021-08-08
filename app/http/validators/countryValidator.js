const validator = require('./validator');
const { check } = require('express-validator/check');
const Country = require('app/models/country');

class countryValidator extends validator {
    
    handle() {
        return [
            check('name')
                .isLength({ min : 3 })
                .withMessage('عنوان نمیتواند کمتر از 3 کاراکتر باشد')
                .custom(async (value , { req }) => {
                    if(req.query._method === 'put') {
                        let country = await Country.findById(req.params.id);
                        if(country.slug === value) return;
                    }
                    
                    let country = await Country.findOne({ slug : this.slug(value) });
                    if(country) {
                        throw new Error('چنین کشوری با این عنوان قبلا در سایت قرار داد شده است')
                    }
                }),
            check('parent')
                .not().isEmpty()
                .withMessage('فیلد پدر دسته نمیتواند خالی بماند')
        ]
    }
    slug(title){
        return title.replace(/([^آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new countryValidator();