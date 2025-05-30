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

  const fetchUserById = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/user/${id}`, {
        withCredentials: true,
      });
      const user = res.data;

      setForm({
        id: user.id,
        fname: user.fname || "",
        lname: user.lname || "",
        father_name: user.father_name || "",
        mother_name: user.mother_name || "",
        dob: user.dob || "",
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
        doj: user.date_of_joining?.split("T")[0] || "", // strip time if present
        experience: user.prev_exp || "",
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
      alert("Failed to load user data");
    }
  };

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
      const url = id
        ? `http://localhost:3001/api/user/update/${id}`
        : `http://localhost:3001/api/user/save`;

      const method = id ? axios.put : axios.post;

      const res = await method(url, form, {
        withCredentials: true,
      });

      if (res.status === 200) {
        alert(`User ${id ? "updated" : "saved"} successfully!`);
        navigate("/adminhome");
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
            <input name="id" value={form.id} placeholder="User ID (Required)" onChange={handleChange} required readOnly={!!id} />
            <input name="fname" value={form.fname} placeholder="First name" onChange={handleChange} required />
            <input name="lname" value={form.lname} placeholder="Last name" onChange={handleChange} required />
            <input name="father_name" value={form.father_name} placeholder="Father’s name" onChange={handleChange} />
            <input name="mother_name" value={form.mother_name} placeholder="Mother’s name" onChange={handleChange} />
            <input name="dob" type="date" value={form.dob} onChange={handleChange} />
            <input name="gender" value={form.gender} placeholder="Gender (M/F/O)" onChange={handleChange} />
            <input name="blood_group" value={form.blood_group} placeholder="Blood group (e.g., A+)" onChange={handleChange} />
            <input name="nationality" value={form.nationality} placeholder="Nationality" onChange={handleChange} />
            <input name="aadhar" value={form.aadhar} placeholder="Aadhar number" onChange={handleChange} />
            <input name="pan" value={form.pan} placeholder="PAN number" onChange={handleChange} />
          </div>
        </section>

        <section className="form-section">
          <h2>Contact Information</h2>
          <div className="grid-3">
            <input name="phone" value={form.phone} placeholder="Phone number (Required)" onChange={handleChange} required />
            <input name="alt_phone" value={form.alt_phone} placeholder="Alternate phone" onChange={handleChange} />
            <input name="email" value={form.email} type="email" placeholder="Email (Required)" onChange={handleChange} required />
          </div>
          <textarea name="address" value={form.address} placeholder="Address" rows="3" onChange={handleChange}></textarea>
        </section>

        <section className="form-section">
          <h2>Emergency Information</h2>
          <div className="grid-3">
            <input name="emergency_contact_name" value={form.emergency_contact_name} placeholder="Contact name" onChange={handleChange} />
            <input name="emergency_contact_no" value={form.emergency_contact_no} placeholder="Contact number" onChange={handleChange} />
            <input name="emergency_relation" value={form.emergency_relation} placeholder="Relation" onChange={handleChange} />
          </div>
          <textarea name="emergency_address" value={form.emergency_address} placeholder="Address" rows="3" onChange={handleChange}></textarea>
        </section>

        <section className="form-section">
          <h2>Professional Information</h2>
          <div className="grid-2">
            <input name="school" value={form.school} placeholder="School" onChange={handleChange} />
            <input name="school_year" value={form.school_year} placeholder="Year of Completion" onChange={handleChange} />
            <input name="college" value={form.college} placeholder="College" onChange={handleChange} />
            <input name="college_year" value={form.college_year} placeholder="Year of Completion" onChange={handleChange} />
            <input name="dept" value={form.dept} placeholder="Department" onChange={handleChange} />
            <input name="role" value={form.role} placeholder="Role (Required)" onChange={handleChange} required />
            <input name="doj" type="date" value={form.doj} onChange={handleChange} />
            <input name="experience" value={form.experience} placeholder="Experience" onChange={handleChange} />
          </div>
        </section>

        <div className="save-btn-container">
          <button type="submit" className="save-btn">{id ? "Update" : "Save"}</button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
