const controller = require('app/http/controllers/controller');
const User = require('app/models/user');
const middleware = require('./middleware');

class redirectIfAuthenticated extends middleware {
    
    handle(req , res ,next) {
        if(req.isAuthenticated())
            
         res.redirect('/')
    
        next();
    }


}


module.exports = new redirectIfAuthenticated();