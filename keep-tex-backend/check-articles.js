const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.POSTGRES_URI || 'postgres://postgres:1234@localhost:5433/keeptex'
});

async function checkArticlesTable() {
  try {
    await client.connect();
    console.log('✅ Connecté à PostgreSQL');

    // Vérifier si la table Articles existe
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Articles'
      );
    `);

    if (tableExists.rows[0].exists) {
      console.log('✅ La table Articles existe dans la base de données');

      // Obtenir la structure de la table
      const columns = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'Articles'
        ORDER BY ordinal_position;
      `);

      console.log('\n📋 Structure de la table Articles:');
      columns.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
      });

      // Compter les enregistrements
      const count = await client.query('SELECT COUNT(*) as total FROM "Articles"');
      console.log(`\n📊 Nombre d'enregistrements: ${count.rows[0].total}`);

    } else {
      console.log('❌ La table Articles n\'existe pas');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.end();
  }
}

checkArticlesTable();