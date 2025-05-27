import React from "react";
import "./UserForm.css"; // Create a CSS file for custom styles
import { useNavigate } from "react-router-dom";



const UserForm = () => {
  const navigate = useNavigate();
  const handleSave = () => {
    navigate("/adminhome"); // ✅ redirect to AdminHome
  };
  return (
    <div className="user-form">
      <form className="form-container">
        {/* Personal Information */}
        <section className="form-section">
          <h2>Personal Information</h2>
          <div className="photo-upload">
            <input type="file" accept="image/*" />
          </div>
          <div className="grid-2">
            <input type="text" placeholder="First name" />
            <input type="text" placeholder="Last name" />
            <input type="text" placeholder="Father’s name" />
            <input type="text" placeholder="Mother’s name" />
            <input type="date" placeholder="DOB" />
            <input type="text" placeholder="Gender" />
            <input type="text" placeholder="Blood group" />
            <input type="text" placeholder="Nationality" />
            <input type="text" placeholder="Aadhar number" />
            <input type="text" placeholder="PAN number" />
          </div>
        </section>

        {/* Contact Information */}
        <section className="form-section">
          <h2>Contact Information</h2>
          <div className="grid-3">
            <input type="text" placeholder="Phone number" />
            <input type="text" placeholder="Alternate phone number" />
            <input type="email" placeholder="Email" />
          </div>
          <textarea placeholder="Address" rows="3"></textarea>
        </section>

        {/* Emergency Information */}
        <section className="form-section">
          <h2>Emergency Information</h2>
          <div className="grid-3">
            <input type="text" placeholder="Contact name" />
            <input type="text" placeholder="Contact number" />
            <input type="text" placeholder="Relation" />
          </div>
          <textarea placeholder="Address" rows="3"></textarea>
        </section>

        {/* Professional Information */}
        <section className="form-section">
          <h2>Professional Information</h2>
          <div className="grid-2">
            <input type="text" placeholder="School" />
            <input type="text" placeholder="Completion year" />
            <input type="text" placeholder="College" />
            <input type="text" placeholder="Completion year" />
            <input type="text" placeholder="Department" />
            <input type="text" placeholder="Role" />
            <input type="date" placeholder="Date of joining" />
            <input type="text" placeholder="Experience" />
          </div>
        </section>

        {/* Save Button */}
        <div className="save-btn-container">
          <button type="submit" className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
