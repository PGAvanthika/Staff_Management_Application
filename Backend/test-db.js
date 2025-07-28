const sql = require('./config/db');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic query
    const result = await sql.query('SELECT NOW() as current_time');
    console.log('Database connection successful!');
    console.log('Current time from DB:', result[0].current_time);
    
    // Test tasks table
    const tasksResult = await sql.query('SELECT COUNT(*) as task_count FROM tasks');
    console.log('Tasks table accessible. Total tasks:', tasksResult[0].task_count);
    
  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.error('Please check your database credentials in .env file');
  }
}

testConnection(); 