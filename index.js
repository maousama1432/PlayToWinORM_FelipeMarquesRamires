require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const conn = require('./db/conn');

const Usuario = require('./models/Usuario');
const Cartao = require('./models/Cartao');
const Jogo = require('./models/Jogo');
const Conquista = require('./models/Conquista');

// Definindo relacionamentos
Jogo.hasMany(Conquista);
Conquista.belongsTo(Jogo);

const app = express();

// Vinculação do Handlebars ao Express
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Configurações no express para facilitar a captura de dados recebidos de formulários
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rotas principais
app.get('/', (req, res) => {
  res.render('home');
});

// Rotas para Jogos
app.get('/jogos', async (req, res) => {
  const jogos = await Jogo.findAll({ include: Conquista });
  res.render('jogos', { jogos });
});

app.get('/jogos/novo', (req, res) => {
  res.render('formJogo');
});

app.post('/jogos/novo', async (req, res) => {
  const dadosJogo = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    precobase: req.body.precobase,
  };

  await Jogo.create(dadosJogo);
  res.redirect('/jogos');
});

// Rotas para Conquistas
app.get('/jogos/:id/conquistas', async (req, res) => {
  const idJogo = parseInt(req.params.id);
  const jogo = await Jogo.findByPk(idJogo, { include: Conquista });

  if (!jogo) {
    return res.status(404).send('Jogo não encontrado');
  }

  res.render('conquistas', { conquistas: jogo.Conquistas });
});

app.get('/jogos/:id/novaConquista', async (req, res) => {
  const idJogo = parseInt(req.params.id);
  const jogo = await Jogo.findByPk(idJogo);

  if (!jogo) {
    return res.status(404).send('Jogo não encontrado');
  }

  res.render('formConquista', { jogo });
});

app.post('/jogos/:id/novaConquista', async (req, res) => {
  const idJogo = parseInt(req.params.id);
  const dadosConquista = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    JogoId: idJogo,
  };

  await Conquista.create(dadosConquista);
  res.redirect(`/jogos/${idJogo}/conquistas`);
});

// Inicializando o servidor
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server rodando na porta ${PORT}`);
});

conn.sync()
  .then(() => {
    console.log('Conectado e sincronizado com o banco de dados!');
  })
  .catch((err) => {
    console.error(`Ocorreu um erro: ${err}`);
  });
