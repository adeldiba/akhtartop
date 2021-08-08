const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const mongoose = require('mongoose');
//mongoose.set('debug', true);
const flash = require('connect-flash');
const passport = require('passport');
const Helpers = require('./helpers');
const methodOverride = require('method-override');
const i18n = require('i18n');
const upload = require('express-fileupload');

const rememberLogin = require('app/http/middleware/rememberLogin');

module.exports = class Application {
    constructor() {
        this.setupExpress(); 
        this.setMongoConnection(); 
        this.setConfig();
        this.setRouters();
    }

    setupExpress() {
        const server = http.createServer(app);
        server.listen(config.port , () => console.log(`Listening on port ${config.port}`));
    }

    setMongoConnection() {
        mongoose.Promise = global.Promise;
        mongoose.connect(config.database.url, {  useNewUrlParser: true,  useUnifiedTopology: true,useCreateIndex: true,useFindAndModify: false });
    }

    /**
     * Express Config
     */
    setConfig() {
        require('app/passport/passport-local');
 
        app.use(express.static(config.layout.public_dir));
        app.set('view engine', config.layout.view_engine);
        app.set('views' , config.layout.view_dir);
        app.use(config.layout.ejs.expressLayouts);
        app.set("layout extractScripts", config.layout.ejs.extractScripts);
        app.set("layout extractStyles", config.layout.ejs.extractStyles);
        app.set("layout" , config.layout.ejs.master);


        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended : true }));
        //Upload
        app.use(upload());
        app.use(methodOverride('_method'));
        app.use(validator());
        app.use(session({...config.session}));
        app.use(cookieParser(config.cookie_secretkey));
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(rememberLogin.handle);
        i18n.configure({
            locales:['tr', 'fa'],
            directory: config.layout.locales_directory,
            defaultLocale: 'fa',
            cookie : 'lang',
            objectNotation: true 
        });
        app.use(i18n.init);
        app.use((req , res , next) => {
            app.locals = new Helpers(req, res).getObjects();
            next();
        });
    }

    setRouters() {
        app.use(require('app/routes/api'));
        app.use(require('app/routes/web'));       
    }
}