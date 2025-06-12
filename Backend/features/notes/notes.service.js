const sql = require('../../config/db');

exports.getNotesForUser = async (userId) => {
  return sql`SELECT * FROM notes WHERE user_id = ${userId} ORDER BY position, created_at`;
};

exports.createNote = async (note) => {
  // Defensive: ensure content is an array
  let content = note.content;
  if (typeof content === "string") {
    content = [content];
  }
  if (!Array.isArray(content)) {
    content = [String(content)];
  }
  console.log('notes.service.createNote: final content array:', content);
  console.log('notes.service.createNote: note object before insert:', {...note, content});
  console.log('notes.service.createNote: field types:', {
    user_id: typeof note.user_id,
    list_id: typeof note.list_id,
    title: typeof note.title,
    content: typeof content,
    due_date: typeof note.due_date,
    due_time: typeof note.due_time,
    duration_minutes: typeof note.duration_minutes,
    completed: typeof note.completed,
    position: typeof note.position
  });
  const [created] = await sql`
    INSERT INTO notes (user_id, list_id, title, content, due_date, due_time, duration_minutes, completed, position)
    VALUES (
      ${note.user_id},
      ${note.list_id},
      ${note.title},
      ${content},
      ${note.due_date},
      ${note.due_time},
      ${note.duration_minutes || 30},
      ${note.completed || false},
      ${note.position || 0}
    )
    RETURNING *
  `;
  console.log('notes.service.createNote: created note:', created);
  return created;
};

exports.updateNote = async (id, note) => {
  const [updated] = await sql`
    UPDATE notes SET
      list_id = ${note.list_id},
      title = ${note.title},
      content = ${note.content},
      due_date = ${note.due_date},
      due_time = ${note.due_time},
      duration_minutes = ${note.duration_minutes},
      completed = ${note.completed},
      position = ${note.position},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return updated;
};

exports.deleteNote = async (id) => {
  await sql`DELETE FROM notes WHERE id = ${id}`;
}; 