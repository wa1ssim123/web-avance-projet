import { body, param } from "express-validator";

const nameRegex = /^[a-zA-ZÀ-ÿ' -]{2,}$/;

const baseUserRules = [
  body("nom").optional().matches(nameRegex).withMessage("le nom n'est pas conforme"),
  body("prenom").optional().matches(nameRegex).withMessage("le prenom n'est pas conforme"),
  body("email").optional().isEmail().withMessage("ceci n'est pas un email"),
  body("naissance").optional({ values: "falsy" }).isDate().withMessage("la date de naissance doit etre une date valide"),
  body("biographie").optional({ values: "falsy" }).isLength({ min: 5 }).withMessage("la biographie doit contenir au moins 5 caracteres"),
  body("conduite").optional({ values: "falsy" }).isIn(["excellente", "bonne", "passable"]).withMessage("la conduite doit etre excellente, bonne ou passable"),
  body("DepartmentId").optional({ values: "falsy" }).isInt({ min: 1 }).withMessage("DepartmentId invalide"),
  param("id").optional().isInt({ min: 1 }).withMessage("l'id doit etre un entier positif"),
];

export const createUserRules = [
  body("nom").exists({ checkFalsy: true }).withMessage("nom obligatoire").matches(nameRegex).withMessage("le nom n'est pas conforme"),
  body("prenom").exists({ checkFalsy: true }).withMessage("prenom obligatoire").matches(nameRegex).withMessage("le prenom n'est pas conforme"),
  body("email").exists({ checkFalsy: true }).withMessage("email obligatoire").isEmail().withMessage("ceci n'est pas un email"),
  body("mot_de_passe").exists({ checkFalsy: true }).withMessage("mot de passe obligatoire").isLength({ min: 4 }).withMessage("au moins 4 caracteres"),
  ...baseUserRules,
];

export const updateUserRules = [
  ...baseUserRules,
  body("mot_de_passe").optional({ values: "falsy" }).isLength({ min: 4 }).withMessage("au moins 4 caracteres"),
];

export default createUserRules;
