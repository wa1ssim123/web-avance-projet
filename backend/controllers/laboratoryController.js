import { Op } from "sequelize";
import paginate from "../helpers/paginate.js";
import { Department, Laboratory } from "../models/relation.js";

const buildImageUrl = (req) =>
  req.file ? `${req.protocol}://${req.get("host")}/public/images/${req.file.filename}` : null;

export const laboratoryList = async (req, res) => {
  const { page, size, search } = req.query;
  const { limit, offset } = paginate(page, size);
  const where = search ? { nom: { [Op.like]: `%${search}%` } } : undefined;
  try {
    const { rows: laboratories, count: total } = await Laboratory.findAndCountAll({ where, limit, offset, include: [Department], order: [["id", "DESC"]] });
    res.status(200).json({ data: { laboratories, total, currentPage: page ? +page : 1, totalPages: total ? Math.ceil(total / limit) : 1 } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addLaboratory = async (req, res) => {
  try {
    const { nom, salle, information, DepartmentId } = req.body;
    if (!nom?.trim()) return res.status(400).json({ message: "Le nom est obligatoire" });
    if (DepartmentId) {
      const department = await Department.findByPk(DepartmentId);
      if (!department) return res.status(400).json({ message: "DepartmentId invalide" });
    }
    const result = await Laboratory.create({ nom, salle, information, DepartmentId: DepartmentId || null, image: buildImageUrl(req) });
    res.status(201).json({ message: "Laboratoire créé", data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateLaboratory = async (req, res) => {
  try {
    const laboratory = await Laboratory.findByPk(req.params.id);
    if (!laboratory) return res.status(404).json({ message: "Laboratoire introuvable" });
    const { DepartmentId } = req.body;
    if (DepartmentId) {
      const department = await Department.findByPk(DepartmentId);
      if (!department) return res.status(400).json({ message: "DepartmentId invalide" });
    }
    await laboratory.update(req.body);
    res.status(200).json({ message: "Laboratoire mis à jour", data: laboratory });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateLaboratoryImage = async (req, res) => {
  try {
    const laboratory = await Laboratory.findByPk(req.params.id);
    if (!laboratory) return res.status(404).json({ message: "Laboratoire introuvable" });
    if (!req.file) return res.status(400).json({ message: "Image manquante" });
    await laboratory.update({ image: buildImageUrl(req) });
    res.status(200).json({ message: "Image du laboratoire mise à jour", data: laboratory });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteLaboratory = async (req, res) => {
  try {
    const deleted = await Laboratory.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Laboratoire introuvable" });
    res.status(200).json({ message: `Laboratoire ${req.params.id} supprimé` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const detailsLaboratory = async (req, res) => {
  try {
    const result = await Laboratory.findByPk(req.params.id, { include: [Department] });
    if (!result) return res.status(404).json({ message: "Laboratoire introuvable" });
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const laboratorySubjects = async (req, res) => {
  try {
    const laboratory = await Laboratory.findByPk(req.params.id);
    if (!laboratory) return res.status(404).json({ message: "Laboratoire introuvable" });
    const subjects = await laboratory.getSubjects();
    res.status(200).json({ data: subjects });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const laboratoryEquipments = async (req, res) => {
  try {
    const laboratory = await Laboratory.findByPk(req.params.id);
    if (!laboratory) return res.status(404).json({ message: "Laboratoire introuvable" });
    const equipments = await laboratory.getEquipment();
    res.status(200).json({ data: equipments });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
