const controller = require('app/http/controllers/controller');
const Brand = require('app/models/brand');


class deviceController extends controller {
    async index(req , res) {
        try {
            let page = req.query.page || 1;
            let brands = await Brand.paginate({} , { page , sort : { createdAt : 1 } , limit : 20 , populate : 'parent' });

            res.render('admin/brands/index',  { title : 'برند' , brands });
        } catch (err) {
            next(err);
        }
    }

    async create(req , res) {
        let brands = await Brand.find({ parent : null });
        res.render('admin/brands/create' , { brands });        
    }

    async store(req , res , next) {
        
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);
        
            let { name , parent, lang } = req.body;

            let newBrand = new Brand({ 
                name,
                slug : this.slug(name),
                lang,
                parent : parent !== 'none' ? parent : null
             });

            await newBrand.save();

            return res.redirect('/admin/brands');    
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);

            let brand = await Brand.findById(req.params.id);
            let brands = await Brand.find({ parent : null });
            if( ! brand ) this.error('چنین برندی وجود ندارد' , 404);

            return res.render('admin/brands/edit' , { brand , brands });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);

            let { name , parent, lang } = req.body;
            
            await Brand.findByIdAndUpdate(req.params.id , { $set : { 
                name,
                slug : this.slug(name),
                parent : parent !== 'none' ? parent : null,
                lang
             }})

            return res.redirect('/admin/brands');
        } catch(err) {
            next(err);
        }
    }

    async destroy(req , res , next) {
        try {
            this.isMongoId(req.params.id);

            let brand = await Brand.findById(req.params.id).populate('childs').exec();
            if( ! brand ) this.error('چنین برندی وجود ندارد' , 404);

            brand.childs.forEach(brand => brand.remove() );

            // delete brand
            brand.remove();

            return res.redirect('/admin/brands');
        } catch (err) {
            next(err);
        }
    }
    slug(title){
        return title.replace(/([^آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new deviceController();