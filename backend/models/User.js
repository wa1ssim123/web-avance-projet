import database from "../config/connection.js";
import { DataTypes } from "sequelize";

const User = database.define(
  "User",
  {
    nom: { type: DataTypes.STRING, allowNull: false },
    prenom: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    mot_de_passe: { type: DataTypes.STRING, allowNull: false },
    naissance: { type: DataTypes.DATEONLY, allowNull: true },
    biographie: { type: DataTypes.TEXT, allowNull: true },
    conduite: { type: DataTypes.STRING, allowNull: true },
    photo: { type: DataTypes.STRING, allowNull: true },
  },
  { timestamps: false }
);

export default User;
