const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

//render add student page
router.get('/add-student',studentController.addStudent);

//update student
router.post('/update/:id',studentController.update);

//render edit details page
router.get('/edit-student/:id',studentController.editStudent);

//add new student
router.post('/create',studentController.create);

//remove a student
router.get('/destroy/:studentId',studentController.destroy);

module.exports = router;