const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:passeradmin@localhost:5432/bd_ard_zig?schema=public',
});

async function main() {
  await client.connect();
  const res = await client.query(
    'SELECT id, titre, "fichier", "format", "taille" FROM documents ORDER BY "createdAt" DESC LIMIT 5'
  );
  console.log('=== 5 derniers documents ===');
  for (const r of res.rows) {
    console.log('---');
    console.log('titre:', r.titre);
    console.log('fichier:', r.fichier);
    console.log('format:', r.format, '| taille:', r.taille);
  }
  await client.end();
}

main().catch((e) => {
  console.error('ERREUR:', e.message);
  process.exit(1);
});