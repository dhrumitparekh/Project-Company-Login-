const express = require('express');
const Data= express();
const path = require('path');
const HTTP_PORT = 8080;
const EmployeeData = require("./modules/employeeData");
Data.use(express.static('public')); 


EmployeeData.Initialize()
Data.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './views/home.html'));
});

Data.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, './views/about.html'));
});

Data.get('/employeeData/Employees',async(req,res)=>{
  const EmployeeDep = req.query.EmployeeDep;
  const EmployeeJob = req.query.EmployeeJob;
  try{
    if (EmployeeDep)
    {
      const Depart = await EmployeeData.getEmployeeByDep(EmployeeDep);
      res.json(Depart);
    }
    else if(EmployeeJob)
    {
      const Job = await EmployeeData.getEmployeeByJobTitle(EmployeeJob);
      res.json(Job);
    }
    else
    {
    const Number = await EmployeeData.getAllEmployees();
    res.json(Number);
    }
  }
    catch
    {
      res.status(404).json({ error: error });
    }
    });

Data.get('/employeeData/Employees/:id',async(req,res)=>{
      const EmployeeNum = req.params.id;
      try{
          const IdNumber = await EmployeeData.getEmployeeByNum(EmployeeNum);
          res.json(IdNumber);
}
catch(error) 
{
  res.status(404).json({ error: error });
}
  });

Data.get('/employeeData/Employees/years/:years_of_experience',async(req,res)=>{
      const EmployeeExp = req.params.years_of_experience;
  try
  {  
    const Experience = await EmployeeData.getEmployeeByExp(EmployeeExp);
    res.json(Experience);
  }
  catch(error)
  {
    res.status(404).json({ error: error });
  }
});

  Data.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
