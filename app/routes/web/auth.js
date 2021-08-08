const express = require('express');
const router = express.Router();


// Controllers
const loginController = require('app/http/controllers/auth/loginController');
const registerController = require('app/http/controllers/auth/registerController');
const forgotPasswordController = require('app/http/controllers/auth/forgotPasswordController');
const resetPasswordController = require('app/http/controllers/auth/resetPasswordController');

// Validators
const registerValidator = require('app/http/validators/registerValidator');
const loginValidator = require('app/http/validators/loginValidator');
const forgotPasswordValidator = require('app/http/validators/forgotPasswordValidator');
const resetPasswordValidator = require('app/http/validators/resetPasswordValidator');
//middleware
const activeUser = require('app/http/middleware/activeUser');

router.get('/login', loginController.showLoginForm);
router.post('/login', loginValidator.handle() ,loginController.loginProccess);

router.get('/password/reset' , forgotPasswordController.showForgotPassword);
router.post('/password/email' ,forgotPasswordValidator.handle(),activeUser.handle, forgotPasswordController.sendPasswordResetLink);

router.get('/password/reset/:token' , resetPasswordController.showResetPassword);
router.post('/password/reset' , resetPasswordValidator.handle() , resetPasswordController.resetPasswordProccess);

//router.get('/register', registerController.showRegisterForm);
router.get("/register/mobile", registerController.showMobileForm);
router.post("/register/mobile", registerController.sendSMS);
router.get("/register/validate", registerController.showValidateForm);
router.post("/register/validate", registerController.validate);
router.get("/register", registerController.showRegsitrationForm);
router.post('/register', registerValidator.handle() , registerController.registerProccess);


module.exports = router;