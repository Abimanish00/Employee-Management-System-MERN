import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/addEmployee.css';
import API from '../../utils/axios';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [base64Image, setBase64Image] = useState("");

  const initialValues = {
    name: '',
    email: '',
    empId: '',
    role: '',
    salary: '',
    joinDate: '',
    experience: '',
    remarks: ''
  };

  const validate = (values) => {
    const errors = {};
    if (!values.name.trim()) errors.name = "Name is required";
    if (!values.email.trim()) errors.email = "Email is required";
    if (!values.empId.trim()) errors.empId = "Employee ID is required";
    if (!values.role.trim()) errors.role = "Role is required";
    if (!values.salary) errors.salary = "Salary is required";
    if (!values.joinDate) errors.joinDate = "Join Date is required";
    if (!base64Image) errors.image = "Profile image is required";
    return errors;
  };

  const handleImageChange = (e, setFieldError) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Image size should be less than 1MB");
        setFieldError("image", "Image exceeds 1MB limit");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setBase64Image(base64String);
        setImagePreview(base64String);
        setFieldError("image", "");
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    const dataToSubmit = {
      ...values,
      image: base64Image,
    };

    try {
      await API.post("/employees", dataToSubmit, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Employee added successfully");
      navigate("/dashboard");
      resetForm();
      setImagePreview(null);
      setBase64Image("");
    } catch (err) {
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data.message === "Employee ID already exists"
      ) {
        toast.error("Employee ID already exists");
      } else {
        toast.error("Failed to add employee");
        console.error(err);
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="add-employee-container">
      <h2>Add New Employee</h2>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, setFieldError }) => (
          <Form className="employee-form">
            <div className="form-group">
              <label>Profile Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setFieldError)}
              />
              <small>Max file size: 1MB</small>
              <ErrorMessage name="image" component="p" className="error-text" />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="image-preview" />
              )}
            </div>

            {["name", "email", "empId", "role", "salary", "joinDate"].map((field) => (
              <div className="form-group" key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                <Field
                  type={
                    field === "salary"
                      ? "number"
                      : field === "joinDate"
                      ? "date"
                      : "text"
                  }
                  name={field}
                />
                <ErrorMessage name={field} component="p" className="error-text" />
              </div>
            ))}

            <div className="form-group">
              <label>Experience:</label>
              <Field type="number" name="experience" min={0} max={100} />
            </div>

            <div className="form-group">
              <label>Remarks:</label>
              <Field as="textarea" name="remarks" />
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                Submit
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddEmployee;
