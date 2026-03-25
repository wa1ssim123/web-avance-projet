import { validationResult } from "express-validator";
import { Op } from "sequelize";
import paginate from "../helpers/paginate.js";
import { Department, Laboratory, Subject, User } from "../models/relation.js";

const buildImageUrl = (req) =>
  req.file ? `${req.protocol}://${req.get("host")}/public/images/${req.file.filename}` : null;

export const subjectList = async (req, res) => {
  const { page, size, search } = req.query;
  const { limit, offset } = paginate(page, size);
  const where = search ? { nom: { [Op.like]: `%${search}%` } } : undefined;
  try {
    const { rows: subjects, count: total } = await Subject.findAndCountAll({
      where,
      limit,
      offset,
      include: [Department, Laboratory],
      order: [["id", "DESC"]],
    });
    res.status(200).json({ data: { subjects, total, currentPage: page ? +page : 1, totalPages: total ? Math.ceil(total / limit) : 1 } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addSubject = async (req, res) => {
  try {
    const { nom, code, description, statut, DepartmentId, LaboratoryId } = req.body;
    if (!nom?.trim() || !code?.trim()) return res.status(400).json({ message: "Le nom et le code sont obligatoires" });

    if (DepartmentId) {
      const department = await Department.findByPk(DepartmentId);
      if (!department) return res.status(400).json({ message: "DepartmentId invalide" });
    }
    if (LaboratoryId) {
      const laboratory = await Laboratory.findByPk(LaboratoryId);
      if (!laboratory) return res.status(400).json({ message: "LaboratoryId invalide" });
    }

    const created = await Subject.create({
      nom: nom.trim(),
      code: code.trim(),
      description: description || null,
      statut: statut || "requis",
      DepartmentId: DepartmentId || null,
      LaboratoryId: LaboratoryId || null,
      image: buildImageUrl(req),
    });

    res.status(201).json({ message: "Matière créée avec succès", data: created });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSubject = async (req, res) => {
  const { id } = req.params;
  try {
    const subject = await Subject.findByPk(id);
    if (!subject) return res.status(404).json({ message: "Matière introuvable" });

    const { nom, code, description, statut, DepartmentId, LaboratoryId } = req.body;

    if (DepartmentId) {
      const department = await Department.findByPk(DepartmentId);
      if (!department) return res.status(400).json({ message: "DepartmentId invalide" });
    }
    if (LaboratoryId) {
      const laboratory = await Laboratory.findByPk(LaboratoryId);
      if (!laboratory) return res.status(400).json({ message: "LaboratoryId invalide" });
    }

    await subject.update({
      nom: nom ?? subject.nom,
      code: code ?? subject.code,
      description: description ?? subject.description,
      statut: statut ?? subject.statut,
      DepartmentId: DepartmentId === "" ? null : DepartmentId ?? subject.DepartmentId,
      LaboratoryId: LaboratoryId === "" ? null : LaboratoryId ?? subject.LaboratoryId,
    });

    res.status(200).json({ message: "Matière mise à jour", data: subject });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSubjectPhoto = async (req, res) => {
  const { id } = req.params;
  try {
    const subject = await Subject.findByPk(id);
    if (!subject) return res.status(404).json({ message: "Matière introuvable" });
    if (!req.file) return res.status(400).json({ message: "Image manquante" });
    await subject.update({ image: buildImageUrl(req) });
    res.status(200).json({ message: "Image de la matière mise à jour", data: subject });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSubject = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Subject.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Matière introuvable" });
    res.status(200).json({ message: `Matière ${id} supprimée` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const subjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const subject = await Subject.findByPk(id, {
      include: [Department, Laboratory, { model: User, through: { attributes: [] }, attributes: { exclude: ["mot_de_passe"] } }],
    });
    if (!subject) return res.status(404).json({ message: "Matière introuvable" });
    res.status(200).json({ data: subject });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const subjectDepartment = async (req, res) => {
  const subject = await Subject.findByPk(req.params.id);
  if (!subject) return res.status(404).json({ message: "Matière introuvable" });
  const department = await subject.getDepartment();
  res.status(200).json({ data: department });
};

export const subjectUsers = async (req, res) => {
  const subject = await Subject.findByPk(req.params.id);
  if (!subject) return res.status(404).json({ message: "Matière introuvable" });
  const users = await subject.getUsers({ attributes: { exclude: ["mot_de_passe"] } });
  res.status(200).json({ data: users });
};

export const addUsersToSubject = async (req, res) => {
  const { ids } = req.body;
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) return res.status(404).json({ message: "Matière introuvable" });
    const users = await User.findAll({ where: { id: ids || [] } });
    await subject.setUsers(users);
    res.status(201).json({ message: "Utilisateurs liés avec succès" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
