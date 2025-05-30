import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserForm.css";


const UserForm = ({ readOnly = false, userData = {} }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: userData.id || "",
    fname: userData.fname || "",
    lname: userData.lname || "",
    father_name: userData.father_name || "",
    mother_name: userData.mother_name || "",
    dob: userData.dob || "",
    gender: userData.gender || "",
    blood_group: userData.blood_group || "",
    nationality: userData.nationality || "",
    aadhar: userData.aadhar || "",
    pan: userData.pan || "",
    phone: userData.phone || "",
    alt_phone: userData.alt_phone || "",
    email: userData.email || "",
    address: userData.address || "",
    emergency_contact_name: userData.emergency_contact_name || "",
    emergency_contact_no: userData.emergency_contact_no || "",
    emergency_relation: userData.emergency_relation || "",
    emergency_address: userData.emergency_address || "",
    school: userData.school || "",
    school_year: userData.school_year || "",
    college: userData.college || "",
    college_year: userData.college_year || "",
    dept: userData.dept || "",
    role: userData.role || "",
    doj: userData.doj || "",
    experience: userData.experience || ""
  });

  const handleChange = (e) => {
    if (!readOnly) {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
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
      const res = await axios.post("http://localhost:3001/api/user/save", form);
      if (res.status === 200) {
        alert("User saved successfully!");
        navigate("/Adminhome");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to save user");
    }
  };

  return (
<div className={`user-form ${readOnly ? 'read-only' : 'edit-mode'}`}>


    <div className="user-form">
      <ion-icon
        name="chevron-back-outline"
        onClick={() => navigate(-1)}
        style={{ cursor: "pointer", fontSize: "24px" }}
      >
        {" "}
      </ion-icon>

      <form className="form-container" onSubmit={handleSave}>
        {readOnly && (
          <div className="read-only-banner">
            <p>View Only Mode</p>
          </div>
        )}
        {/* Personal Info */}
        <section className="form-section">
          <h2>Personal Information</h2>
          <div className="grid-2">
            <div className="photo-upload">
              <label htmlFor="photo">Upload Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
              readOnly={readOnly}
              value={form.id}
                name="photo"
              />
            </div>
            <input
              name="id"
              placeholder="User ID (Required)"
              onChange={handleChange}
              required
            />

            <select name="gender" onChange={handleChange} value={form.gender} disabled={readOnly}>
              <option value="" disabled>
                Gender
              </option>
              <option value="M">Male (M)</option>
              <option value="F">Female (F)</option>
              <option value="O">Other (O)</option>
            </select>

            <input
              name="fname"
              placeholder="First name"
              onChange={handleChange}
              readOnly={readOnly}
              value={form.fname}
              required
            />
            <input
              name="lname"
              placeholder="Last name"
              onChange={handleChange}
              readOnly={readOnly}
              value={form.lname}
              required
            />
            <input
              name="father_name"
              placeholder="Father’s name"
              onChange={handleChange}
              readOnly={readOnly}
              value={form.father_name}
            />
            <input
              name="mother_name"
              placeholder="Mother’s name"
              onChange={handleChange}
              readOnly={readOnly}
              value={form.mother_name}
            />

            <input
              name="blood_group"
              placeholder="Blood group (e.g., A+)"
              onChange={handleChange}
              readOnly={readOnly}
              value={form.blood_group}
            />

            <input
              name="nationality"
              placeholder="Nationality"
              onChange={handleChange}
              readOnly={readOnly}
              value={form.nationality}
            />
            <input
              name="aadhar"
              placeholder="Aadhar number"
              onChange={handleChange}
              readOnly={readOnly}
              value={form.aadhar}
            />
            <input
              name="pan"
              placeholder="PAN number"
              onChange={handleChange}
              readOnly={readOnly}
              value={form.pan}
            />

            <div className="input-wrapper">
              <input
                name="dob"
                type="date"
                onChange={handleChange}
                readOnly={readOnly}
                value={form.dob}
                placeholder="YYYY-MM-DD"
                pattern="\d{4}-\d{2}-\d{2}"
              />
              <label htmlFor="dob">Date Of Birth</label>
            </div>

          </div>
        </section>

        {/* Contact */}
        <section className="form-section">
          <h2>Contact Information</h2>
          <div className="grid-3">
            <input
              name="phone"
              placeholder="Phone number (Required)"
              onChange={handleChange}
              readOnly={readOnly}
              value={form.phone}
              required
            />
            <input
              name="alt_phone"
              placeholder="Alternate phone"
              onChange={handleChange}
              readOnly={readOnly}
              value={form.alt_phone}
            />
            <input
              name="email"
              type="email"
              placeholder="Email (Required)"
              onChange={handleChange}
              readOnly={readOnly}
              value={form.email}
              required
            />
          </div>
          <textarea
            name="address"
            placeholder="Address"
            rows="3"
            onChange={handleChange}
            readOnly={readOnly}
            value={form.address}
            className="address-box"
          ></textarea>
        </section>

        {/* Emergency */}
        <section className="form-section">
          <h2>Emergency Information</h2>
          <div className="grid-3">
            <input
              name="emergency_contact_name"
              placeholder="Contact name"
              onChange={handleChange}
              readOnly={readOnly}
              value={form.emergency_contact_name}
            />
            <input
              name="emergency_contact_no"
              placeholder="Contact number"
              onChange={handleChange}
              readOnly={readOnly}
              value={form.emergency_contact_no}
            />
            <input
              name="emergency_relation"
              placeholder="Relation"
              onChange={handleChange}
              readOnly={readOnly}
              value={form.emergency_relation}
            />
          </div>
          <textarea
            name="emergency_address"
            placeholder="Address"
            rows="3"
            onChange={handleChange}
            readOnly={readOnly}
            value={form.emergency_address}
            className="address-box"
          ></textarea>
        </section>

        {/* Professional */}
        <section className="form-section">
          <h2>Professional Information</h2>
          <div className="grid-2">
            <input name="school" placeholder="School" onChange={handleChange} readOnly={readOnly} value={form.school} />
            <input
              name="school_year"
              placeholder="Year of Completion"
              onChange={handleChange}
              readOnly={readOnly}
              value={form.school_year}
            />
            <input
              name="college"
              placeholder="College"
              onChange={handleChange}
              readOnly={readOnly}
              value={form.college}
            />
            <input
              name="college_year"
              placeholder="Year of Completion"
              onChange={handleChange}
              readOnly={readOnly}
              value={form.college_year}
            />
            <input
              name="dept"
              placeholder="Department"
              onChange={handleChange}
              readOnly={readOnly}
              value={form.dept}
            />

            <select name="role" onChange={handleChange} value={form.role} disabled={readOnly}>
              <option value="" disabled>
                Role
              </option>
              <option value="A">Admin </option>
              <option value="M">Manager </option>
              <option value="TL">Team Leader </option>
              <option value="FD">Frontend Developer </option>
              <option value="FD">Backend Developer </option>
              <option value="I">Intern </option>
            </select>

            <div className="input-wrapper">
              <input
                name="doj"
                type="date"
                onChange={handleChange}
                readOnly={readOnly}
                value={form.doj}
                placeholder="YYYY-MM-DD"
                pattern="\d{4}-\d{2}-\d{2}"
              />
              <label htmlFor="doj">Date Of joining</label>
            </div>
          </div>
        </section>

        {!readOnly && (
          <div className="save-btn-container">
            <button type="submit" className="save-btn">
              Save
            </button>
          </div>
        )}
      </form>
    </div>
    </div>
  );
};

export default UserForm;
