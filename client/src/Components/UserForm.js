import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./UserForm.css";

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // for edit route
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({
    id: "", fname: "", lname: "", father_name: "", mother_name: "",
    dob: "", gender: "", blood_group: "", nationality: "", aadhar: "", pan: "",
    phone: "", alt_phone: "", email: "", address: "",
    emergency_contact_name: "", emergency_contact_no: "", emergency_relation: "", emergency_address: "",
    school: "", school_year: "", college: "", college_year: "",
    dept: "", role: "", doj: "", experience: ""
  });

  const [errors, setErrors] = useState({});

  // Validate login and fetch user if editing
  useEffect(() => {
    const validateUser = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/auth/validate", {
          withCredentials: true,
        });
        if (res.status === 200) {
          if (id) await fetchUserById(); // if editing
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Auth validation failed:", error);
        alert("Session expired or unauthorized. Redirecting...");
        navigate("/");
      }
    };
    validateUser();
  }, [navigate, id]);

  // Helper function to format date properly
  const formatDateForInput = (dateString) => {
  if (!dateString) return "";

  // Create a date object
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) return "";

  // Get the local date components to avoid timezone issues
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};



  const fetchUserById = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/users/${id}`, {
        withCredentials: true,
      });
      const user = res.data;

      setForm({
        id: user.id,
        fname: user.fname || "",
        lname: user.lname || "",
        father_name: user.father_name || "",
        mother_name: user.mother_name || "",
        dob: formatDateForInput(user.dob),
  gender: user.gender || "",
  blood_group: user.blood_group || "",
  nationality: user.nationality || "",
  aadhar: user.aadhar || "",
  pan: user.pan || "",
  phone: user.phone_no || "",
  alt_phone: user.alternate_no || "",
  email: user.email || "",
  address: user.address || "",
  emergency_contact_name: user.emergency_name || "",
  emergency_contact_no: user.emergency_num || "",
  emergency_relation: user.emergency_relation || "",
  emergency_address: user.emergency_address || "",
  school: user.school || "",
  school_year: user.school_completion_year || "",
  college: user.college || "",
  college_year: user.college_completion_year || "",
  dept: user.dept || "",
  role: user.role || "",
  doj: formatDateForInput(user.date_of_joining),
  experience: user.prev_exp || "",
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
      alert("Failed to load user data");
    }
  };

  // Validation functions
  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateAadhar = (aadhar) => {
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(aadhar);
  };

  const validatePAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.toUpperCase());
  };

  // Real-time validation
  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "phone":
        if (value && !validatePhone(value)) {
          error = "Phone number must be 10 digits starting with 6-9";
        }
        break;
      case "alt_phone":
        if (value && !validatePhone(value)) {
          error = "Alternate phone must be 10 digits starting with 6-9";
        }
        break;
      case "emergency_contact_no":
        if (value && !validatePhone(value)) {
          error = "Emergency contact must be 10 digits starting with 6-9";
        }
        break;
      case "email":
        if (value && !validateEmail(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "aadhar":
        if (value && !validateAadhar(value)) {
          error = "Aadhar number must be exactly 12 digits";
        }
        break;
      case "pan":
        if (value && !validatePAN(value)) {
          error = "PAN must be in format: ABCDE1234F (5 letters, 4 digits, 1 letter)";
        }
        break;
      case "id":
      case "fname":
      case "lname":
      case "role":
        if (!value.trim()) {
          error = "This field is required";
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert PAN to uppercase
    const finalValue = name === "pan" ? value.toUpperCase() : value;
    
    setForm({ ...form, [name]: finalValue });
    
    // Real-time validation
    const error = validateField(name, finalValue);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const isValid = () => {
    const newErrors = {};
    let isFormValid = true;

    // Required field validation
    const requiredFields = ["id", "fname", "lname", "email", "role"];
    requiredFields.forEach(field => {
      if (!form[field]?.trim()) {
        newErrors[field] = "This field is required";
        isFormValid = false;
      }
    });

    // Phone validation (required)
    if (!form.phone?.trim()) {
      newErrors.phone = "Phone number is required";
      isFormValid = false;
    } else if (!validatePhone(form.phone)) {
      newErrors.phone = "Phone number must be 10 digits starting with 6-9";
      isFormValid = false;
    }

    // Email validation (required)
    if (form.email && !validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email address";
      isFormValid = false;
    }

    // Optional field validations
    if (form.alt_phone && !validatePhone(form.alt_phone)) {
      newErrors.alt_phone = "Alternate phone must be 10 digits starting with 6-9";
      isFormValid = false;
    }

    if (form.emergency_contact_no && !validatePhone(form.emergency_contact_no)) {
      newErrors.emergency_contact_no = "Emergency contact must be 10 digits starting with 6-9";
      isFormValid = false;
    }

    if (form.aadhar && !validateAadhar(form.aadhar)) {
      newErrors.aadhar = "Aadhar number must be exactly 12 digits";
      isFormValid = false;
    }

    if (form.pan && !validatePAN(form.pan)) {
      newErrors.pan = "PAN must be in format: ABCDE1234F (5 letters, 4 digits, 1 letter)";
      isFormValid = false;
    }

    setErrors(newErrors);
    return isFormValid;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isValid()) return;

    // Prepare payload with numbers for experience, school_year, college_year
    const payload = {
      ...form,
      experience: isNaN(Number(form.experience)) ? 0 : Number(form.experience),
      school_year: isNaN(Number(form.school_year)) ? 0 : Number(form.school_year),
      college_year: isNaN(Number(form.college_year)) ? 0 : Number(form.college_year),
    };

    try {
      const url = id
        ? `http://localhost:3001/api/users/update/${id}`
        : `http://localhost:3001/api/users/save`;

      const method = id ? axios.put : axios.post;

      const res = await method(url, payload, {
        withCredentials: true,
      });

      if (res.status === 200) {
        alert(`User ${id ? "updated" : "saved"} successfully!`);
        navigate("/adminhome");
      }
    } catch (err) {
      console.error('Update user error:', err);
      alert(err.response?.data?.error || "Failed to save user");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="user-form">
      <ion-icon
        name="chevron-back-outline"
        onClick={() => navigate(-1)}
        style={{ cursor: "pointer", fontSize: "24px" }}
      >
        {" "}
      </ion-icon>
      <form className="form-container" onSubmit={handleSave}>
        <section className="form-section">
          <h2>Personal Information</h2>
          <div className="grid-2">
            <div className="photo-upload">
              <label htmlFor="photo">Upload Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                name="photo"
              />
            </div>
            <div className="input-group">
              <input
                name="id"
                value={form.id}
                placeholder="User ID (Required)"
                onChange={handleChange}
                required
                readOnly={!!id}
                className={errors.id ? "error" : ""}
              />
              {errors.id && <span className="error-message">{errors.id}</span>}
            </div>

            <div className="input-group">
              <input
                name="fname"
                value={form.fname}
                placeholder="First name (Required)"
                onChange={handleChange}
                required
                className={errors.fname ? "error" : ""}
              />
              {errors.fname && (
                <span className="error-message">{errors.fname}</span>
              )}
            </div>

            <div className="input-group">
              <input
                name="lname"
                value={form.lname}
                placeholder="Last name (Required)"
                onChange={handleChange}
                required
                className={errors.lname ? "error" : ""}
              />
              {errors.lname && (
                <span className="error-message">{errors.lname}</span>
              )}
            </div>

            <div className="input-group">
              <input
                name="father_name"
                value={form.father_name}
                placeholder="Father's name"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <input
                name="mother_name"
                value={form.mother_name}
                placeholder="Mother's name"
                onChange={handleChange}
              />
            </div>

            <div className="input-wrapper">
              <input
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                placeholder="YYYY-MM-DD"
                pattern="\d{4}-\d{2}-\d{2}"
              />
              <label htmlFor="dob">Date Of Birth</label>
            </div>

            <div className="input-group">
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="input-group">
              <select
                name="blood_group"
                value={form.blood_group}
                onChange={handleChange}
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="input-group">
              <input
                name="nationality"
                value={form.nationality}
                placeholder="Nationality"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <input
                name="aadhar"
                value={form.aadhar}
                placeholder="Aadhar number (12 digits)"
                onChange={handleChange}
                maxLength="12"
                className={errors.aadhar ? "error" : ""}
              />
              {errors.aadhar && (
                <span className="error-message">{errors.aadhar}</span>
              )}
            </div>

            <div className="input-group">
              <input
                name="pan"
                value={form.pan}
                placeholder="PAN number (ABCDE1234F)"
                onChange={handleChange}
                maxLength="10"
                style={{ textTransform: "uppercase" }}
                className={errors.pan ? "error" : ""}
              />
              {errors.pan && (
                <span className="error-message">{errors.pan}</span>
              )}
            </div>
          </div>
        </section>

        <section className="form-section">
          <h2>Contact Information</h2>
          <div className="grid-3">
            <div className="input-group">
              <input
                name="phone"
                value={form.phone}
                placeholder="Phone number (Required)"
                onChange={handleChange}
                required
                maxLength="10"
                className={errors.phone ? "error" : ""}
              />
              {errors.phone && (
                <span className="error-message">{errors.phone}</span>
              )}
            </div>

            <div className="input-group">
              <input
                name="alt_phone"
                value={form.alt_phone}
                placeholder="Alternate phone"
                onChange={handleChange}
                maxLength="10"
                className={errors.alt_phone ? "error" : ""}
              />
              {errors.alt_phone && (
                <span className="error-message">{errors.alt_phone}</span>
              )}
            </div>

            <div className="input-group">
              <input
                name="email"
                value={form.email}
                type="email"
                placeholder="Email (Required)"
                onChange={handleChange}
                required
                className={errors.email ? "error" : ""}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>
          </div>
          <div className="input-group">
            <textarea
              name="address"
              value={form.address}
              placeholder="Address"
              rows="3"
              onChange={handleChange}
            ></textarea>
          </div>
        </section>

        <section className="form-section">
          <h2>Emergency Information</h2>
          <div className="grid-3">
            <div className="input-group">
              <input
                name="emergency_contact_name"
                value={form.emergency_contact_name}
                placeholder="Contact name"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <input
                name="emergency_contact_no"
                value={form.emergency_contact_no}
                placeholder="Contact number"
                onChange={handleChange}
                maxLength="10"
                className={errors.emergency_contact_no ? "error" : ""}
              />
              {errors.emergency_contact_no && (
                <span className="error-message">
                  {errors.emergency_contact_no}
                </span>
              )}
            </div>

            <div className="input-group">
              <input
                name="emergency_relation"
                value={form.emergency_relation}
                placeholder="Relation"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="input-group">
            <textarea
              name="emergency_address"
              value={form.emergency_address}
              placeholder="Address"
              rows="3"
              onChange={handleChange}
            ></textarea>
          </div>
        </section>

        <section className="form-section">
          <h2>Professional Information</h2>
          <div className="grid-2">
            <div className="input-group">
              <input
                name="school"
                value={form.school}
                placeholder="School"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <input
                name="school_year"
                value={form.school_year}
                placeholder="Year of School Completion (e.g., 2020)"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <input
                name="college"
                value={form.college}
                placeholder="College"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <input
                name="college_year"
                value={form.college_year}
                placeholder="Year of College Completion (e.g., 2022)"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <input
                name="dept"
                value={form.dept}
                placeholder="Department"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className={errors.role ? "error" : ""}
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="team_leader">Team Leader</option>
                <option value="Manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
              {errors.role && (
                <span className="error-message">{errors.role}</span>
              )}
            </div>

            <div className="input-wrapper">
              <input
                name="doj"
                type="date"
                value={form.doj}
                onChange={handleChange}
                placeholder="YYYY-MM-DD"
                pattern="\d{4}-\d{2}-\d{2}"
              />
              <label htmlFor="dob">Date Of joining</label>
            </div>

            <div className="input-group">
              <input
                name="experience"
                type="number"
                step="0.01"
                value={form.experience}
                placeholder="Experience in years (e.g., 0.4 for 4 months)"
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </section>

        <div className="save-btn-container">
          <button type="submit" className="save-btn">
            {id ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;