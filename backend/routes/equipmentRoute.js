import { Router } from "express";
import upload from "../helpers/fileLoader.js";
import { verifierToken } from "../authentification/verifierToken.js";
import { addEquipment, deleteEquipment, detailsEquipment, equipmentList, updateEquipment, updateEquipmentImage } from "../controllers/equipmentController.js";

const route = Router();
route.use(verifierToken);
route.get("/", equipmentList);
route.get("/:id", detailsEquipment);
route.post("/", upload.single("image"), addEquipment);
route.put("/:id", updateEquipment);
route.put("/:id/image", upload.single("image"), updateEquipmentImage);
route.delete("/:id", deleteEquipment);
export default route;
