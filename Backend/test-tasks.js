const sql = require('./config/db');

async function testTasksTable() {
  try {
    console.log('=== TESTING TASKS TABLE ===');
    
    // Check table structure
    const structureQuery = `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'tasks'
      ORDER BY ordinal_position;
    `;
    
    const structure = await sql.query(structureQuery);
    console.log('Tasks table structure:', structure);
    
    // Check sample data
    const sampleData = await sql.query('SELECT * FROM tasks LIMIT 5');
    console.log('Sample tasks data:', sampleData);
    
    // Check task statuses
    const statusQuery = `
      SELECT task_status, COUNT(*) as count
      FROM tasks 
      GROUP BY task_status;
    `;
    
    const statuses = await sql.query(statusQuery);
    console.log('Task statuses:', statuses);
    
    // Test the KPI query with a sample user
    const kpiQuery = `
      SELECT 
        t.task_id,
        t.task_status,
        t.deadline,
        CASE 
          WHEN t.task_status = 'completed' THEN 'completed'
          WHEN t.task_status = 'overdue' THEN 'overdue'
          WHEN t.task_status IN ('assigned', 'in_progress', 'in-progress') THEN 'active'
          ELSE 'other'
        END as completion_status
      FROM tasks t
      WHERE t.assigned_to = $1
    `;
    
    // Get a sample user ID
    const users = await sql.query('SELECT id FROM users LIMIT 1');
    if (users.length > 0) {
      const userId = users[0].id;
      console.log('Testing KPI query with user ID:', userId);
      
      const kpiResult = await sql.query(kpiQuery, [userId]);
      console.log('KPI query result:', kpiResult);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testTasksTable(); 