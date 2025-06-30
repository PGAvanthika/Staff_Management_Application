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
      SELECT u.id, u.role, p.fname, p.lname, u.email
      FROM users u
      LEFT JOIN user_personal_info p ON u.id = p.id
      WHERE u.role = ${role}
    `;
  }

  return await sql`
    SELECT u.id, u.role, p.fname, p.lname, u.email
    FROM users u
    LEFT JOIN user_personal_info p ON u.id = p.id
  `;
};

const deleteUser = async (id) => {
  await sql`BEGIN`;
  const profResult = await sql`DELETE FROM user_professional_info WHERE id = ${id} RETURNING id`;
  const contactResult = await sql`DELETE FROM user_contact_info WHERE id = ${id} RETURNING id`;
  const personalResult = await sql`DELETE FROM user_personal_info WHERE id = ${id} RETURNING id`;
  const userResult = await sql`DELETE FROM users WHERE id = ${id} RETURNING id`;
  console.log('Delete results:', { profResult, contactResult, personalResult, userResult });
  if (
    profResult.length === 0 &&
    contactResult.length === 0 &&
    personalResult.length === 0 &&
    userResult.length === 0
  ) {
    await sql`ROLLBACK`;
    throw new Error('No user deleted. User may not exist.');
  }
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
  // Validate numbers
  const exp = parseInt(data.experience);
  const schoolYr = parseInt(data.school_year);
  const collegeYr = parseInt(data.college_year);
  if (isNaN(exp) || isNaN(schoolYr) || isNaN(collegeYr)) {
    throw new Error('Experience, school year, and college year must be valid numbers');
  }
  await sql`BEGIN`;

  // Update users table for role and email
  const userResult = await sql`
    UPDATE users
    SET email = ${data.email}, role = ${data.role}
    WHERE id = ${id}
    RETURNING id
  `;
  console.log('Users table update result:', userResult);
  if (userResult.length === 0) {
    await sql`ROLLBACK`;
    throw new Error('No user updated in users table. User may not exist.');
  }

  const personalResult = await sql`
    UPDATE user_personal_info
    SET fname = ${data.fname}, lname = ${data.lname}, father_name = ${data.father_name},
        mother_name = ${data.mother_name}, dob = ${data.dob}, gender = ${data.gender},
        blood_group = ${data.blood_group}, nationality = ${data.nationality},
        aadhar = ${data.aadhar}, pan = ${data.pan}
    WHERE id = ${id}
    RETURNING id
  `;
  console.log('Personal info update result:', personalResult);
  if (personalResult.length === 0) {
    await sql`ROLLBACK`;
    throw new Error('No personal info updated. User may not exist.');
  }

  const contactResult = await sql`
    UPDATE user_contact_info
    SET phone_no = ${data.phone}, alternate_no = ${data.alt_phone}, email = ${data.email},
        address = ${data.address}, emergency_name = ${data.emergency_contact_name},
        emergency_num = ${data.emergency_contact_no}, emergency_relation = ${data.emergency_relation},
        emergency_address = ${data.emergency_address}
    WHERE id = ${id}
    RETURNING id
  `;
  console.log('Contact info update result:', contactResult);
  if (contactResult.length === 0) {
    await sql`ROLLBACK`;
    throw new Error('No contact info updated. User may not exist.');
  }

  const professionalResult = await sql`
    UPDATE user_professional_info
    SET school = ${data.school}, school_completion_year = ${schoolYr},
        college = ${data.college}, college_completion_year = ${collegeYr},
        dept = ${data.dept}, prev_exp = ${exp}, date_of_joining = ${data.doj}
    WHERE id = ${id}
    RETURNING id
  `;
  console.log('Professional info update result:', professionalResult);
  if (professionalResult.length === 0) {
    await sql`ROLLBACK`;
    throw new Error('No professional info updated. User may not exist.');
  }

  await sql`COMMIT`;
};

module.exports = {
  createUser,
  getAllUsers,
  deleteUser,
  getUserById,
  updateUser,
};
