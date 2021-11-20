//Import des modules
const express = require("express");
const authorization = require("../middleware/authorization");
const multer = require("../middleware/multer");
//Création du routeur
const router = express.Router();

//Import du controlleur
const sauceController = require("../controllers/sauce");
const sauce = require("../models/sauce");

//Récupération de toutes les sauces
router.get("", authorization, sauceController.getAllSauces);
//Récupération d'une sauce par son ID
router.get("/:id", authorization, sauceController.getSauce);
//Ajout d'une sauce
router.post("", authorization, multer, sauceController.createSauce);
//Suppression d'une sauce
router.delete("/:id", authorization, sauceController.deleteSauce);
//Modification d'une sauce
router.put("/:id", authorization, multer, sauceController.updateSauce);

//Export du routeur
module.exports = router;