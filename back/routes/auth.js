//Import des modules
const express = require("express");
//Création du routeur
const router = express.Router();
//Import des controlleurs
const authController = require("../controllers/auth");

//Enregistrement d'un nouvel utilisateur
router.post("/signup", authController.createUser);

module.exports = router;