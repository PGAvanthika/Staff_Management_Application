const logActivity = require('../../utils/activityLogger');
const userService = require('./user.service');

exports.createUser = async (req, res) => {
  const data = req.body;
  try {
    await userService.createUser(data);
    await logActivity(req.user.userId, `Created user ${data.id}`);
    res.status(200).json({ message: "User created successfully with default password" });
  } catch (err) {
    await sql`ROLLBACK`;
    console.error('Create user error:', err);
    res.status(500).json({ error: "Failed to save user. Transaction rolled back." });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers(req.query.role);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await userService.deleteUser(userId);
    await logActivity(req.user.userId, `Deleted user ${userId}`);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    await sql`ROLLBACK`;
    console.error('Delete user error:', err);
    res.status(500).json({ error: "Failed to delete user" });
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
    res.status(500).json({ error: "Failed to fetch user data" });
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const data = req.body;
  try {
    await userService.updateUser(userId, data);
    await logActivity(req.user.userId, `Updated user ${userId}`);
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    await sql`ROLLBACK`;
    console.error('Update user error:', err);
    res.status(500).json({ error: "Failed to update user. Transaction rolled back." });
  }
};
