const express = require('express');
const passport = require('passport');
const dashboardController = require('../controllers/dashboardController');
const reportController = require('../controllers/csvController');
const userController = require('../controllers/userController');
const router = express.Router();

//home
router.get('/',userController.signIn);

//profile page handler
router.get('/profile', userController.profile);

//update profile
router.post('/update',userController.updateUser);

//dashboard
router.get('/dashboard',dashboardController.dashboard);

//signUp page
router.get('/sign-up',userController.signUp);

// creating new user
router.post('/create',userController.create);

//check with passport before creating session
router.post('/create-session', passport.authenticate('local',{failureRedirect:'/'}),userController.createSession);

//signOut
router.get('/sign-out',userController.destroySession);

//router for CSV
router.get('/download',reportController.downloadCsv); 

module.exports = router;



