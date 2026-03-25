import { Router } from "express";
import upload from "../helpers/fileLoader.js";
import { verifierToken } from "../authentification/verifierToken.js";
import { addLaboratory, deleteLaboratory, detailsLaboratory, laboratoryEquipments, laboratoryList, laboratorySubjects, updateLaboratory, updateLaboratoryImage } from "../controllers/laboratoryController.js";

const route = Router();
route.use(verifierToken);
route.get("/", laboratoryList);
route.get("/:id", detailsLaboratory);
route.get("/:id/equipment", laboratoryEquipments);
route.get("/:id/subjects", laboratorySubjects);
route.post("/", upload.single("image"), addLaboratory);
route.put("/:id", updateLaboratory);
route.put("/:id/image", upload.single("image"), updateLaboratoryImage);
route.delete("/:id", deleteLaboratory);
export default route;
