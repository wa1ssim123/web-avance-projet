import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import {
  database,
  Department,
  Equipment,
  Laboratory,
  Role,
  Subject,
  User,
} from "./models/relation.js";

import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import departmentRoute from "./routes/departmentRoute.js";
import roleRoute from "./routes/roleRoute.js";
import subjectRoute from "./routes/subjectRoute.js";
import laboratoryRoute from "./routes/laboratoryRoute.js";
import equipmentRoute from "./routes/equipmentRoute.js";

dotenv.config();

const app = express();

// 🔥 MIDDLEWARES
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 STATIC IMAGES
app.use("/public", express.static("public"));

// 🔥 ROUTES
app.get("/", (_req, res) => res.send("API OK"));

app.use("/api/login", authRoute);
app.use("/api/users", userRoute);
app.use("/api/departments", departmentRoute);
app.use("/api/roles", roleRoute);
app.use("/api/laboratories", laboratoryRoute);
app.use("/api/equipment", equipmentRoute);
app.use("/api/subjects", subjectRoute);

// 🔥 SEED (SAFE)
const seedDatabase = async () => {
  try {
    const roleTitles = ["admin", "prof", "etudiant"];

    for (const titre of roleTitles) {
      await Role.findOrCreate({
        where: { titre },
        defaults: {
          titre,
          description: `Role ${titre}`,
        },
      });
    }

    const [department] = await Department.findOrCreate({
      where: { nom: "Informatique" },
      defaults: {
        nom: "Informatique",
        domaine: "informatique",
        histoire: "Département par défaut",
      },
    });

    const [laboratory] = await Laboratory.findOrCreate({
      where: { nom: "Lab Réseaux" },
      defaults: {
        nom: "Lab Réseaux",
        salle: "B-204",
        information: "Laboratoire par défaut",
        DepartmentId: department.id,
      },
    });

    await Subject.findOrCreate({
      where: { code: "INF101" },
      defaults: {
        nom: "Programmation Web",
        code: "INF101",
        description: "Matière par défaut",
        statut: "requis",
        DepartmentId: department.id,
        LaboratoryId: laboratory.id,
      },
    });

    await Equipment.findOrCreate({
      where: { nom: "Routeur Cisco" },
      defaults: {
        nom: "Routeur Cisco",
        modele: "nouveau",
        description: "Équipement par défaut",
        LaboratoryId: laboratory.id,
      },
    });

    const [admin] = await User.findOrCreate({
      where: { email: "powell@gmail.com" },
      defaults: {
        nom: "Powell",
        prenom: "Admin",
        email: "powell@gmail.com",
        mot_de_passe: bcrypt.hashSync("Admin123!", 10),
        conduite: "excellente",
        DepartmentId: department.id,
      },
    });

    const adminRole = await Role.findOne({
      where: { titre: "admin" },
    });

    if (adminRole) {
      await admin.addRole(adminRole);
    }

    console.log("✅ Seed terminé");
  } catch (error) {
    console.error("❌ Seed error:", error);
  }
};

// 🔥 FIX PRINCIPAL ICI
const PORT = process.env.PORT || 5000;

database
  .sync({ force: true }) // 💥 CHANGE ICI (IMPORTANT)
  .then(async () => {
    console.log("✅ Database clean & synced");

    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Erreur au démarrage:", error);
  });