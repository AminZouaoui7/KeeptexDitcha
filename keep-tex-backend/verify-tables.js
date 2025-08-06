const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.POSTGRES_URI || 'postgres://postgres:1234@localhost:5433/keeptex'
});

async function verifyTables() {
  try {
    await client.connect();
    console.log('Connecté à PostgreSQL');

    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('Tables dans la base de données:');
    result.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });

    // Vérifier la structure de la table Articles si elle existe
    const articlesExists = result.rows.some(row => row.table_name === 'articles');
    if (articlesExists) {
      console.log('\nStructure de la table Articles:');
      const columns = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'articles'
        ORDER BY ordinal_position;
      `);
      columns.rows.forEach(col => {
        console.log(`- ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
      });
    } else {
      console.log('\nLa table Articles n\'existe pas encore.');
    }

  } catch (error) {
    console.error('Erreur:', error.message);
  } finally {
    await client.end();
  }
}

verifyTables();