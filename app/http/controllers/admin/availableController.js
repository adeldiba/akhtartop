const controller = require('app/http/controllers/controller');
const Available = require('app/models/available');

class availableController extends controller {
    
    async index(req , res , next) {
        try {
            let title = "خبر دادن موجود بودن محصول";

            let availables = await Available.paginate({} , { sort : { createdAt : 1 } , limit : 20, populate :([
                {
                    path : 'user'
                       
                } ,
                {
                    path : 'engine'

                } 
                
            ])  });
            
                res.render("admin/availables", {
                    title,
                    availables 
                });
        } catch (err) {
            next(err);
        }
    }
    async destroy(req , res, next) {
        try {
            this.isMongoId(req.params.id);
            let available = await Available.findById(req.params.id).populate().exec(); 
            if( ! available ) this.error('چنین خبری وجود ندارد' , 404);

            // delete engines
            available.remove();

            return res.redirect('/admin/availables'); 
        } catch (err) {
            next(err)
        }        
    }
}

module.exports = new availableController();