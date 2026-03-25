import { Router } from "express";
import upload from "../helpers/fileLoader.js";
import { verifierToken } from "../authentification/verifierToken.js";
import departmentRules from "../validations/departmentValidation.js";
import { addDepartment, deleteDepartment, departmentList, departmentSubjects, departmentUsers, detailsDepartment, updateDepartment, updateDepartmentImage } from "../controllers/departmentController.js";

const route = Router();
route.use(verifierToken);
route.get("/", departmentList);
route.get("/:id", detailsDepartment);
route.get("/:id/users", departmentUsers);
route.get("/:id/subjects", departmentSubjects);
route.post("/", upload.single("image"), departmentRules, addDepartment);
route.put("/:id", departmentRules, updateDepartment);
route.put("/:id/image", upload.single("image"), updateDepartmentImage);
route.delete("/:id", deleteDepartment);
export default route;
