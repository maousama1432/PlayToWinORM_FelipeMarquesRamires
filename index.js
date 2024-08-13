require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const conn = require('./db/conn');

const Usuario = require('./models/Usuario');
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
  try {
    const jogos = await Jogo.findAll({
      include: {
        model: Conquista,
        attributes: ['titulo', 'descricao']
      },
      raw: true, // Dados brutos
      nest: true // Nesting para associações
    });
    res.render('jogos', { jogos });
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    res.status(500).send('Erro ao buscar jogos');
  }
});

app.get('/jogos/novo', (req, res) => {
  res.render('formJogo');
});

app.post('/jogos/novo', async (req, res) => {
  try {
    const dadosJogo = {
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      precobase: req.body.precobase,
    };

    await Jogo.create(dadosJogo);
    res.redirect('/jogos');
  } catch (error) {
    console.error('Erro ao criar jogo:', error);
    res.status(500).send('Erro ao criar jogo');
  }
});

// Rotas para Conquistas
app.get('/jogos/{{this.id}}/novaConquista', async (req, res) => {
  try {
    const idJogo = parseInt(req.params.id);
    const jogo = await Jogo.findByPk(idJogo, { include: Conquista });

    if (!jogo) {
      return res.status(404).send('Jogo não encontrado');
    }

    res.render('conquistas', { conquistas: jogo.Conquistas });
  } catch (error) {
    console.error('Erro ao buscar conquistas:', error);
    res.status(500).send('Erro ao buscar conquistas');
  }
});

app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ raw: true });
    res.render('usuarios', { usuarios });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).send('Erro ao buscar usuários');
  }
});

app.get('/jogos/{{this.id}}/novaConquista', async (req, res) => {
  try {
    const idJogo = parseInt(req.params.id);
    const jogo = await Jogo.findByPk(idJogo);

    if (!jogo) {
      return res.status(404).send('Jogo não encontrado');
    }

    res.render('formConquista', { jogo });
  } catch (error) {
    console.error('Erro ao exibir formulário de conquista:', error);
    res.status(500).send('Erro ao exibir formulário de conquista');
  }
});

app.post('/jogos/{{this.id}}/novaConquista', async (req, res) => {
  try {
    const idJogo = parseInt(req.params.id);
    const dadosConquista = {
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      JogoId: idJogo,
    };

    await Conquista.create(dadosConquista);
    res.redirect(`/jogos/${idJogo}/conquista`);
  } catch (error) {
    console.error('Erro ao criar conquista:', error);
    res.status(500).send('Erro ao criar conquista');
  }
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
