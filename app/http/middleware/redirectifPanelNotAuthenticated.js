const Panel = require('app/models/panel');
const middleware = require('./middleware');

class redirectifPanelNotAuthenticated extends middleware {
    
   async handle(req , res ,next) {
        if(req.isAuthenticated()){
            const panel = await Panel.findOne({
                user: req.user.id
            });
            if (panel){
                return next();
            }
            this.alert(req, {
                title : 'خریدار گرامی',
                message : 'لطفا جهت تکمیل خرید، حساب شخصی خود را کامل کنید',
                type : 'errore',
                button : 'خیلی خوب'
            });
            return res.redirect('/user/panel') 
        }else{   
            return res.redirect('/shopping');    
        }  
    } 
}
module.exports = new redirectifPanelNotAuthenticated();