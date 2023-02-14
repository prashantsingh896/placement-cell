const Student = require('../models/student');
const ExportToCsv = require('export-to-csv').ExportToCsv;
const fs = require('fs');

module.exports.downloadCsv = async function(req,res){

    try{
        const students = await Student.find({});

        let datas=[];

        

        for (const student of students) {
            let studObj = {};
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
                    studObj.interview_Date = interview.date;
                    studObj.interview_Company = interview.company;
                    studObj.interview_Result = interview.result;
                }
            }
            else{
                studObj.interview_Date = "NA"
                studObj.interview_Company = "NA"
                studObj.interview_Result = "NA"
            }
            

            datas.push(studObj);
              
        }

        const options = { 
            fieldSeparator: ",",
            quoteStrings: '"',
            decimalSeparator: ".",
            showLabels: true, 
            showTitle: false,
            title: "My Awesome CSV",
            useTextFile: false,
            useBom: true,
            useKeysAsHeaders: true,
          };

        const csvExporter = new ExportToCsv(options);
        const csvData = csvExporter.generateCsv(datas, true);
        fs.writeFileSync('data.csv',csvData);
        return res.download('data.csv');
    }

    catch(e){
        console.log(`Error in generating csv file: ${e}`);
        return res.redirect('back');
    }
}
