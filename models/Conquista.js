const conn = require("../db/conn");
const { DataTypes } = require("sequelize");
const Jogo = require("./Jogo");

const Conquista = conn.define("Conquista", {
  titulo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Conquista.belongsTo(Jogo);
Jogo.hasMany(Conquista);

module.exports = Conquista;
