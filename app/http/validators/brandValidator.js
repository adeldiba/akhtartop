const validator = require('./validator');
const { check } = require('express-validator/check');
const Brand = require('app/models/brand');

class brandValidator extends validator {
    
    handle() {
        return [
            check('name')
                .isLength({ min : 3 })
                .withMessage('عنوان نمیتواند کمتر از 3 کاراکتر باشد')
                .custom(async (value , { req }) => {
                    if(req.query._method === 'put') {
                        let brand = await Brand.findById(req.params.id);
                        if(brand.slug === value) return;
                    }
                    
                    let brand = await Brand.findOne({ slug : this.slug(value) });
                    if(brand) {
                        throw new Error('چنین برندی با این عنوان قبلا در سایت قرار داد شده است')
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

module.exports = new brandValidator();