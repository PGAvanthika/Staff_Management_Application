const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const sql = require('../config/db');

router.post('/save', async (req, res) => {
  const data = req.body;

  try {
    await sql`BEGIN`;
    const defaultPassword = 'password';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Insert into users table
    await sql`
      INSERT INTO users (id, email, password, role)
      VALUES (${data.id}, ${data.email}, ${hashedPassword}, ${data.role})
    `;

    // Insert into user_personal_info
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

    // Insert into user_contact_info
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


    // Insert into user_professional_info
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
    try {
      await sql`ROLLBACK`;
    } catch (rollbackError) {
      console.error('Rollback failed:', rollbackError);
    }

    console.error('Transaction failed:', err);
    res.status(500).json({ error: "Failed to save user. Transaction rolled back." });
  }
});

// In user.js backend route
router.get('/all', async (req, res) => {
  try {
    const users = await sql`
      SELECT u.id, u.role, p.fname, p.lname
      FROM users u
      JOIN user_personal_info p ON u.id = p.id
    `;
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});



module.exports = router;
