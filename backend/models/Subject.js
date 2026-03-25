import database from "../config/connection.js";
import { DataTypes } from "sequelize";

const Subject = database.define(
  "Subject",
  {
    nom: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    statut: { type: DataTypes.STRING, allowNull: false, defaultValue: "requis" },
    image: { type: DataTypes.STRING, allowNull: true },
  },
  { timestamps: false }
);

export default Subject;
