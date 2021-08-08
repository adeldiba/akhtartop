const controller = require('app/http/controllers/controller');
const Device = require('app/models/device');

class deviceController extends controller {
    async index(req , res) {
        try {
            let page = req.query.page || 1;
            let devices = await Device.paginate({} , { page , sort : { createdAt : 1 } , limit : 20 , populate : 'parent' });

            res.render('admin/devices/index',  { title : 'دسته های نوع دستگاه' , devices });
        } catch (err) {
            next(err);
        }
    }

    async create(req , res) {
        let devices = await Device.find({ parent : null });
        res.render('admin/devices/create' , { devices });        
    }

    async store(req , res , next) {
        
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);
        
            let { name , parent, lang } = req.body;

            let newDevice = new Device({ 
                name,
                lang,
                slug : this.slug(name),
                parent : parent !== 'none' ? parent : null
             });

            await newDevice.save();

            return res.redirect('/admin/devices');     
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);

            let device = await Device.findById(req.params.id);
            let devices = await Device.find({ parent : null });
            if( ! device ) this.error('چنین دسته ای وجود ندارد' , 404);

            return res.render('admin/devices/edit' , { device , devices });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);

            let { name , lang, parent } = req.body;
            
            await Device.findByIdAndUpdate(req.params.id , { $set : { 
                name,
                lang,
                slug : this.slug(name),
                parent : parent !== 'none' ? parent : null
             }})

            return res.redirect('/admin/devices');
        } catch(err) {
            next(err);
        }
    }

    async destroy(req , res , next) {
        try {
            this.isMongoId(req.params.id);

            let device = await Device.findById(req.params.id).populate('childs').exec();
            if( ! device ) this.error('چنین دسته ای وجود ندارد' , 404);

            device.childs.forEach(device => device.remove() );

            // delete device
            device.remove();

            return res.redirect('/admin/devices');
        } catch (err) {
            next(err);
        }
    }
    slug(title){
        return title.replace(/([^آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new deviceController();