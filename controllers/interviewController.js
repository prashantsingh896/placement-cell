const Interview = require('../models/interview');
const Student = require('../models/student');

//add interview page
module.exports.addInterview = (req,res) => {
    if(req.isAuthenticated()){
        return res.render('add_interview',{
            title:'Add an interview'
        });
    }
    return res.redirect('/');
};

//new interview
module.exports.create = async function(req,res){
    try{
        const {company,date} = req.body;

        await Interview.create({
            company,
            date
        },function(err,interview){
            if(err){
                console.log('Error in creating interview: ',err);
            }
            return res.redirect('back');
        });
    }
    catch(e){
        console.log('Error in creating interview: ',e);
    }
}

//add student in interview
module.exports.enrollInterview = async function(req,res){
    try{
        let interview = await Interview.findById(req.params.id);
        const {email, result} = req.body;

        if(interview){
            let student = await Student.findOne({email:email});
            if(student){
                //check if already enrolled
                let check = await Interview.findOne({
                    "students.student":student.id
                });

                //if already enrolled
                if(check){
                    if(check.company === interview.company){
                        req.flash(
                            'error',
                            `${student.name} already enrolled in ${interview.company}`
                        )
                        return res.redirect('back');
                    }
                }

                let studentObj = {
                    student: student.id,
                    result: result
                };

                await interview.updateOne({
                    $push:{students:studentObj}
                });

                // update interview
                let assignedInterview = {
                    company: interview.company,
                    date: interview.date,
                    result: result,
                };
                await student.updateOne({
                    $push: { interviews: assignedInterview },
                });

                console.log(
                    "success",
                    `${student.name} enrolled in ${interview.company} interview!`
                  );

                  return res.redirect("back");
            }

            return res.redirect('back');

        }
        return res.redirect('back');

    }
    catch(e){

        console.log(err," Error in enrolling");

    }
};

// removing student from interview
module.exports.deallocate = async function(req, res){
    try {
      const { studentId, interviewId } = req.params;
      const interview = await Interview.findById(interviewId);

      //find interview and pull out student from students array
      if(interview){
        await Interview.findOneAndUpdate(
          { _id: interviewId },
          { $pull: { students: { student: studentId } } }
        );
  
        // similarly update the student by removing company from interviews array
        await Student.findOneAndUpdate(
          { _id: studentId },
          { $pull: { interviews: { company: interview.company } } }
        );

        return res.redirect("back");
      }
      return res.redirect("back");
    } catch (err) {
      console.log(err," Error in removing unenrolling student");
    }
  };