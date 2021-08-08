const controller = require('app/http/controllers/controller');
const Logo = require('app/models/logo');
const fs = require('fs');
const { isEmpty, uploadDir } = require('app/helpers/upload-helper');

class logoController extends controller {
    async index(req , res, next) {
        try {
            let page = req.query.page || 1;
            let logo = await Logo.paginate({} , { page , sort : { createdAt : 1 } , limit : 10 });
            res.render('admin/logo/index',  { title : 'مشخصات وبسایت' , logo }); 
        } catch (err) {
            next(err);
        }
    }

    async create(req , res, next) {
        let logo = await Logo.find({});
    
        return res.render('admin/logo/create', {logo});            
    }

    async store(req , res, next) {
        
        let status = await this.validationData(req);
        if(! status) {
            if(req.file) 
                fs.unlinkSync(req.file.path);
            return this.back(req,res);
        }

        // create logo
        let filename = 'http://via.placeholder.com/640x360';

            if(!isEmpty(req.files)){
                let file = req.files.file;
                 filename = Date.now() + '-' + file.name;
                
                file.mv('./public/uploads/' + filename, function(err){
                    if(err) throw err;
            });
            }
        
        let { email,phone, body, address} = req.body;

        let newLogo = new Logo({
            email,
            phone,
            body,
            address,
            file: filename,
        });

        await newLogo.save();
        return res.redirect('/admin/logo');     
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);
            let logo = await Logo.findById(req.params.id);
            if( ! logo ) this.error('چنین مشخصاتی وجود ندارد' , 404);

            return res.render('admin/logo/edit' , { logo});
        } catch (err) {
            next(err);
        }
    }

    async update(req, res , next) {
        try{
            let status = await this.validationData(req);
            if(! status) {
                if(req.file) 
                    fs.unlinkSync(req.file.path);
                return this.back(req,res);
            }

            await Logo.findOne({_id: req.params.id})
                .then(function(logo){
                
                    let { email,phone, body} = req.body;
                    logo.email = email;
                    logo.phone = phone;
                    logo.body = body;

                let filename = 'http://via.placeholder.com/640x360';    
                if(!isEmpty(req.files)){
                    let file = req.files.file;
                    filename = Date.now() + '-' + file.name;
                    logo.file = filename;
            
                    file.mv('./public/uploads/' + filename, function(err){
                        if(err) throw err;
                });
                }
                
                logo.save().then(function(updatedPost){
                    req.flash('success_message', 'Post was successfully updated');
                    return res.redirect('/admin/logo');
                });
            });    
        }catch(err){
            next(err);
        }
        
    }

    async destroy(req , res, next) { 
        try {
            this.isMongoId(req.params.id);
            await Logo.findOne({_id: req.params.id}).then(function (logo){
                if( ! logo ) this.error('چنین محصولی وجود ندارد' , 404);
                
                // delete Images
                fs.unlink(uploadDir + logo.file,(err)=>{
                    // delete logo
                    logo.remove().then(logoRemoved=>{
                        return res.redirect('/admin/logo');
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

module.exports = new logoController();