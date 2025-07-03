import React, { useState ,useEffect} from "react";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import API from "../../utils/axios";
import "../styles/signup.css";
import { toast } from 'react-toastify';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    department: "",
    experience: "",
    teamHandling: [],
    country: null,
    state: null,
    city: null,
    address: "",
    phnNo: "",
  });

  const [errors, setErrors] = useState({});
  const [countryOptions] = useState(Country.getAllCountries());
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    navigate("/dashboard");
  }
}, [navigate]);

  const handleCountryChange = (selected) => {
    setFormData({ ...formData, country: selected, state: null, city: null });
    setStateOptions(State.getStatesOfCountry(selected.isoCode));
    setCityOptions([]);
  };

  const handleStateChange = (selected) => {
    setFormData({ ...formData, state: selected, city: null });
    setCityOptions(City.getCitiesOfState(formData.country.isoCode, selected.isoCode));
  };

  const handleCityChange = (selected) => {
    setFormData({ ...formData, city: selected });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      const newTeams = checked
        ? [...formData.teamHandling, value]
        : formData.teamHandling.filter((team) => team !== value);
      setFormData({ ...formData, teamHandling: newTeams });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.gender) newErrors.gender = "Gender is required.";
    if (!formData.department) newErrors.department = "Department is required.";
    if (!formData.experience) newErrors.experience = "Experience is required.";
    if (formData.teamHandling.length === 0) newErrors.teamHandling = "Select at least one team.";
    if (!formData.country) newErrors.country = "Country is required.";
    if (!formData.state) newErrors.state = "State is required.";
    if (!formData.city) newErrors.city = "City is required.";
    if (!formData.address) newErrors.address = "Address is required.";
    if (!formData.phnNo) newErrors.phnNo = "Phone number is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await API.post("http://localhost:5000/api/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        department: formData.department,
        experience: formData.experience,
        teamHandling: formData.teamHandling,
        country: formData.country?.name,
        state: formData.state?.name,
        city: formData.city?.name,
        address: formData.address,
        phone: formData.phnNo,
      });
      toast.success("Signup successful! Please sign in.");
      navigate("/login");
    } catch (err) {
  if (err.response?.data?.message === "Email already exists") {
    toast.error("Email already exists");
  } else {
    toast.error("Signup failed. Please try again.");
  }
}

  };

  return (
    <div className="signup-container">
      <h2>Signup Form</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" placeholder="min 6 characters" value={formData.password} onChange={handleChange} />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword"  value={formData.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        </div>

        <div className="form-group">
          <label>Gender</label>
          <div className="gender-options">
            {['Male', 'Female', 'Other'].map((gender) => (
              <label key={gender}>
                <input type="radio" name="gender" value={gender} onChange={handleChange} /> {gender}
              </label>
            ))}
          </div>
          {errors.gender && <p className="error">{errors.gender}</p>}
        </div>

        <div className="form-group">
          <label>Department</label>
          <input type="text" name="department" value={formData.department} onChange={handleChange} />
          {errors.department && <p className="error">{errors.department}</p>}
        </div>

        <div className="form-group">
          <label>Experience</label>
          <input type="number" name="experience" value={formData.experience} onChange={handleChange} min={0} max={100} />
          {errors.experience && <p className="error">{errors.experience}</p>}
        </div>

        <div className="form-group">
          <label>Team Handling</label>
          <div className="team-options">
            {["Team-1", "Team-2", "Team-3"].map((team) => (
              <label key={team}>
                <input
                  type="checkbox"
                  name="teamHandling"
                  value={team}
                  checked={formData.teamHandling.includes(team)}
                  onChange={handleChange}
                /> {team}
              </label>
            ))}
          </div>
          {errors.teamHandling && <p className="error">{errors.teamHandling}</p>}
        </div>

        <div className="form-group">
          <label>Country</label>
          <Select
            options={countryOptions}
            getOptionLabel={(e) => e.name}
            getOptionValue={(e) => e.isoCode}
            onChange={handleCountryChange}
            value={formData.country}
          />
          {errors.country && <p className="error">{errors.country}</p>}
        </div>

        <div className="form-group">
          <label>State</label>
          <Select
            options={stateOptions}
            getOptionLabel={(e) => e.name}
            getOptionValue={(e) => e.isoCode}
            onChange={handleStateChange}
            value={formData.state}
          />
          {errors.state && <p className="error">{errors.state}</p>}
        </div>

        <div className="form-group">
          <label>City</label>
          <Select
            options={cityOptions}
            getOptionLabel={(e) => e.name}
            getOptionValue={(e) => e.name}
            onChange={handleCityChange}
            value={formData.city}
          />
          {errors.city && <p className="error">{errors.city}</p>}
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea name="address" value={formData.address} onChange={handleChange}></textarea>
          {errors.address && <p className="error">{errors.address}</p>}
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input type="text" name="phnNo" value={formData.phnNo} onChange={handleChange} />
          {errors.phnNo && <p className="error">{errors.phnNo}</p>}
        </div>

        <button type="submit" className="btn">Submit</button>
      </form>
      <p>Already Have an Account? <Link to="/login">Login</Link></p>
    </div>
  );
}

export default Signup;
