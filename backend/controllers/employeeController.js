const Employee = require("../models/Employee");

// @desc   Add a new employee
// @route  POST /api/employees
exports.addEmployee = async (req, res) => {
  try {
    const newEmployee = await Employee.create(req.body);
    res.status(201).json(newEmployee);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.empId) {
      return res.status(400).json({ message: "Employee ID already exists" });
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};

// @desc   Get all employees
// @route  GET /api/employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employees", error });
  }
};

// @desc   Update employee by ID
// @route  PUT /api/employees/:id
exports.updateEmployee = async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(updated);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.empId) {
      return res.status(400).json({ message: "Employee ID already exists" });
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};


// @desc   Delete employee by ID
// @route  DELETE /api/employees/:id
exports.deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error });
  }
};
