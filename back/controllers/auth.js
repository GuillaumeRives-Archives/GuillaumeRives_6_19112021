//Inclusion des variables d'environnement
require("dotenv").config({
    path: "vars/.env"
});

//Inclusion des modules
const User = require("../models/user");
const Bcrypt = require("bcrypt");
const Crypto = require("../utils/crypto");
const Token = require("jsonwebtoken");

//Paramétrage Bcrypt
const saltRounds = 10;

//Fonction appelée par la route signup
exports.signup = (request, response) => {
    //Création d'un objet utilisateur à partir de la requête reçue
    const user = new User({
        ...request.body
    });
    //Hachage de l'adresse email
    user.email = Crypto.sha256(user.email);

    //Hachage du mot de passe
    Bcrypt.hash(user.password, saltRounds).then(hash => {
        user.password = hash;
        //Sauvegarde dans la base de données
        user.save().then(() => {
                response.status(201).json({
                    message: "Utilisateur enregistré !"
                })
            })
            .catch(error => {
                response.status(400).json({
                    message: "Cette adresse email est déjà utilisée !"
                });
                console.error(error);
            });
    }).catch(error => {
        response.status(500).json(error);
        console.error(error);
    })
};

//Fonction appelée par la route login
exports.login = (request, response) => {
    User.findOne({
        email: Crypto.sha256(request.body.email)
    }).then(user => {
        if (!user) {
            return response.status(401).json({
                message: "Utilisateur introuvable !"
            })
        }
        Bcrypt.compare(request.body.password, user.password).then(valid => {
            if (!valid) {
                return response.status(401).json({
                    message: "Mot de passe incorrect !"
                });
                console.error("Mot de passe incorrect !");
            }
            response.status(200).json({
                userId: user._id,
                token: Token.sign({
                        userId: user._id
                    },
                    process.env.SECRET, {
                        expiresIn: process.env.EXPIRATION
                    }
                )
            });
        }).catch(error => {
            response.status(500).json(error);
            console.error(error);
        });
    }).catch(error => {
        response.status(500).json(error);
        console.error(error);
    });
}