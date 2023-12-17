const EmployeeData = require("../data/Employers.json");
const jobData = require("../data/JobTitle.json");
let Employees =[];

function Initialize(){
    return new Promise((accepted,rejected)=>
    {
    EmployeeData.forEach((Employeers)=>
    {
        const EmpID = Employeers.job_title;
        const job = jobData.find((Title)=> Title.id === EmpID );
        if(job)
        {
            Employeers.job_title =  job.Job_title ;
        }
        else
        {
           Employeers.job_title ="Not Defined";
        }

    });
    Employees = EmployeeData;
    accepted();
    });
}
function getAllEmployees() {
    return new Promise((accepted) => {
      accepted(Employees);
    });
  }
module.exports={Initialize,getAllEmployees};