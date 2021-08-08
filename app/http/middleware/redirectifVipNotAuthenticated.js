const Vip = require('app/models/vip');
const middleware = require('./middleware');

class redirectifVipNotAuthenticated extends middleware {
    
   async handle(req , res ,next) {
            
    if(req.isAuthenticated()){
        const vip = await Vip.findOneAndUpdate({
            user: req.user.id
        });
        if (vip){
            return next();
        }
        return res.redirect('/vip') 
    }else{   
        return res.redirect('/vip/check');    
    }   
    } 
}
module.exports = new redirectifVipNotAuthenticated();