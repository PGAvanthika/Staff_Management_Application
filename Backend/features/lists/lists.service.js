const sql = require('../../config/db');

exports.getListsForUser = async (userId) => {
  return sql`SELECT * FROM lists WHERE user_id = ${userId} ORDER BY position, created_at`;
};

exports.createList = async ({ user_id, name, color, position }) => {
  const [list] = await sql`
    INSERT INTO lists (user_id, name, color, position)
    VALUES (${user_id}, ${name}, ${color || 'secondary'}, ${position || 0})
    RETURNING *
  `;
  return list;
};

exports.updateList = async (id, { name, color, position }) => {
  const [list] = await sql`
    UPDATE lists SET name = ${name}, color = ${color}, position = ${position}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return list;
};

exports.deleteList = async (id) => {
  await sql`DELETE FROM lists WHERE id = ${id}`;
}; 