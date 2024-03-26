require("dotenv").config();
const conn = require("./db/conn");

const Usuario = require("./models/Usuario");

const express = require("express");
const app = express();

app.get("/usuarios/novo", (req, res) => {
  res.sendFile(`${__dirname}/views/formUsuario.html`);
});

app.post("/usuarios/novo", (req, res) => {
  const nickname = req.body.nickname;
  const name = req.body.nome;

  const dadosUsuario = {
    nickname,
    nome,
  };

  const usuario = Usuario.create(dadosUsuario);

  res.send("Usuário inserido sob o id" + usuario.id);
});

app.listen(8000);

conn
  .sync()
  .then(() => {
    console.log("Conectado e sincronizado!");
  })
  .catch((err) => {
    console.log("Ocorreu um erro: " + err);
  });