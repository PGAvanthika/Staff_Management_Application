const bcrypt = require('bcrypt');
const sql = require('../../config/db');

const createUser = async (data) => {
  const defaultPassword = 'password';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  await sql`BEGIN`;

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
};

const getAllUsers = async (role) => {
  if (role) {
    return await sql`
      SELECT u.id, u.role, p.fname, p.lname
      FROM users u
      JOIN user_personal_info p ON u.id = p.id
      WHERE u.role = ${role}
    `;
  }

  return await sql`
    SELECT u.id, u.role, p.fname, p.lname
    FROM users u
    JOIN user_personal_info p ON u.id = p.id
  `;
};

const deleteUser = async (id) => {
  await sql`BEGIN`;
  await sql`DELETE FROM user_professional_info WHERE id = ${id}`;
  await sql`DELETE FROM user_contact_info WHERE id = ${id}`;
  await sql`DELETE FROM user_personal_info WHERE id = ${id}`;
  await sql`DELETE FROM users WHERE id = ${id}`;
  await sql`COMMIT`;
};

const getUserById = async (id) => {
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
    WHERE u.id = ${id}
  `;
  return result[0];
};

const updateUser = async (id, data) => {
  await sql`BEGIN`;

  await sql`
    UPDATE user_personal_info
    SET fname = ${data.fname}, lname = ${data.lname}, father_name = ${data.father_name},
        mother_name = ${data.mother_name}, dob = ${data.dob}, gender = ${data.gender},
        blood_group = ${data.blood_group}, nationality = ${data.nationality},
        aadhar = ${data.aadhar}, pan = ${data.pan}
    WHERE id = ${id}
  `;

  await sql`
    UPDATE user_contact_info
    SET phone_no = ${data.phone}, alternate_no = ${data.alt_phone}, email = ${data.email},
        address = ${data.address}, emergency_name = ${data.emergency_contact_name},
        emergency_num = ${data.emergency_contact_no}, emergency_relation = ${data.emergency_relation},
        emergency_address = ${data.emergency_address}
    WHERE id = ${id}
  `;

  await sql`
    UPDATE user_professional_info
    SET school = ${data.school}, school_completion_year = ${parseInt(data.school_year)},
        college = ${data.college}, college_completion_year = ${parseInt(data.college_year)},
        dept = ${data.dept}, prev_exp = ${parseInt(data.experience)}, date_of_joining = ${data.doj}
    WHERE id = ${id}
  `;

  await sql`COMMIT`;
};

module.exports = {
  createUser,
  getAllUsers,
  deleteUser,
  getUserById,
  updateUser,
};
