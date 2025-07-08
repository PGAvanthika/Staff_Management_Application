const logActivity = require('../../utils/activityLogger');
const userService = require('./user.service');

function validateEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

function validateUserData(data) {
  const required = [
    'id', 'email', 'role', 'fname', 'lname', 'father_name', 'mother_name',
    'dob', 'gender', 'blood_group', 'nationality', 'aadhar', 'pan',
    'phone', 'alt_phone', 'address', 'emergency_contact_name',
    'emergency_contact_no', 'emergency_relation', 'emergency_address',
    'school', 'college', 'dept', 'college_year', 'school_year',
    'experience', 'doj'
  ];
  for (const field of required) {
    if (!data[field]) return `Missing required field: ${field}`;
  }
  if (!validateEmail(data.email)) return 'Invalid email format';
  return null;
}

exports.createUser = async (req, res) => {
  const data = req.body;
  const validationError = validateUserData(data);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }
  try {
    await userService.createUser(data); // No must_change_password
    await logActivity(req.user.userId, `Created user ${data.id}`);
    res.status(200).json({ message: "User created successfully with default password" });
  } catch (err) {
    try { await sql`ROLLBACK`; } catch (e) {}
    console.error('Create user error:', err);
    res.status(500).json({ error: `Failed to save user. Transaction rolled back. ${err.message}` });
  }
};

exports.getAllUsers = async (req, res) => {
  const allowedRoles = ['Admin', 'Manager', 'team_leader', 'employee'];
  const { role } = req.query;
  if (role && !allowedRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role filter' });
  }
  try {
    const users = await userService.getAllUsers(role);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Failed to fetch users: ${err.message}` });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await userService.deleteUser(userId);
    await logActivity(req.user.userId, `Deleted user ${userId}`);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    try { await sql`ROLLBACK`; } catch (e) {}
    console.error('Delete user error:', err);
    res.status(500).json({ error: err.message || "Failed to delete user" });
  }
};

exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userService.getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Failed to fetch user data: ${err.message}` });
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const data = req.body;
  const validationError = validateUserData(data);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }
  try {
    await userService.updateUser(userId, data);
    await logActivity(req.user.userId, `Updated user ${userId}`);
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    try { await sql`ROLLBACK`; } catch (e) {}
    console.error('Update user error:', err);
    res.status(500).json({ error: err.message || "Failed to update user. Transaction rolled back." });
  }
};
