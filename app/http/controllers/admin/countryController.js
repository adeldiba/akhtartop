const controller = require('app/http/controllers/controller');
const Country = require('app/models/country');

class deviceController extends controller {
    async index(req , res) {
        try {
            let page = req.query.page || 1;
            let countries = await Country.paginate({} , { page , sort : { createdAt : 1 } , limit : 20 , populate : 'parent' });

            res.render('admin/countries/index',  { title : 'کشور سازنده' , countries });
        } catch (err) {
            next(err);
        }
    }

    async create(req , res) {
        let countries = await Country.find({ parent : null });
        res.render('admin/countries/create' , { countries });        
    }

    async store(req , res , next) {
        
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);
        
            let { name , parent, lang } = req.body;

            let newCountry = new Country({ 
                name,
                slug : this.slug(name),
                lang,
                parent : parent !== 'none' ? parent : null
             });

            await newCountry.save();

            return res.redirect('/admin/countries');    
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);

            let country = await Country.findById(req.params.id);
            let countries = await Country.find({ parent : null });
            if( ! country ) this.error('چنین کشوری وجود ندارد' , 404);

            return res.render('admin/countries/edit' , { country , countries });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);

            let { name , parent,lang } = req.body;
            
            await Country.findByIdAndUpdate(req.params.id , { $set : { 
                name,
                slug : this.slug(name),
                parent : parent !== 'none' ? parent : null,
                lang
             }})

            return res.redirect('/admin/countries');
        } catch(err) {
            next(err);
        }
    }

    async destroy(req , res , next) {
        try {
            this.isMongoId(req.params.id);

            let country = await Country.findById(req.params.id).populate('childs').exec();
            if( ! country ) this.error('چنین کشوری وجود ندارد' , 404);

            country.childs.forEach(country => country.remove() );

            // delete country
            country.remove();

            return res.redirect('/admin/countries');
        } catch (err) {
            next(err);
        }
    }
    slug(title){
        return title.replace(/([^آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new deviceController();