import { Router } from "express";
import upload from "../helpers/fileLoader.js";
import { verifierToken } from "../authentification/verifierToken.js";
import { addSubject, addUsersToSubject, deleteSubject, subjectById, subjectDepartment, subjectList, subjectUsers, updateSubject, updateSubjectPhoto } from "../controllers/subjectController.js";

const route = Router();
route.use(verifierToken);
route.get("/", subjectList);
route.get("/:id", subjectById);
route.get("/:id/department", subjectDepartment);
route.get("/:id/users", subjectUsers);
route.post("/", upload.single("image"), addSubject);
route.put("/:id", updateSubject);
route.put("/:id/image", upload.single("image"), updateSubjectPhoto);
route.post("/:id/users", addUsersToSubject);
route.delete("/:id", deleteSubject);
export default route;
