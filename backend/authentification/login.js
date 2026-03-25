import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/relation.js";

export const login = async (req, res) => {
  const { email, mot_de_passe } = req.body;
  if (!email || !mot_de_passe) return res.status(400).json({ message: "Email et mot de passe obligatoires" });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "La personne n'existe pas" });

    const ok = bcrypt.compareSync(mot_de_passe, user.mot_de_passe);
    if (!ok) return res.status(401).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.CODE_SECRET || "express_secret_key", {
      expiresIn: "24h",
    });

    res.status(200).json({ token, data: { id: user.id, email: user.email, nom: user.nom, prenom: user.prenom } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
