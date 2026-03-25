import database from "../config/connection.js";
import { DataTypes } from "sequelize";

const Role = database.define(
  "Role",
  {
    titre: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
  },
  { timestamps: false }
);

export default Role;
