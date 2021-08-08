const validator = require('./validator');
const { check } = require('express-validator/check');
const Device = require('app/models/device');

class deviceValidator extends validator {
    
    handle() {
        return [
            check('name')
                .isLength({ min : 3 })
                .withMessage('عنوان نمیتواند کمتر از 3 کاراکتر باشد')
                .custom(async (value , { req }) => {
                    if(req.query._method === 'put') {
                        let device = await Device.findById(req.params.id);
                        if(device.slug === value) return;
                    }
                    
                    let device = await Device.findOne({ slug : this.slug(value) });
                    if(device) {
                        throw new Error('چنین دسته ای با این عنوان قبلا در سایت قرار داد شده است')
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

module.exports = new deviceValidator();