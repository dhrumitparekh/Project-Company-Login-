const EmployeeData = require("../data/Employers.json");
const jobData = require("../data/JobTitle.json");
const DepartmentData = require("../Data/Department.json");
let Employees =[];

function Initialize(){
    return new Promise((accepted,rejected)=>
    {
    EmployeeData.forEach((Employeers)=>
    {
        const DepID = Employeers.department;
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
        const dep= DepartmentData.find((name)=>name.id === DepID)
        if (dep)
        {
          Employeers.department = dep.Department;
        }
        else
        {
         Employeers.department = "Not Valid";
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

  function getEmployeeByNum(EmployeeNumber)
  {
    return new Promise((accepted,rejected) => {
      const SelectedEmployee = Employees.find((EmployeeNum)=> EmployeeNum.id === EmployeeNumber)
      if(!SelectedEmployee)
      {
        rejected("Unable to find the employee");
      }
      else{
        accepted(SelectedEmployee);
      }
    });
  }

  function getEmployeeByExp(EmployeeExp)
  {
    return new Promise((accepted,rejected) => {
      const SelectedEmployee = Employees.find((EmployeeNum)=> EmployeeNum.years_of_experience === EmployeeExp)
      if(!SelectedEmployee)
      {
        rejected("Unable to find the employee");
      }
      else{
        accepted(SelectedEmployee);
      }
    });
  }
  
module.exports={Initialize,getAllEmployees,getEmployeeByNum,getEmployeeByExp};
