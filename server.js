const express = require('express');
const Data= express();
const path = require('path');
const HTTP_PORT = 8080;
const EmployeeData = require("./modules/employeeData");
Data.use(express.static('public')); 
Data.set('view engine', 'ejs');
Data.use(express.json());
Data.use(express.urlencoded({ extended: true }));
const authData = require('./modules/auth-service');
const bodyParser = require('body-parser');
const clientSessions = require('client-sessions');

Data.use(bodyParser());

authData.initialize()
.then(EmployeeData.Initialize())
.then(function(){
    Data.listen(HTTP_PORT, function(){
        console.log(`Data listening on:  ${HTTP_PORT}`);
    });
}).catch(function(err){
    console.log(`unable to start server: ${err}`);
});




Data.use((req, res, next) => {
  Data.locals.currentRoute = req.path;
  next();
});

Data.use(
  clientSessions({
    cookieName: 'session',
    secret: 'your-secret-key',
    duration: 24 * 60 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
  })
);

Data.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

Data.get('/', (req, res) => {
  try {
    let errorMessage = '';
    res.render('home', { errorMessage });
  } catch (error) {
    res.status(500).render('500', { message: `I'm sorry, but we have encountered the following error: ${error}` })
  }
})

Data.post('/', async (req, res) => {
  try {
    const { userName, password } = req.body;
    const userAgent = req.get('User-Agent');
    console.log(userName, password, userAgent);
    let user = await authData.checkUser(userName, password, userAgent);
    if (user == 404) return res.render('home', { errorMessage: "User not fount" })
    if (user == 400) return res.render('home', { errorMessage: "Password not match" })
    req.session.user = user;
    res.redirect('/employeeData/Employees');
  } catch (error) {
    res.status(500).render('500', { message: `I'm sorry, but we have encountered the following error: ${error}` })
  }
})


const ensureLogin = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    next();
  }
};

Data.get('/logout', (req, res) => {
  req.session.reset(); 
  res.redirect('/'); 
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
      res.render("Employees", {Employees : Job});
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

  Data.get("/employeeData/addEmployees",ensureLogin,async (req, res) => {
    try {
      const Job = await EmployeeData.getAllJobTitles();
      const Dep = await EmployeeData.getAllDepartments();
      res.render("addEmployees", { Job,Dep });
    } catch (err) {
      res.render("404", { message: `Error: ${err.message}` });
    }
  });
  

  Data.post('/employeeData/addEmployees',ensureLogin,async (req, res) => {
    try {

      await EmployeeData.addEmployee(req.body);
      res.redirect('/employeeData/Employees');
    } catch (err) {
      console.log(err);
      res.render("404", { message: `Error: ${err}` });
    }
  });

  Data.get('/employeeData/deleteEmployee/:id',ensureLogin, async (req, res) => {
    try {
      await EmployeeData.deleteEmployee(req.params.id);
      res.redirect('/employeeData/Employees');
    } catch (err) {
      res.status(500).render('500', { message: `Error: ${err}` });
    }
  });
  
Data.get('/employeeData/editEmployees/:id',ensureLogin,async (req, res) => {
  try {
    const Emp = await EmployeeData.getEmployeeByNum(req.params.id);
    const Job = await EmployeeData.getAllJobTitles();
    const Dep = await EmployeeData.getAllDepartments();

    res.render('editEmployees', { Emp, Job, Dep });
  } catch (err) {
    res.status(404).render('404', { message: err.message });
  }
});

Data.post('/employeeData/editEmployees',ensureLogin, async (req, res) => {
  try {
    const empId = req.body.id; 
    const updatedData = req.body; 

    await EmployeeData.editEmployee(empId, updatedData);

    res.redirect('/employeeData/Employees');
  } catch (err) {
    res.status(500).render('500', { message: `Error: ${err}` });
  }
});

Data.get('/register', (req, res) => {
  const errorMessage = '';
  res.render('register', {
    errorMessage
  })
})

Data.post('/register', async (req, res) => {
  try {
    let { userName, email, password1, password2 } = req.body;
    console.log(userName, email, password1, password2)
    if (password1 != password2) return res.status(400).render('register', { errorMessage: "Passwords do not match" });
    await authData.registerUser(userName, email, password1, password2);
    res.status(201).redirect('/');
  } catch (error) {
    res.status(500).render('500', { message: `I'm sorry, but we have encountered the following error: ${error}` })
  }
})


Data.get('/userHistory', ensureLogin, (req, res) => {
  let user = req.session?.user;
  res.render('userHistory', {
    user
  })
})

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



  




