import { Router } from "express";
import { verifierToken } from "../authentification/verifierToken.js";
import { addRole, deleteRole, roleById, roleList, roleUsers } from "../controllers/roleController.js";

const route = Router();
route.use(verifierToken);
route.get("/", roleList);
route.post("/", addRole);
route.get("/:id", roleById);
route.get("/:id/users", roleUsers);
route.delete("/:id", deleteRole);
export default route;
