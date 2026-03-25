import database from "../config/connection.js";
import { DataTypes } from "sequelize";

const Equipment = database.define(
  "Equipment",
  {
    nom: { type: DataTypes.STRING, allowNull: false },
    modele: { type: DataTypes.STRING, allowNull: false, defaultValue: "nouveau" },
    description: { type: DataTypes.TEXT, allowNull: true },
    image: { type: DataTypes.STRING, allowNull: true },
  },
  { timestamps: false }
);

export default Equipment;
