const downloadCsv = require('download-csv');
const Student = require('../models/student');

module.exports.downloadCsv = async function(req,res){

    try{
        const students = await Student.find({});

        let columns = {
            student_ID: 'Student ID',
            student_Name:'Name',
            student_College:'College',
            student_Email: 'Email',
            student_Batch: 'Batch',
            student_Placement_Status:'Placement Status',
            student_DSA_Score:'DSA Score',
            student_Webd_Score:'WebD Score',
            student_React_Score:'React Score',
            interview_Date:'Interview Date',
            interview_Company:'Interview Company',
            interview_Result:'Interview Result'
        }

        let datas=[];

        let studObj = {};

        for (let student of students) {
            studObj.student_ID = student.id ;
            studObj.student_Name = student.name;
            studObj.student_College = student.college;
            studObj.student_Email = student.email;
            studObj.student_Batch = student.batch;
            studObj.student_Placement_Status = student.placed;
            studObj.student_DSA_Score = student.dsaScore;
            studObj.student_Webd_Score = student.webdScore;
            studObj.student_React_Score = student.reactScore;

            if(student.interviews.length>0){
                for(let interview of student.interviews){
                    studObj.interview_Date = student.interviews.date.toString();
                    studObj.interview_Company = student.interviews.company;
                    studObj.interview_Result = student.interviews.result;
                }
            }

            datas.push(studObj);
              
        }
          
        return downloadCsv(datas, columns, 'studentData.csv');
    }

    catch(e){
        console.log(`Error in generating csv file: ${e}`);
        return res.redirect('back');
    }
}
