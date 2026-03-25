import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { Op } from "sequelize";
import paginate from "../helpers/paginate.js";
import { Department, Role, Subject, User } from "../models/relation.js";

const buildImageUrl = (req) =>
  req.file ? `${req.protocol}://${req.get("host")}/public/images/${req.file.filename}` : null;

export const userList = async (req, res) => {
  const { page, size, search } = req.query;
  const { limit, offset } = paginate(page, size);
  const where = search ? { [Op.or]: [{ nom: { [Op.like]: `%${search}%` } }, { prenom: { [Op.like]: `%${search}%` } }, { email: { [Op.like]: `%${search}%` } }] } : undefined;
  try {
    const { rows: users, count: total } = await User.findAndCountAll({
      attributes: { exclude: ["mot_de_passe"] },
      where,
      limit,
      offset,
      include: [Department, { model: Role, through: { attributes: [] } }],
      order: [["id", "DESC"]],
    });
    res.status(200).json({ data: { users, total, currentPage: page ? +page : 1, totalPages: total ? Math.ceil(total / limit) : 1 } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { mot_de_passe, DepartmentId, ...rest } = req.body;
    if (DepartmentId) {
      const department = await Department.findByPk(DepartmentId);
      if (!department) return res.status(400).json({ message: "DepartmentId invalide" });
    }
    const created = await User.create({
      ...rest,
      DepartmentId: DepartmentId || null,
      mot_de_passe: bcrypt.hashSync(mot_de_passe, 10),
      photo: buildImageUrl(req),
    });
    const safeUser = await User.findByPk(created.id, { attributes: { exclude: ["mot_de_passe"] } });
    res.status(201).json({ message: "Utilisateur créé avec succès", data: safeUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    const { mot_de_passe, DepartmentId, ...rest } = req.body;
    if (DepartmentId) {
      const department = await Department.findByPk(DepartmentId);
      if (!department) return res.status(400).json({ message: "DepartmentId invalide" });
    }
    const payload = { ...rest };
    if (DepartmentId !== undefined) payload.DepartmentId = DepartmentId || null;
    if (mot_de_passe) payload.mot_de_passe = bcrypt.hashSync(mot_de_passe, 10);
    await user.update(payload);
    const safeUser = await User.findByPk(user.id, { attributes: { exclude: ["mot_de_passe"] } });
    res.status(200).json({ message: `Utilisateur ${user.id} mis à jour`, data: safeUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUserPhoto = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    if (!req.file) return res.status(400).json({ message: "Image manquante" });
    await user.update({ photo: buildImageUrl(req) });
    res.status(200).json({ message: "Photo mise à jour", data: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.status(200).json({ message: `Utilisateur ${req.params.id} supprimé` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const userById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["mot_de_passe"] },
      include: [Department, { model: Role, through: { attributes: [] } }, { model: Subject, through: { attributes: [] } }],
    });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const userDepartment = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
  const department = await user.getDepartment();
  res.status(200).json({ data: department });
};

export const userSubjects = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
  const subjects = await user.getSubjects();
  res.status(200).json({ data: subjects });
};

export const addUserToRoles = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    const roles = await Role.findAll({ where: { id: req.body.ids || [] } });
    await user.setRoles(roles);
    res.status(201).json({ message: "Rôles liés avec succès" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addUserToSubjects = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    const subjects = await Subject.findAll({ where: { id: req.body.ids || [] } });
    await user.setSubjects(subjects);
    res.status(201).json({ message: "Matières liées avec succès" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
