const express = require('express');
const multer = require('multer');
const path = require('path');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const db = require('./db');

const app = express();
const port = 3000;

// Configuração AWS (usando IAM Role da instância EC2)
aws.config.update({ region: 'us-east-1' });
const s3 = new aws.S3();
const bucketName = 'meu-portifolio-leandro-123321';

// Configuração do multer para upload no S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const filename = Date.now().toString() + path.extname(file.originalname);
      cb(null, filename);
    }
  })
});

// Configuração do Express
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Página inicial
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Rota de cadastro
app.post('/api/funcionarios', upload.single('foto'), (req, res) => {
  const { nome, cargo } = req.body;
  const fotoUrl = req.file.location;

  const sql = 'INSERT INTO funcionarios (nome, cargo, foto_url) VALUES (?, ?, ?)';
  db.query(sql, [nome, cargo, fotoUrl], (err, result) => {
    if (err) {
      console.error('❌ Erro ao salvar no banco:', err);
      return res.status(500).send('Erro ao salvar no banco');
    }

    res.send(`
      <html>
        <head><title>Sucesso</title></head>
        <body style="font-family:sans-serif;text-align:center;padding-top:50px">
          <h1>✅ Funcionário cadastrado com sucesso!</h1>
          <a href="/" style="display:inline-block;margin-top:20px;padding:10px 20px;background:#222;color:#fff;text-decoration:none;border-radius:5px">Novo Cadastro</a>
        </body>
      </html>
    `);
  });
});

// Iniciar servidor escutando em todas as interfaces
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando em http://0.0.0.0:${port}`);
});
