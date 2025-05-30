// UserForm.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserForm.css";

const UserForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({
    id: "", fname: "", lname: "", father_name: "", mother_name: "",
    dob: "", gender: "", blood_group: "", nationality: "", aadhar: "", pan: "",
    phone: "", alt_phone: "", email: "", address: "",
    emergency_contact_name: "", emergency_contact_no: "", emergency_relation: "", emergency_address: "",
    school: "", school_year: "", college: "", college_year: "",
    dept: "", role: "", doj: "", experience: ""
  });

  useEffect(() => {
    const validateUser = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/auth/validate", {
          withCredentials: true,
        });
        if (res.status === 200) {
          setIsLoading(false); // Token valid
        }
      } catch (error) {
        console.error("Auth validation failed:", error);
        alert("Session expired or unauthorized. Redirecting...");
        navigate("/");
      }
    };

    validateUser();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isValid = () => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(form.phone)) {
      alert("Invalid phone number");
      return false;
    }
    if (form.alt_phone && !phoneRegex.test(form.alt_phone)) {
      alert("Invalid alternate phone number");
      return false;
    }
    if (!form.email.includes("@")) {
      alert("Invalid email address");
      return false;
    }
    if (!form.id || !form.fname || !form.lname || !form.email || !form.role) {
      alert("Required fields cannot be empty");
      return false;
    }
    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isValid()) return;

    try {
      const res = await axios.post("http://localhost:3001/api/user/save", form, {
        withCredentials: true,
      });
      if (res.status === 200) {
        alert("User saved successfully!");
        navigate("/Adminhome");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to save user");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="user-form">
      <form className="form-container" onSubmit={handleSave}>
        <section className="form-section">
          <h2>Personal Information</h2>
          <div className="grid-2">
            <input name="id" placeholder="User ID (Required)" onChange={handleChange} required />
            <input name="fname" placeholder="First name" onChange={handleChange} required />
            <input name="lname" placeholder="Last name" onChange={handleChange} required />
            <input name="father_name" placeholder="Father’s name" onChange={handleChange} />
            <input name="mother_name" placeholder="Mother’s name" onChange={handleChange} />
            <input name="dob" type="date" onChange={handleChange} />
            <input name="gender" placeholder="Gender (M/F/O)" onChange={handleChange} />
            <input name="blood_group" placeholder="Blood group (e.g., A+)" onChange={handleChange} />
            <input name="nationality" placeholder="Nationality" onChange={handleChange} />
            <input name="aadhar" placeholder="Aadhar number" onChange={handleChange} />
            <input name="pan" placeholder="PAN number" onChange={handleChange} />
          </div>
        </section>

        <section className="form-section">
          <h2>Contact Information</h2>
          <div className="grid-3">
            <input name="phone" placeholder="Phone number (Required)" onChange={handleChange} required />
            <input name="alt_phone" placeholder="Alternate phone" onChange={handleChange} />
            <input name="email" type="email" placeholder="Email (Required)" onChange={handleChange} required />
          </div>
          <textarea name="address" placeholder="Address" rows="3" onChange={handleChange}></textarea>
        </section>

        <section className="form-section">
          <h2>Emergency Information</h2>
          <div className="grid-3">
            <input name="emergency_contact_name" placeholder="Contact name" onChange={handleChange} />
            <input name="emergency_contact_no" placeholder="Contact number" onChange={handleChange} />
            <input name="emergency_relation" placeholder="Relation" onChange={handleChange} />
          </div>
          <textarea name="emergency_address" placeholder="Address" rows="3" onChange={handleChange}></textarea>
        </section>

        <section className="form-section">
          <h2>Professional Information</h2>
          <div className="grid-2">
            <input name="school" placeholder="School" onChange={handleChange} />
            <input name="school_year" placeholder="Year of Completion" onChange={handleChange} />
            <input name="college" placeholder="College" onChange={handleChange} />
            <input name="college_year" placeholder="Year of Completion" onChange={handleChange} />
            <input name="dept" placeholder="Department" onChange={handleChange} />
            <input name="role" placeholder="Role (Required)" onChange={handleChange} required />
            <input name="doj" type="date" onChange={handleChange} />
            <input name="experience" placeholder="Experience" onChange={handleChange} />
          </div>
        </section>

        <div className="save-btn-container">
          <button type="submit" className="save-btn">Save</button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
