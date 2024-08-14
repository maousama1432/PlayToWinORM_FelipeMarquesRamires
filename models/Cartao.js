const conn = require("../db/conn");
const { DataTypes } = require("sequelize");

const Cartao = conn.define("Cartao", {
  numero: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  validade: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  titular: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Cartao;
