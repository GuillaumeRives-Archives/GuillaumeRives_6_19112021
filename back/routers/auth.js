//Import des modules
const express = require("express");
//Création du routeur
const router = express.Router();
//Import du controlleur
const authController = require("../controllers/auth");

//Enregistrement d'un nouvel utilisateur
router.post("/signup", authController.signup);
//Authentification d'un utilisateur
router.post("/login", authController.login);

module.exports = router;