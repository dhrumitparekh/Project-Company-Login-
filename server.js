const express = require('express');
const Data= express();
const HTTP_PORT = 8080;
const EmployeeData =require("./modules/employeeData");
Data.use(express.static('public')); 

EmployeeData.Initialize()
Data.get ('/',(req,res)=>{
    res.send('Testing');
});

Data.get('/employeeData/Employees',(req,res)=>{
    EmployeeData.getAllEmployees()
    .then((employeeData) => {
        res.json(employeeData);
      })
    });

Data.get('/employeeData/get_EmployeeNum',(req,res)=>{
      const EmployeeNum = "3";
EmployeeData.getEmployeeByNum(EmployeeNum).then((Employees)=>
{
  res.json(Employees);
}).catch((error) => {
  res.status(404).json({ error: error });
});
  });

Data.get('/employeeData/get_EmployeeExp',(req,res)=>{
      const EmployeeExp = "7";

EmployeeData.getEmployeeByExp(EmployeeExp).then((Employees)=>
{
  res.json(Employees);
}).catch((error) => {
  res.status(404).json({ error: error });
});
  });

  Data.get('/employeeData/get_EmployeeByDep',(req,res)=>
  {
    const Dep = "Marketing";
    EmployeeData.getEmployeeByDep(Dep).then((Department)=>{
      res.json(Department);
    })
    .catch((error)=>{
      res.status(404).json({ error: error });
    
    });
  });

  Data.get('/employeeData/get_EmployeeByJobTitle',(req,res)=>
  {
    const Title = "Data Analyst";
    EmployeeData.getEmployeeByJobTitle(Title).then((Titles)=>{
      res.json(Titles);
    })
    .catch((error)=>{
      res.status(404).json({ error: error });
    
    });
  });


  Data.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
