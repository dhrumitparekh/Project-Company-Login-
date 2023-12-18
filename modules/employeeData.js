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
    return new Promise((accepted,rejected) => 
    {
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
    return new Promise((accepted,rejected) => 
    {
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

  function getEmployeeByDep (Dep)
  {
    return new Promise ((accepted,rejected)=>
    {
      const depInLowerCase = Dep.toLowerCase();
      const commonDep =Employees.filter((Departments)=>
      {
      const selectedEmp = Departments.department.toLowerCase();
      return selectedEmp.includes(depInLowerCase);
    });
    if(commonDep <= 0)
    {
      rejected("Unable to get the Department");
    }
    else
    {
      accepted(commonDep);
    }

   });
  }  

  function getEmployeeByJobTitle (JobTitle)
  {
    return new Promise ((accepted,rejected)=>
    {
      const jobTitleInLowerCase = JobTitle.toLowerCase();
      const commonTitles = Employees.filter((Titles)=>
      {
      const selectedEmp = Titles.job_title.toLowerCase();
      return selectedEmp.includes(jobTitleInLowerCase);
    });
    if(commonTitles <= 0)
    {
      rejected("Unable to get the Job Title");
    }
    else
    {
      accepted(commonTitles);
    }

   });
  }  

module.exports={Initialize,getAllEmployees,getEmployeeByNum,getEmployeeByExp,getEmployeeByDep,getEmployeeByJobTitle};
