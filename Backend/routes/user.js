const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const sql = require('../config/db');
const { isLoggedIn, isAdmin } = require('../middlewares/authMiddleware');

// Save user
router.post('/save', isLoggedIn, isAdmin, async (req, res) => {
  const data = req.body;

  try {
    await sql`BEGIN`;
    const defaultPassword = 'password';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    await sql`
      INSERT INTO users (id, email, password, role)
      VALUES (${data.id}, ${data.email}, ${hashedPassword}, ${data.role})
    `;

    await sql`
      INSERT INTO user_personal_info (
        id, fname, lname, father_Name, mother_Name, dob, gender,
        blood_group, nationality, aadhar, pan
      ) VALUES (
        ${data.id}, ${data.fname}, ${data.lname}, ${data.father_name}, ${data.mother_name},
        ${data.dob}, ${data.gender}, ${data.blood_group}, ${data.nationality},
        ${data.aadhar}, ${data.pan}
      )
    `;

    await sql`
      INSERT INTO user_contact_info (
        id, phone_no, alternate_no, email, address,
        emergency_name, emergency_num, emergency_relation, emergency_address
      ) VALUES (
        ${data.id}, ${data.phone}, ${data.alt_phone}, ${data.email}, ${data.address},
        ${data.emergency_contact_name}, ${data.emergency_contact_no},
        ${data.emergency_relation}, ${data.emergency_address}
      )
    `;

    await sql`
      INSERT INTO user_professional_info (
        id, school, college, dept, college_completion_year, school_completion_year,
        prev_exp, date_of_joining
      ) VALUES (
        ${data.id}, ${data.school}, ${data.college}, ${data.dept},
        ${parseInt(data.college_year)}, ${parseInt(data.school_year)},
        ${parseInt(data.experience)}, ${data.doj}
      )
    `;

    await sql`COMMIT`;

    res.status(200).json({ message: "User created successfully with default password" });
  } catch (err) {
    await sql`ROLLBACK`;
    console.error('Transaction failed:', err);
    res.status(500).json({ error: "Failed to save user. Transaction rolled back." });
  }
});

// Get all users
router.get('/all', isLoggedIn, isAdmin, async (req, res) => {
  try {
    const { role } = req.query;
    let users;

    if (role) {
      users = await sql`
        SELECT u.id, u.role, p.fname, p.lname
        FROM users u
        JOIN user_personal_info p ON u.id = p.id
        WHERE u.role = ${role}
      `;
    } else {
      users = await sql`
        SELECT u.id, u.role, p.fname, p.lname
        FROM users u
        JOIN user_personal_info p ON u.id = p.id
      `;
    }

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Delete user by ID
router.delete('/:id', isLoggedIn, isAdmin, async (req, res) => {
  const userId = req.params.id;

  try {
    console.log("Authenticated user:", req.user); // Log the authenticated user
    console.log("Deleting user ID:", userId);

    await sql`BEGIN`;
    await sql`DELETE FROM user_professional_info WHERE id = ${userId}`;
    await sql`DELETE FROM user_contact_info WHERE id = ${userId}`;
    await sql`DELETE FROM user_personal_info WHERE id = ${userId}`;
    await sql`DELETE FROM users WHERE id = ${userId}`;
    await sql`COMMIT`;

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    await sql`ROLLBACK`;
    console.error('Error deleting user:', err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// user.js - Get a user by ID for editing
router.get('/:id', isLoggedIn, isAdmin, async (req, res) => {
  const userId = req.params.id;

  try {
    // Query to get the user's full information
    const result = await sql`
      SELECT u.id, u.role, p.fname, p.lname, p.father_name, p.mother_name, p.dob,
             p.gender, p.blood_group, p.nationality, p.aadhar, p.pan,
             c.phone_no, c.alternate_no, c.email, c.address, c.emergency_name,
             c.emergency_num, c.emergency_relation, c.emergency_address,
             pr.school, pr.school_completion_year, pr.college, pr.college_completion_year,
             pr.dept, pr.date_of_joining, pr.prev_exp
      FROM users u
      JOIN user_personal_info p ON u.id = p.id
      JOIN user_contact_info c ON u.id = c.id
      JOIN user_professional_info pr ON u.id = pr.id
      WHERE u.id = ${userId}
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// user.js

// Update user
router.put('/update/:id', isLoggedIn, isAdmin, async (req, res) => {
  const userId = req.params.id;
  const data = req.body;

  try {
    await sql`BEGIN`;

    // Update user_personal_info
    await sql`
      UPDATE user_personal_info
      SET fname = ${data.fname}, lname = ${data.lname}, father_name = ${data.father_name},
          mother_name = ${data.mother_name}, dob = ${data.dob}, gender = ${data.gender},
          blood_group = ${data.blood_group}, nationality = ${data.nationality},
          aadhar = ${data.aadhar}, pan = ${data.pan}
      WHERE id = ${userId}
    `;

    // Update user_contact_info
    await sql`
      UPDATE user_contact_info
      SET phone_no = ${data.phone}, alternate_no = ${data.alt_phone}, email = ${data.email},
          address = ${data.address}, emergency_name = ${data.emergency_contact_name},
          emergency_num = ${data.emergency_contact_no}, emergency_relation = ${data.emergency_relation},
          emergency_address = ${data.emergency_address}
      WHERE id = ${userId}
    `;

    // Update user_professional_info
    await sql`
      UPDATE user_professional_info
      SET school = ${data.school}, school_completion_year = ${parseInt(data.school_year)},
          college = ${data.college}, college_completion_year = ${parseInt(data.college_year)},
          dept = ${data.dept}, prev_exp = ${parseInt(data.experience)}, date_of_joining = ${data.doj}
      WHERE id = ${userId}
    `;

    await sql`COMMIT`;

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    await sql`ROLLBACK`;
    console.error('Transaction failed:', err);
    res.status(500).json({ error: "Failed to update user. Transaction rolled back." });
  }
});


module.exports = router;
