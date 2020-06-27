const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require('easy-table');
//const ConsoleTable = require("console.table"),

connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user:"root",
    password:"rootroot",
    database: "employee_db"
});

// connection and error
connection.connect(function(err)    {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    beginQuery();
});


// CLI
function beginQuery()    {
    console.log("------------------------")
    console.log("EMPLOYEE TRACKER SYSTEM")
    console.log("------------------------")
    console.log("")
    console.log("----------MENU----------")
    inquirer.prompt({
        name: "todo",
        type: "list",
        message: "What would you like to do today?",
        choices: [
            "View employees",
            "Add employee",
            "Update employee",
            "Exit",
            ""
        ]})
    .then(function (answer) {
        if (answer.todo === "View employees") {
            allEmployee();
        }
        else if (answer.todo === "Add employee"){
            addEmployee();
        }
        else if (answer.todo === "Update employee"){
            updateEmployee();
        }
        else {
            connection.end();
        }

    })
console.log("-------------------") 
console.log("")
};


//DISPLAY ALL EMPLOYEES ---------------
function allEmployee() {
    connection.query("SELECT * FROM employee", function (err,result) {
        if(err) throw err;
        printTable();   
        console.log(result);
        beginQuery();
    })
};



//CREATE TABLE FOR ALL EMPLOYEES-------------
function printTable() {
    /*left join to pull dept name from role id*/
    connection.query("SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id", function (err, data) {
        if (err) throw err;
        var t = new Table;
        data.forEach(function (employee) {
            t.cell('employee ID', employee.id)
            t.cell('First Name', employee.first_name)
            t.cell('Last Name', employee.last_name)
            t.cell('Role', employee.title)
            t.cell('Salary', employee.salary)
            t.newRow()
        })
        console.log(t.toString())
    })
}



// ADD NEW EMPLOYEES ---------
function addEmployee() {
        connection.query("SELECT * FROM role", function (err,result) {
            if(err) throw err;
    
            inquirer.prompt([{
                name: "firstName",
                type: "input",
                message: "Input Employee's FIRST name: ",  
            },{
                name: "lastName",
                type: "input",
                message: "Input Employee's LAST name: ", 
            },{
                name: "role",
                type: "list",
                message: "Input Employee's ROLE: ",
                choices: result.map(newEmployee => {
                    return { name: newEmployee.title, value: newEmployee.id }
                })
            }
            ])
            .then(function (input) {
                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: input.firstName,
                        last_name: input.lastName,
                        role_id: input.role
                    },
                    function (err) {
                        if (err) throw err;
                        console.log ("New employee Added!");
                        
                        beginQuery();
                    }
                )
            })
        })
    };


    function updateEmployee() {
        connection.query("SELECT * FROM employee", function(err,result) {
            if(err) throw err;
            
            inquirer.prompt([
                {
                    name:"name",
                    type:"list",
                    message: "Which employee is having a role change?: ",
                    choices: result.map(employee => {
                        return { name: employee.first_name, value: employee.id }
                 })   
                },
            ]).then(function (inputRole) {
                connection.query("SELECT * FROM role", function(err,data) {
                    if(err) throw err;
                    inquirer.prompt([
                        {
                            name:"job",
                            type:"list",
                            message: "Choose Employee NEW ROLE: ",
                            choices: data.map(job => {
                             return { name: job.title, value: job.id }
                            
                            })   
                           }
                    ]).then(function (input){
                        connection.query("UPDATE employee SET role_id = ? WHERE id = ?", 
                        [input.job, inputRole.name],
                        function (err) {
                            if (err) throw err;
                            console.log ("Employee Role Updated!");
                            beginQuery();
                         })
        
                    });
                });
            });
        });
    }