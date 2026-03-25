import { body, param } from "express-validator";

const allowedDomains = ["sciences", "literature", "autre", "informatique", "gestion", "philo"];

const departmentRules = [
  body("nom").trim().notEmpty().withMessage("le nom est obligatoire").isLength({ min: 2 }).withMessage("le nom doit contenir au moins 2 caracteres"),
  body("histoire").optional({ values: "falsy" }).isLength({ min: 5 }).withMessage("l'histoire doit contenir au moins 5 caracteres"),
  body("domaine").trim().notEmpty().withMessage("le domaine est obligatoire").isIn(allowedDomains).withMessage("domaine invalide"),
  param("id").optional().isInt({ min: 1 }).withMessage("l'id doit etre un entier positif"),
];

export default departmentRules;
