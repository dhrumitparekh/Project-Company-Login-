const express = require('express');
const Data= express();
const path = require('path');
const HTTP_PORT = 8080;
const EmployeeData = require("./modules/employeeData");
Data.use(express.static('public')); 
Data.set('view engine', 'ejs');

EmployeeData.Initialize()
Data.get('/', (req, res) => {
  res.render("home");
});

Data.get('/about', (req, res) => {
  res.render("about");
});

Data.get('/employeeData/Employees',async(req,res)=>{
  const EmployeeDep = req.query.EmployeeDep;
  const EmployeeJob = req.query.EmployeeJob;
  try{
    if (EmployeeDep)
    {
      const Depart = await EmployeeData.getEmployeeByDep(EmployeeDep);
      res.render("Employees", {Employees : Depart });
    }
    else if(EmployeeJob)
    {
      const Job = await EmployeeData.getEmployeeByJobTitle(EmployeeJob);
      res.render("Employees", {Employees : Job });
    }
    else
    {
    const Number = await EmployeeData.getAllEmployees();
    res.render("Employees", {Employees : Number });
    }
  }
    catch
    {
      res.status(404).render("404",{ message: "No such employee found" });
    }
    });

Data.get('/employeeData/Employees/:id',async(req,res)=>{
      const EmployeeNum = req.params.id;
      try{
          const IdNumber = await EmployeeData.getEmployeeByNum(EmployeeNum);
          res.render("Employee", {Employee : IdNumber });
}
catch(error) 
{
  const Input = req.params.id;
  res.status(404).render("404",{ message : `No employee with id ${Input} found. ` });
}
  });

  Data.get("/employeeData/addEmployees", async (req, res) => {
    try {
      const Job = await EmployeeData.getAllJobTitles();
      const Dep = await EmployeeData.getAllDepartments();
      res.render("addEmployees", { Job,Dep });
    } catch (err) {
      res.render("404", { message: `Error: ${err.message}` });
    }
  });
  
  Data.post('/employeeData/addEmployees', async (req, res) => {
    try {
      await EmployeeData.addEmployee(req.body);
      res.redirect('/employeeData/Employees');
    } catch (err) {
      res.render("404", { message: `Error: ${err}` });
    }
  });

Data.get('/employeeData/Employees/years/:years_of_experience',async(req,res)=>{
      const EmployeeExp = req.params.years_of_experience;
  try
  {  
    const Experience = await EmployeeData.getEmployeeByExp(EmployeeExp);
    res.render("Employee", {Employee : Experience });
    if(!Experience){
      throw new error('Employee not found');
    }
  }
  catch(error)
  {
    const Input = req.params.years_of_experience;
    res.status(404).render("404",{ message : `No  employee with ${Input} years of experience found.`});
  }
});


  Data.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));

