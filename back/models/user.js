//Import des modules utilisés par ce schéma
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//Schéma utilisateur
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

//Utilisation du plugin unique-validator
userSchema.plugin(uniqueValidator);

//Export du modele
module.exports = mongoose.model("user", userSchema);