const controller = require('app/http/controllers/controller');
const RealPerson = require('app/models/realPerson');
const LegalPerson = require('app/models/legalPerson');


class vendorController extends controller { 
    async index(req , res, next) {
        try {
            //let panels = await Profile.find({user : req.user.id});
            let page = req.query.page || 1;
            let realPersons = await RealPerson.paginate({} , { page , sort : { createdAt : -1 } , limit : 20, populate:('user') });
            let legalPersons = await LegalPerson.paginate({} , { page , sort : { createdAt : -1 } , limit : 20, populate:('user') });
            //return res.json(profiles);
            res.render('admin/vendors/index',  { title : 'مرکز فروشندگان' ,realPersons,legalPersons});
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new vendorController();
