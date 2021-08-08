const controller = require('app/http/controllers/controller');
const Slider = require('app/models/slider');
const fs = require('fs');
const { isEmpty, uploadDir } = require('app/helpers/upload-helper');

class sliderController extends controller {
    async index(req , res, next) {
        try {
            let page = req.query.page || 1;
            let sliders = await Slider.paginate({} , { page , sort : { createdAt : 1 } , limit : 10 });
            res.render('admin/sliders/index',  { title : 'اسلایدر صفحه' , sliders });
        } catch (err) {
            next(err);
        }
    }

    async create(req , res, next) {
        return res.render('admin/sliders/create');            
    }

    async store(req , res, next) {
        
        let status = await this.validationData(req);
        if(! status) {
            if(req.file) 
                fs.unlinkSync(req.file.path);
            return this.back(req,res);
        }
        // create slider
        let filename = 'http://via.placeholder.com/640x360';

        if(!isEmpty(req.files)){
            let file = req.files.file;
             filename = Date.now() + '-' + file.name;
            
            file.mv('./public/uploads/' + filename, function(err){
                if(err) throw err;
        });
        }
        let { body} = req.body;

        let newSlider = new Slider({
            body,
            file: filename
        });

        await newSlider.save();
        return res.redirect('/admin/sliders');     
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);
            let slider = await Slider.findById(req.params.id);
            if( ! slider ) this.error('چنین اسلایدری وجود ندارد' , 404);

            return res.render('admin/sliders/edit' , { slider});
        } catch (err) {
            next(err);
        }
    }

    async update(req, res , next) {
        try {
            let status = await this.validationData(req);
        if(! status) {
            if(req.file) 
                fs.unlinkSync(req.file.path);
            return this.back(req,res);
        }

        await Slider.findOne({_id: req.params.id})
                .then(function(slider){
                
                    let { body} = req.body;
                    slider.body = body;

                let filename = 'http://via.placeholder.com/640x360';    
                if(!isEmpty(req.files)){
                    let file = req.files.file;
                    filename = Date.now() + '-' + file.name;
                    slider.file = filename;
            
                    file.mv('./public/uploads/' + filename, function(err){
                        if(err) throw err;
                });
                }
                
                slider.save().then(function(updatedslider){
                    return res.redirect('/admin/sliders');
                });
            });    
        
        } catch (err) {
            next(err);
        }
        
    }

    async destroy(req , res, next) {
        try {
            this.isMongoId(req.params.id);
            await Slider.findOne({_id: req.params.id}).then(function (slider){
                if( ! slider ) this.error('چنین محصولی وجود ندارد' , 404);
                
                // delete Images
                fs.unlink(uploadDir + slider.file,(err)=>{
                    // delete slider
                    slider.remove().then(sliderRemoved=>{
                        return res.redirect('/admin/sliders');
                    });
                    
                }); 

            });       
        } catch (err) {
            next(err)
        }        
    }
    getUrlImage(dir) {
        return dir.substring(8);
    }

}

module.exports = new sliderController();