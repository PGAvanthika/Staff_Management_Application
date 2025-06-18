const sql = require('../../config/db');

exports.getNotesForUser = async (userId) => {
  const notes = await sql`SELECT * FROM notes WHERE user_id = ${userId} ORDER BY position, created_at`;
  // Force due_date to string in YYYY-MM-DD for all notes
  return notes.map(note => ({
    ...note,
    due_date: note.due_date instanceof Date
      ? note.due_date.toISOString().split('T')[0]
      : note.due_date
  }));
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

  // Normalize due_date to YYYY-MM-DD string for DATE column
  let due_date = note.due_date;
  if (due_date instanceof Date) {
    due_date = due_date.toISOString().split('T')[0];
  } else if (typeof due_date === 'string' && due_date.length > 10) {
    due_date = due_date.split('T')[0];
  }
  // If it's already YYYY-MM-DD, leave as is

  console.log('notes.service.createNote: final content array:', content);
  console.log('notes.service.createNote: note object before insert:', {...note, content});
  console.log('notes.service.createNote: field types:', {
    user_id: typeof note.user_id,
    list_id: typeof note.list_id,
    title: typeof note.title,
    content: typeof content,
    due_date: typeof due_date,
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
      ${due_date},
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
  // Normalize due_date to YYYY-MM-DD string for DATE column
  let due_date = note.due_date;
  if (due_date instanceof Date) {
    due_date = due_date.toISOString().split('T')[0];
  } else if (typeof due_date === 'string' && due_date.length > 10) {
    due_date = due_date.split('T')[0];
  }
  // If it's already YYYY-MM-DD, leave as is

  const [updated] = await sql`
    UPDATE notes SET
      list_id = ${note.list_id},
      title = ${note.title},
      content = ${note.content},
      due_date = ${due_date},
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