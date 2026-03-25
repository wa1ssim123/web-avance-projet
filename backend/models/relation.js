import database from "../config/connection.js";
import User from "./User.js";
import Department from "./Department.js";
import Role from "./Role.js";
import Equipment from "./Equipment.js";
import Laboratory from "./Laboratory.js";
import Subject from "./Subject.js";

Department.hasMany(User, { onDelete: "SET NULL" });
User.belongsTo(Department);

Department.hasMany(Subject, { onDelete: "SET NULL" });
Subject.belongsTo(Department);

Department.hasMany(Laboratory, { onDelete: "SET NULL" });
Laboratory.belongsTo(Department);

Laboratory.hasMany(Subject, { onDelete: "SET NULL" });
Subject.belongsTo(Laboratory);

Laboratory.hasMany(Equipment, { onDelete: "SET NULL" });
Equipment.belongsTo(Laboratory);

Subject.belongsToMany(User, { through: "subject_user" });
User.belongsToMany(Subject, { through: "subject_user" });

Role.belongsToMany(User, { through: "role_user" });
User.belongsToMany(Role, { through: "role_user" });

export { database, Department, User, Role, Equipment, Laboratory, Subject };
