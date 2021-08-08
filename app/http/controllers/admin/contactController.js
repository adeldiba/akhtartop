const controller = require('app/http/controllers/controller');
const Contact = require('app/models/contact');

class contactController extends controller {
    
    async index(req , res , next) {
        try {
            let title = "پیام کاربران";

            let contacts = await Contact.paginate({} , { sort : { createdAt : 1 } , limit : 20 });
                res.render("admin/contacts", {
                    title,
                    contacts 
                });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new contactController();