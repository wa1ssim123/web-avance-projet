import { Router } from "express";
import upload from "../helpers/fileLoader.js";
import { verifierToken } from "../authentification/verifierToken.js";
import createUserRules, { updateUserRules } from "../validations/userValidation.js";
import { addUser, addUserToRoles, addUserToSubjects, deleteUser, updateUser, updateUserPhoto, userById, userDepartment, userList, userSubjects } from "../controllers/userController.js";

const route = Router();
route.post("/", upload.single("photo"), createUserRules, addUser);
route.use(verifierToken);
route.get("/", userList);
route.get("/:id", userById);
route.get("/:id/department", userDepartment);
route.get("/:id/subjects", userSubjects);
route.put("/:id", updateUserRules, updateUser);
route.put("/:id/photo", upload.single("photo"), updateUserPhoto);
route.post("/:id/roles", addUserToRoles);
route.post("/:id/subjects", addUserToSubjects);
route.delete("/:id", deleteUser);
export default route;
