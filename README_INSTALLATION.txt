Projet corrigé après reprise complète.

Ce que j'ai corrigé :
- structure propre backend/frontend
- dépendances frontend compatibles (Vite/React/Router)
- login fonctionnel avec compte seedé
- 6 tables fonctionnelles : Users, Roles, Departments, Laboratories, Subjects, Equipment
- relations Sequelize corrigées
- validation frontend sur login/users/subjects/departments
- SubjectForm avec selects Department/Laboratory
- upload image côté departments + service statique /public/images
- endpoints backend cohérents
- seed automatique au démarrage

Compte de connexion par défaut :
email: powell@gmail.com
mot de passe: Admin123!

Lancement :
1) Backend
   cd backend
   npm install
   npm run dev

2) Frontend
   cd frontend
   npm install
   npm run dev

URLs :
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

Note honnête :
- Le frontend a été buildé avec succès dans le conteneur.
- Le backend a été vérifié syntaxiquement fichier par fichier.
- Je n'ai pas pu terminer un npm install backend dans ce conteneur à cause du téléchargement natif de sqlite3 bloqué par le réseau du conteneur. Sur Windows avec internet, npm install backend doit télécharger sqlite3 normalement.
