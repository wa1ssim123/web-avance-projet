import jwt from "jsonwebtoken";

export const verifierToken = (req, res, next) => {
  const bearerToken = req.headers.authorization;
  if (!bearerToken) return res.status(401).json({ message: "Vous n'êtes pas connecté" });
  const token = bearerToken.split(" ")[1];
  jwt.verify(token, process.env.CODE_SECRET || "express_secret_key", (err, payload) => {
    if (err) return res.status(401).json({ message: err.message });
    req.userId = payload.id;
    next();
  });
};
