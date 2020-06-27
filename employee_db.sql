DROP SCHEMA IF EXISTS employee_db;
CREATE SCHEMA employee_db;

USE employee_db;

CREATE TABLE department (
	id INT AUTO_INCREMENT NOT NULL,
    `name` VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
	id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department (id),
    PRIMARY KEY (id)
);

CREATE TABLE employee (
	id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES `role` (id),
    PRIMARY KEY (id)
);

INSERT INTO department VALUES (1, "Programming");
INSERT INTO department VALUES (2, "Comidian");
INSERT INTO department VALUES (3, "Wizard");

INSERT INTO role VALUES (1, "Programming", 80000.00, 1);
INSERT INTO role VALUES (2, "Comidian", 100000.00, 1);
INSERT INTO role VALUES (3, "Wizard", 70000.00, 2);


INSERT INTO employee VALUES (1, "Moe", "Potter", 1, 2);
INSERT INTO employee VALUES (2, "Curly", "Dumm", 2, NULL);
INSERT INTO employee VALUES (3, "Mouse", "Tail", 3, 1);