const sql = require('../../config/db');

const addStatusColumn = async () => {
  try {
    // Create dues table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS dues (
        due_id SERIAL PRIMARY KEY,
        emp_id VARCHAR(50) NOT NULL,
        tl_id VARCHAR(50) NOT NULL,
        project_id VARCHAR(50) NOT NULL,
        task_id VARCHAR(50) NOT NULL,
        to_manager VARCHAR(50) NOT NULL,
        no_of_days INTEGER NOT NULL,
        reason TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (emp_id) REFERENCES users(id),
        FOREIGN KEY (tl_id) REFERENCES users(id),
        FOREIGN KEY (to_manager) REFERENCES users(id),
        FOREIGN KEY (project_id) REFERENCES projects(project_id),
        FOREIGN KEY (task_id) REFERENCES tasks(task_id)
      );
    `;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addStatusColumn
}; 