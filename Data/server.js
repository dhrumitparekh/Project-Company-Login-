const express = require('express');
const Data= express();
const port = 8080;
const EmployeeData =require("./modules/employeeData");

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

Data.listen(port, () => {
    console.log('Server is listening on port ${port}');
  });