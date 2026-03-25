import { User } from "../models/relation.js";

const autoriser = (roles = []) => async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    const userRoles = await user.getRoles();
    const titles = userRoles.map((role) => role.titre.toLowerCase());
    const allowed = roles.some((role) => titles.includes(role.toLowerCase()));
    if (!allowed) return res.status(403).json({ message: "Vous n'êtes pas autorisé" });
    next();
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

export default autoriser;
