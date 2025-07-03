import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/addEmployee.css';
import { toast } from 'react-toastify';
import API from '../../utils/axios';

const EditEmployee = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const employeeData = location.state?.employee;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    empId: '',
    role: '',
    salary: '',
    joinDate: '',
    experience: '',
    remarks: '',
    image: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (employeeData) {
      setFormData(employeeData);
      setImagePreview(employeeData.image);
    } else {
      navigate('/dashboard');
    }
  }, [employeeData, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Image size should be less than 1MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setFormData((prev) => ({ ...prev, image: base64String }));
        setFormErrors((prev) => ({ ...prev, image: "" }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.empId.trim()) errors.empId = "Employee ID is required";
    if (!formData.role.trim()) errors.role = "Role is required";
    if (!formData.salary) errors.salary = "Salary is required";
    if (!formData.joinDate) errors.joinDate = "Join Date is required";
    if (!formData.image) errors.image = "Profile image is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdate = async (e) => {
  e.preventDefault();
  if (validateForm()) {
    try {
      await API.put(`/employees/${formData._id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("Employee updated successfully");
      navigate("/dashboard");
    } catch (err) {
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data.message === "Employee ID already exists"
      ) {
        toast.error("Employee ID already exists");
      } else {
        toast.error("Failed to update employee");
        console.error("Update failed:", err);
      }
    }
  }
};


  return (
    <div className="add-employee-container">
      <h2>Edit Employee</h2>
      <form onSubmit={handleUpdate} className="employee-form">
        <div className="form-group">
          <label>Profile Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <small>Max file size: 1MB</small>
          {formErrors.image && <p className="error-text">{formErrors.image}</p>}
          {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
        </div>

        {["name", "email", "empId", "role", "salary", "joinDate"].map((field) => (
          <div className="form-group" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type={field === "salary" ? "number" : field === "joinDate" ? "date" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
            />
            {formErrors[field] && <p className="error-text">{formErrors[field]}</p>}
          </div>
        ))}

        <div className="form-group">
          <label>Experience:</label>
          <input type="number" name="experience" value={formData.experience} onChange={handleChange} min={0} max={100} />
        </div>

        <div className="form-group">
          <label>Remarks:</label>
          <textarea name="remarks" value={formData.remarks} onChange={handleChange}></textarea>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-submit">Update</button>
          <button type="button" className="btn-cancel" onClick={() => navigate("/dashboard")}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditEmployee;
