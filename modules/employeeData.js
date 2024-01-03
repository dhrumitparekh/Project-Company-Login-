require('dotenv').config();
const Sequelize = require('sequelize');


let sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

const Department = sequelize.define('Department', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Department: Sequelize.STRING,
}, {
  timestamps: false,
});

const Jobtitle = sequelize.define('Jobtitle', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Job_title: Sequelize.STRING,
}, {
  timestamps: false,
});

const Employee = sequelize.define('Employee', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: Sequelize.STRING,
  last_name: Sequelize.STRING,
  email: Sequelize.STRING,
  phone: Sequelize.STRING, 
  gender: Sequelize.STRING,
  age: Sequelize.INTEGER,
  job_title: Sequelize.INTEGER,
  years_of_experience: Sequelize.INTEGER,
  salary: Sequelize.INTEGER,
  department: Sequelize.INTEGER,
  Image: Sequelize.STRING,
}, {
  timestamps: false,
});

Employee.belongsTo(Jobtitle, { foreignKey: 'job_title' });
Employee.belongsTo(Department, { foreignKey: 'department' });

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully');
  })
  .catch((err) => {
    console.log('Unable to connect to the database:', err);
  });

  async function Initialize() {
    return sequelize.sync();
  }
  
  async function getAllEmployees() {
  try {
    await sequelize.sync();
    const employees = await Employee.findAll({
      include: [{ model: Department }, { model: Jobtitle }],
      order:[['id','ASC']],
    });

    const transformedEmployees = employees.map((employee) => ({
      id: employee.id,
      first_name:employee.first_name,
      last_name:employee.last_name,
      email:employee.email,
      phone:employee.phone,
      gender:employee.gender,
      age:employee.age,
      years_of_experience:employee.years_of_experience,
      salary:employee.salary,
      Image:employee.Image,
      department: employee.Department.Department,
      job_title: employee.Jobtitle.Job_title,
     
    }));

    return transformedEmployees;
  } catch (error) {
    throw error;
  }
}



function getEmployeeByNum(EmployeeNumber) {
  return new Promise(async (accepted, rejected) => {
    try {
     
      const selectedEmployee = await Employee.findOne({
        where: { id: EmployeeNumber },
        include: [
          { model: Department },
          { model: Jobtitle}
        ],
      });

      if (!selectedEmployee) {
        rejected("Unable to find the requested Employee");
      } else {
        
        accepted(selectedEmployee);
      }
    } catch (error) {
      rejected(error);
    }
  });
}


function getEmployeeByExp(EmployeeExp) {
  return new Promise(async (accepted, rejected) => {
    try {
      const employeesByExp = await Employee.findOne({
        where: { years_of_experience: EmployeeExp },
        include: [
          { model: Department},
          { model: Jobtitle}
        ],
      });

      if (!employeesByExp || employeesByExp.length === 0) {
        rejected("Unable to find employees with the specified years of experience");
      } else {
        accepted(employeesByExp);
      }
    } catch (error) {
      rejected(error);
    }
  });
}

function addEmployee(employeeData) {
  return new Promise(async (resolve,reject)=>{
    try {
      await Employee.create(employeeData);
      resolve();
    } catch (err) {
      reject(err.errors[0].message);
    }
  });
}

const getAllDepartments = async () => {
  try {
    const departments = await Department.findAll();
    return departments;
  } catch (err) {
    throw err;
  }
};

const getAllJobTitles = async () => {
  try {
    const jobTitles = await Jobtitle.findAll();
    return jobTitles;
  } catch (err) {
    throw err;
  }
};



const editEmployee = async (empId, updatedData) => {
  try {
    if (empId !== undefined) {
      await Employee.update(updatedData, { where: { id: empId } });
    } else {
      throw new Error("Invalid or undefined empId");
    }
  } catch (err) {
    throw err;
  }
};

const deleteEmployee = async (EmpNum) => {
  try {
    await Employee.destroy({ where: { id: EmpNum } });
  } catch (err) {
    throw err;
  }
};

function getEmployeeByDep(Dep) {
  return new Promise(async (accepted, rejected) => {
    try {
      const employeesByDep = await Employee.findAll({
        include: [
          {
            model: Department,
            where: Sequelize.where(
              Sequelize.fn('lower', Sequelize.col('Department.Department')),
              'LIKE',
              `%${Dep.toLowerCase()}%`
            ),
          },
        ],
      });

      if (!employeesByDep || employeesByDep.length === 0) {
        rejected("Unable to find employees in the specified department");
      } else {
        accepted(employeesByDep);
      }
    } catch (error) {
      rejected(error);
    }
  });
}

function getEmployeeByJobTitle(JobTitle) {
  return new Promise(async (accepted, rejected) => {
    try {
      const employeesByJobTitle = await Employee.findAll({
        include: [
          {
            model: Jobtitle,
            where: Sequelize.where(
              Sequelize.fn('lower', Sequelize.col('Jobtitle.Job_title')),
              'LIKE',
              `%${JobTitle.toLowerCase()}%`
            ),
          },
        ],
      });

      if (!employeesByJobTitle || employeesByJobTitle.length === 0) {
        rejected("Unable to find employees with the specified job title");
      } else {
        accepted(employeesByJobTitle);
      }
    } catch (error) {
      rejected(error);
    }
  });
}

module.exports={Initialize,getAllEmployees,getEmployeeByNum,getEmployeeByExp,addEmployee,getAllDepartments,getAllJobTitles,deleteEmployee,editEmployee,getEmployeeByDep,getEmployeeByJobTitle};
