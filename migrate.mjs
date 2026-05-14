import mysql from 'mysql2/promise';

async function run() {
  const con = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'porte_blinde_menuiserie',
    port: 3306
  });
  try {
    await con.execute('ALTER TABLE orders ADD COLUMN phone VARCHAR(50)');
    console.log('Added phone');
  } catch (e) {
    console.log('Phone already exists or error', e.message);
  }
  try {
    await con.execute('ALTER TABLE orders ADD COLUMN address TEXT');
    console.log('Added address');
  } catch (e) {
    console.log('Address already exists or error', e.message);
  }
  console.log('Done');
  process.exit(0);
}
run().catch(console.error);
