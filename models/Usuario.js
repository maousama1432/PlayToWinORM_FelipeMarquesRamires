const conn = require("../db/conn");
const { DataTypes } = require("sequelize");

const Usuario = conn.define("Usuario", {
  nickname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Usuario;