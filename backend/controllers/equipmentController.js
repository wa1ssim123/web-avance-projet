import { Op } from "sequelize";
import paginate from "../helpers/paginate.js";
import { Equipment, Laboratory } from "../models/relation.js";

const buildImageUrl = (req) =>
  req.file ? `${req.protocol}://${req.get("host")}/public/images/${req.file.filename}` : null;

export const equipmentList = async (req, res) => {
  const { page, size, search } = req.query;
  const { limit, offset } = paginate(page, size);
  const where = search ? { nom: { [Op.like]: `%${search}%` } } : undefined;
  try {
    const { rows: equipments, count: total } = await Equipment.findAndCountAll({ where, limit, offset, include: [Laboratory], order: [["id", "DESC"]] });
    res.status(200).json({ data: { equipments, total, currentPage: page ? +page : 1, totalPages: total ? Math.ceil(total / limit) : 1 } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addEquipment = async (req, res) => {
  try {
    const { nom, modele, description, LaboratoryId } = req.body;
    if (!nom?.trim()) return res.status(400).json({ message: "Le nom est obligatoire" });
    if (!modele?.trim()) return res.status(400).json({ message: "Le modèle est obligatoire" });
    if (LaboratoryId) {
      const laboratory = await Laboratory.findByPk(LaboratoryId);
      if (!laboratory) return res.status(400).json({ message: "LaboratoryId invalide" });
    }
    const result = await Equipment.create({ nom, modele, description, LaboratoryId: LaboratoryId || null, image: buildImageUrl(req) });
    res.status(201).json({ message: "Équipement créé", data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByPk(req.params.id);
    if (!equipment) return res.status(404).json({ message: "Équipement introuvable" });
    const { LaboratoryId } = req.body;
    if (LaboratoryId) {
      const laboratory = await Laboratory.findByPk(LaboratoryId);
      if (!laboratory) return res.status(400).json({ message: "LaboratoryId invalide" });
    }
    await equipment.update(req.body);
    res.status(200).json({ message: "Équipement mis à jour", data: equipment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateEquipmentImage = async (req, res) => {
  try {
    const equipment = await Equipment.findByPk(req.params.id);
    if (!equipment) return res.status(404).json({ message: "Équipement introuvable" });
    if (!req.file) return res.status(400).json({ message: "Image manquante" });
    await equipment.update({ image: buildImageUrl(req) });
    res.status(200).json({ message: "Image de l'équipement mise à jour", data: equipment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteEquipment = async (req, res) => {
  try {
    const deleted = await Equipment.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Équipement introuvable" });
    res.status(200).json({ message: `Équipement ${req.params.id} supprimé` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const detailsEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByPk(req.params.id, { include: [Laboratory] });
    if (!equipment) return res.status(404).json({ message: "Équipement introuvable" });
    res.status(200).json({ data: equipment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
