const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');

//render interviw page
router.get('/add-interview',interviewController.addInterview);

//new interview
router.post('/create',interviewController.create);

//add new student to interview
router.post('/enroll-in-interview/:id',interviewController.enrollInterview);

//remove student from interview
router.get('/deallocate/:studentId/:interviewId',interviewController.deallocate);

module.exports = router;