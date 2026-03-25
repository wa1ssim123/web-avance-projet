import database from "../config/connection.js";
import { DataTypes } from "sequelize";

const Laboratory = database.define(
  "Laboratory",
  {
    nom: { type: DataTypes.STRING, allowNull: false },
    salle: { type: DataTypes.STRING, allowNull: true },
    information: { type: DataTypes.TEXT, allowNull: true },
    image: { type: DataTypes.STRING, allowNull: true },
  },
  { timestamps: false }
);

export default Laboratory;
