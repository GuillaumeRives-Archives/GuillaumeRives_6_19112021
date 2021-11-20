//Inclusion des variables d'environnement
require("dotenv").config({
    path: "vars/.env"
});
//Inclusion des différents modules utiles à l'application
const express = require("express");
const mongoose = require("mongoose");

//Inclusion des routes
const authRoutes = require("./routers/auth");

//Création de l'application
const app = express();

//Connexion à la BDD
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connexion à MongoDB réussie !")
}).catch(() => {
    console.error("Connexion à MongoDB échouée !")
});

//Modification des headers pour autoriser les accès cross origin et les methodes utilisées par l'API
app.use((_request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//Application des routes d'authentification
app.use("/api/auth", authRoutes);

module.exports = app;