import { validationResult } from "express-validator";
import { Op } from "sequelize";
import paginate from "../helpers/paginate.js";
import { Department } from "../models/relation.js";

const buildImageUrl = (req) =>
  req.file ? `${req.protocol}://${req.get("host")}/public/images/${req.file.filename}` : null;

export const departmentList = async (req, res) => {
  const { page, size, search } = req.query;
  const { limit, offset } = paginate(page, size);
  const where = search ? { nom: { [Op.like]: `%${search}%` } } : undefined;
  try {
    const { rows: departments, count: total } = await Department.findAndCountAll({ where, limit, offset, order: [["id", "DESC"]] });
    res.status(200).json({ data: { departments, total, currentPage: page ? +page : 1, totalPages: total ? Math.ceil(total / limit) : 1 } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addDepartment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const created = await Department.create({ ...req.body, image: buildImageUrl(req) });
    res.status(201).json({ message: "Département créé", data: created });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) return res.status(404).json({ message: "Département introuvable" });
    await department.update(req.body);
    res.status(200).json({ message: "Département mis à jour", data: department });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateDepartmentImage = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) return res.status(404).json({ message: "Département introuvable" });
    if (!req.file) return res.status(400).json({ message: "Image manquante" });
    await department.update({ image: buildImageUrl(req) });
    res.status(200).json({ message: "Image du département mise à jour", data: department });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const deleted = await Department.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Département introuvable" });
    res.status(200).json({ message: `Département ${req.params.id} supprimé` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const detailsDepartment = async (req, res) => {
  try {
    const result = await Department.findByPk(req.params.id);
    if (!result) return res.status(404).json({ message: "Département introuvable" });
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const departmentUsers = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) return res.status(404).json({ message: "Département introuvable" });
    const users = await department.getUsers({ attributes: { exclude: ["mot_de_passe"] } });
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const departmentSubjects = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) return res.status(404).json({ message: "Département introuvable" });
    const subjects = await department.getSubjects();
    res.status(200).json({ data: subjects });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
