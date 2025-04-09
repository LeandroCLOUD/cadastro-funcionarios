const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'database-1.cgfigk2i4orz.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'yMhYXk6Kd4znFj7ovlQ0',
  database: 'cadastro'
});

connection.connect(err => {
  if (err) {
    console.error('❌ Erro ao conectar no banco:', err);
  } else {
    console.log('🟢 Conectado ao MySQL com sucesso!');
  }
});

module.exports = connection;

