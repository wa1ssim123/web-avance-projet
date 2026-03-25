import database from "../config/connection.js";
import { DataTypes } from "sequelize";

const Department = database.define(
  "Department",
  {
    nom: { type: DataTypes.STRING, allowNull: false },
    histoire: { type: DataTypes.TEXT, allowNull: true },
    domaine: { type: DataTypes.STRING, allowNull: false, defaultValue: "sciences" },
    image: { type: DataTypes.STRING, allowNull: true },
  },
  { timestamps: false }
);

export default Department;
