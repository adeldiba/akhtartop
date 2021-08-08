const autoBind = require('auto-bind');
const Recaptcha = require('express-recaptcha').RecaptchaV2;
const { validationResult } = require('express-validator/check');
const isMongoId = require('validator/lib/isMongoId');


module.exports = class controller {
    constructor() {
        autoBind(this);
        this.recaptchaConfig();
    }

    recaptchaConfig() {
        this.recaptcha = new Recaptcha(
            config.service.recaptcha.clinet_key,
            config.service.recaptcha.secret_key , 
            {...config.service.recaptcha.options} 
        );
    }

    recaptchaValidation(req , res) {
        return new Promise((resolve , reject) => {
            this.recaptcha.verify(req , (err , data) => {
                if(err) {
                    req.flash('errors' , 'گزینه امنیتی مربوط به شناسایی روبات خاموش است، لطفا از فعال بودن آن اطمینان حاصل نمایید و مجدد امتحان کنید');
                    this.back(req,res)
                } else resolve(true);
            })
        })
    }

    async validationData(req) {
        const result = validationResult(req);
        if (! result.isEmpty()) {
            const errors = result.array();
            const messages = [];
           
            errors.forEach(err => messages.push(err.msg));

            req.flash('errors' , messages)

            return false;
        }

        return true;
    }

    back(req , res) {
        req.flash('formData', req.body);
        return res.redirect(req.header('Referer') || '/');
    }

    isMongoId(paramId) {
        if(! isMongoId(paramId))
            this.error('ای دی وارد شده صحیح نیست', 404);
    }

    error(message , status = 500) {
        let err = new Error(message);
        err.status = status;
        throw err;
    }

    slug(title){
        return title.replace(/([^آ-یa-z0-9]|-)+/g , "-")
    }

    alert(req , data) {
        let title = data.title || '',
            message = data.message || '',
            icon = data.icon || 'warning',
            button = data.button || null,
            timer = data.timer || 2000;

        req.flash('sweetalert' , { title , message , icon , button , timer});
    }

    alertAndBack(req, res , data) {
        this.alert(req , data);
        this.back(req , res);
    }

}