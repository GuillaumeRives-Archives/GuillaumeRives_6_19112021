const User = require("../models/user");
const bcrypt = require("bcrypt");
const cryptojs = require("crypto-js");

//Paramétrage Bcrypt
const saltRounds = 10;

exports.createUser = (request, response, next) => {
    //Création d'un objet utilisateur à partir de la requête reçue
    const user = new User({
        ...request.body
    });
    //Hachage de l'adresse email
    user.email = cryptojs.SHA256(user.email).toString();
    //Hachage du mot de passe
    bcrypt.hash(user.password, saltRounds).then(hash => {
        user.password = hash;
        //Sauvegarde dans la base de données
        user.save().then(() => {
                response.status(201).json({
                    message: "Utilisateur enregistré !"
                })
                console.log("Utilisateur enregistré !");
            })
            .catch(error => {
                response.status(400).json({
                    message: "Cette adresse email est déjà utilisée !"
                })
                console.error(error);
            });
    }).catch(error => {
        response.status(404).json({
            message: error
        })
        console.error(error);
    })
};