const User = require('app/models/user');
const middleware = require('./middleware');

class redirectIfAuthenticated extends middleware {
    
    handle(req , res ,next) {
        if(req.isAuthenticated())
            return next();

            this.alert(req , {
                title : 'کاربر گرامی',
                message : 'شما عضو نیستید، لطفا از طریق فرم ورود اقدام به ورود نمایید.اگر در وبسایت ثبت نام نکرده اید از طریق فرم عضویت اقدام نمایید',
                icon : 'warning',
                button : 'بسیار خوب'
            });
        return res.redirect('/auth/login')       
    }
}

module.exports = new redirectIfAuthenticated();