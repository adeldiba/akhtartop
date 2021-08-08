const controller = require('app/http/controllers/controller');
const Message = require('app/models/message');


class messageController extends controller {
    async index(req , res, next) {
        try{
            let messages = await Message.find({});
            res.render('admin/messages/index',  { title : 'پیغام به کاربران وبسایت', messages});
    
        }catch(err){
            next(err);
        }
    }

   async create(req , res) {
        res.render('admin/messages/create'); 
    }
    
    async store(req, res, next) {
        try{
            let status = await this.validationData(req); 
            if(! status){
                return this.back(req,res);
            }
           
            let {title, body, lang} = req.body;
    
            let newmessage = new Message({
                title,
                slug: this.slug(title),
                body,
                lang
            });
            await newmessage.save();
            return res.redirect('/admin/messages');
        }catch(err){
            next(err);
        }
       
    }

    async edit(req, res ,next) {
        try{
            this.isMongoId(req.params.id);
            let message = await Message.findById(req.params.id);
            if( ! message ) {
                
                this.error('چنین پیغامی وجود ندارد', 404);
            }

            return res.render('admin/messages/edit' , { message });
    
        }catch(err){
            next(err);
        }
    }

    async update(req, res , next) {
        try{
            let status = await this.validationData(req);
            if(! status) {
                return this.back(req,res);
            }
            
            await Message.findByIdAndUpdate(req.params.id , { $set : { ...req.body}})
            return res.redirect('/admin/messages');
        }catch(err){
            next(err);
        }
    
    }
    async destroy(req , res  , next) {
        try {
            this.isMongoId(req.params.id);

            let message = await Message.findById(req.params.id).populate().exec();
            if( ! message ) this.error('چنین پیغامی وجود ندارد' , 404);

            // delete messages
            message.remove();

            return res.redirect('/admin/messages');
        } catch (err) {
            next(err);
        }
    }
    getUrlImage(dir) {
        return dir.substring(8);
    }
}

module.exports = new messageController();