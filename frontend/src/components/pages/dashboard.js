import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import API from "../../utils/axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [filterRole, setFilterRole] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await API.get("/employees", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setEmployees(res.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = employees
    .filter((emp) => emp.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((emp) =>
      filterRole ? emp.role.toLowerCase() === filterRole.toLowerCase() : true
    )
    .sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name);
      if (sortKey === "salary") return Number(b.salary) - Number(a.salary);
      if (sortKey === "joinDate")
        return new Date(a.joinDate) - new Date(b.joinDate);
      return 0;
    });

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!confirmDelete) return;

    try {
      await API.delete(`/employees/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEmployees(employees.filter((emp) => emp._id !== id)); // or emp.id if you're using empId
      toast.success("Employee deleted successfully");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete employee");
    }
  };

  const openModal = (emp) => {
    setSelectedEmployee(emp);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
    setShowModal(false);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.trimStart()); // trims only leading spaces
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <p className="welcome-msg">
            Welcome, {localStorage.getItem("username") || "User"}!
          </p>
          <h2>Employee Dashboard</h2>
        </div>
        <button className="btn-add" onClick={() => navigate("/addEmployee")}>
          Add Employee
        </button>
      </div>

      <div className="controls-bar">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={handleSearchChange}
          className="control-input"
        />

        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="control-input"
        >
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="salary">Salary</option>
          <option value="joinDate">Join Date</option>
        </select>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="control-input"
        >
          <option value="">Filter by Role</option>
          <option value="Developer">Developer</option>
          <option value="Manager">Manager</option>
          <option value="HR">HR</option>
        </select>
      </div>

      <table className="employee-table">
        <thead>
          <tr>
            <th>S.no</th>
            <th>Photo</th>
            <th>Name</th>
            <th>Email</th>
            <th>Employee ID</th>
            <th>Role</th>
            <th>Salary</th>
            <th>Join Date</th>
            <th>Experience</th>
            <th>Remarks</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((emp, index) => (
              <tr key={emp._id}>
                <td>{index + 1}</td>
                <td>
                  <img src={emp.image} alt={emp.name} className="profile-img" />
                </td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.empId}</td> 
                <td>{emp.role}</td>
                <td>{emp.salary}</td>
                <td>{new Date(emp.joinDate).toLocaleDateString("en-GB")}</td>
                <td>{emp.experience}</td>
                <td>{emp.remarks}</td>
                <td className="action-buttons">
                  <button onClick={() => openModal(emp)}>View</button>
                  <button
                    onClick={() =>
                      navigate("/editEmployee", { state: { employee: emp } })
                    }
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(emp._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" style={{ textAlign: "center" }}>
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && selectedEmployee && (
        <div className="modal-overlay">
          <div className="modal-box">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <img
              src={selectedEmployee.image}
              alt="Profile"
              className="modal-img"
            />
            <h3>{selectedEmployee.name}</h3>
            <p>
              <strong>Email:</strong> {selectedEmployee.email}
            </p>
            <p>
              <strong>Employee ID:</strong> {selectedEmployee.empId}
            </p>
            <p>
              <strong>Role:</strong> {selectedEmployee.role}
            </p>
            <p>
              <strong>Salary:</strong> ₹{selectedEmployee.salary}
            </p>
            <p>
              <strong>Join Date:</strong> {selectedEmployee.joinDate}
            </p>
            <p>
              <strong>Experience:</strong> {selectedEmployee.experience}
            </p>
            <p>
              <strong>Remarks:</strong> {selectedEmployee.remarks}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
