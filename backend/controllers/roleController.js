import { Role, User } from "../models/relation.js";

export const addRole = async (req, res) => {
  try {
    if (!req.body.titre?.trim()) return res.status(400).json({ message: "Le titre est obligatoire" });
    const role = await Role.create(req.body);
    res.status(201).json({ message: "Rôle créé", data: role });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const roleList = async (_req, res) => {
  try {
    const roles = await Role.findAll({ order: [["id", "DESC"]] });
    res.status(200).json({ data: roles });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const deleted = await Role.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Rôle introuvable" });
    res.status(200).json({ message: `Rôle ${req.params.id} supprimé` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const roleById = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id, { include: [{ model: User, through: { attributes: [] }, attributes: { exclude: ["mot_de_passe"] } }] });
    if (!role) return res.status(404).json({ message: "Rôle introuvable" });
    res.status(200).json({ data: role });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const roleUsers = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: "Rôle introuvable" });
    const users = await role.getUsers({ attributes: { exclude: ["mot_de_passe"] } });
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
