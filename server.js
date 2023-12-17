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


Data.listen(port, () => {
    console.log('Server is listening on port ${port}');
  });