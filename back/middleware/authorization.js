//Inclusion des variables d'environnement
require("dotenv").config({
    path: "vars/.env"
});

//Import des modules
const Token = require("jsonwebtoken");

//Fonction d'authentification
module.exports = (request, response, next) => {
    try {
        const token = request.headers.authorization.split(" ")[1];
        const decodedToken = Token.verify(token, process.env.SECRET);
        const userId = decodedToken.userId;
        if (request.body.userId && request.body.userId !== userId) {
            throw "User ID invalide !";
        } else {
            next();
        }
    } catch (error) {
        response.status(401).json({
            error: error | "Requête non authentifiée !"
        });
    }
}