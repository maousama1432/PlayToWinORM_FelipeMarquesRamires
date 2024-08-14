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
      raw: true,
      nest: true
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
app.get('/jogos/:id/conquistas', async (req, res) => {
  try {
    const idJogo = parseInt(req.params.id);
    const jogo = await Jogo.findByPk(idJogo, { include: Conquista });

    if (!jogo) {
      return res.status(404).send('Jogo não encontrado');
    }

    res.render('conquistas', { conquistas: jogo.Conquistas, id: idJogo });
  } catch (error) {
    console.error('Erro ao buscar conquistas:', error);
    res.status(500).send('Erro ao buscar conquistas');
  }
});

app.get('/jogos/:id/novaConquista', async (req, res) => {
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

app.post('/jogos/:id/novaConquista', async (req, res) => {
  try {
    const idJogo = parseInt(req.params.id);
    const dadosConquista = {
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      JogoId: idJogo,
    };

    await Conquista.create(dadosConquista);
    res.redirect(`/jogos/${idJogo}/conquistas`);
  } catch (error) {
    console.error('Erro ao criar conquista:', error);
    res.status(500).send('Erro ao criar conquista');
  }
});

// Rotas para Usuários
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ raw: true });
    res.render('usuarios', { usuarios });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).send('Erro ao buscar usuários');
  }
});

app.get('/usuarios/novo', (req, res) => {
  res.render('formUsuario');
});

app.post('/usuarios/novo', async (req, res) => {
  try {
    const dadosUsuario = {
      nickname: req.body.nickname,
      nome: req.body.nome,
    };

    await Usuario.create(dadosUsuario);
    res.redirect('/usuarios');
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).send('Erro ao criar usuário');
  }
});

app.get('/usuarios/:id/update', async (req, res) => {
  try {
    const idUsuario = parseInt(req.params.id);
    const usuario = await Usuario.findByPk(idUsuario);

    if (!usuario) {
      return res.status(404).send('Usuário não encontrado');
    }

    res.render('formUsuario', { usuario });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).send('Erro ao buscar usuário');
  }
});

app.post('/usuarios/:id/update', async (req, res) => {
  try {
    const idUsuario = parseInt(req.params.id);
    const dadosUsuario = {
      nickname: req.body.nickname,
      nome: req.body.nome,
    };

    await Usuario.update(dadosUsuario, { where: { id: idUsuario } });
    res.redirect('/usuarios');
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).send('Erro ao atualizar usuário');
  }
});

app.post('/usuarios/:id/delete', async (req, res) => {
  try {
    const idUsuario = parseInt(req.params.id);
    await Usuario.destroy({ where: { id: idUsuario } });
    res.redirect('/usuarios');
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).send('Erro ao excluir usuário');
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
