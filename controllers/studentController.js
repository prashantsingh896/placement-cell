const Interview = require("../models/interview");
const Student = require("../models/student");

// render add student page
module.exports.addStudent = (req, res) => {
  if (req.isAuthenticated()) {
    return res.render("add_student", {
      title: "Add Student",
    });
  }
  return res.redirect("/");
};

// render edit student page
module.exports.editStudent = async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (req.isAuthenticated()) {
    return res.render("edit_student", {
      title: "Edit Student",
      student_details: student,
    });
  }

  return res.redirect("/");
};

// creating a new Student
module.exports.create = async (req, res) => {
  try {
    const {
      name,
      email,
      batch,
      college,
      placementStatus,
      dsa_score,
      react_score,
      webdev_score,
    } = req.body;

    // check if student already exist
    Student.findOne({ email }, async (err, student) => {
      if (err) {
        console.log("error in finding student");
        return;
      }

      if (!student) {
        await Student.create(
          {
            name:name,
            email:email,
            college:college,
            batch:batch,
            dsaScore:dsa_score,
            reactScore:react_score,
            webdScore:webdev_score,
            placed:placementStatus,
          },
          (err, student) => {
            if (err) {
              console.log('Student creation failed: ',err);
              return res.redirect("back");
            }
            console.log('Successfully created');
            return res.redirect("back");
          }
        );
      } else {
        console.log('Student already exist in the data base');
        return res.redirect("back");
      }
    });
  } catch (err) {
    console.log(err);
  }
};

// Deletion of student
module.exports.destroy = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);

    if (!student) {
      return;
    }

    const interviewsOfStudent = student.interviews;

    // delete student from interviews
    if (interviewsOfStudent.length > 0) {
      for (let interview of interviewsOfStudent) {
        await Interview.findOneAndUpdate(
          { company: interview.company },
          { $pull: { students: { student: studentId } } }
        );
      }
    }

    student.remove();
    
    return res.redirect("back");
  } catch (err) {
    console.log("error", err);
    return;
  }
};

// update student details
module.exports.update = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    const {
      name,
      college,
      batch,
      dsa_score,
      react_score,
      webdev_score,
      placementStatus,
    } = req.body;

    if (!student) {
      return res.redirect("back");
    }

    student.name = name;
    student.college = college;
    student.batch = batch;
    student.dsaScore = dsa_score;
    student.reactScore = react_score;
    student.webdScore = webdev_score;
    student.placed = placementStatus;

    student.save();
    return res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};
