//Inclusion des modules
const Sauce = require("../models/sauce");
const fileSystem = require("fs");


//Récupération de toutes les sauces
exports.getAllSauces = (_request, response) => {
    Sauce.find().then(sauces => {
        response.status(200).json(sauces);
    }).catch(error => {
        response.status(400).json(error);
    });
}

//Récupération d'une sauce par son ID
exports.getSauce = (request, response) => {
    Sauce.findOne({
        _id: request.params.id
    }).then(sauce => {
        response.status(200).json(sauce);
    }).catch(error => {
        response.status(404).json(error);
    });
}

//Ajout d'une sauce
exports.createSauce = (request, response) => {
    const parsedSauce = JSON.parse(request.body.sauce);
    delete parsedSauce._id;
    const newSauce = new Sauce({
        ...parsedSauce,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl: `${request.protocol}://${request.get("host")}/images/${request.file.filename}`
    });
    Sauce.create(newSauce).then(() => {
        response.status(201).json({
            message: "Sauce ajoutée au catalogue !"
        });
    }).catch(error => {
        response.status(500).json(error);
    });
}

//Suppression d'une sauce
exports.deleteSauce = (request, response) => {
    Sauce.findOne({
        _id: request.params.id
    }).then(sauce => {
        const image = sauce.imageUrl.split("/images/")[1];
        fileSystem.unlink(`images/${image}`, () => {
            Sauce.deleteOne({
                _id: request.params.id
            }).then(() => {
                response.status(200).json({
                    message: "Sauce supprimée avec succès !"
                });
            }).catch(error => {
                response.status(500).JSON(error);
            })
        });
    }).catch(error => {
        response.status(500).json(error);
        console.log(error);
    });
}

//Modification d'une sauce
exports.updateSauce = (request, response) => {
    const modifiedSauce = request.file ? {
        ...JSON.parse(request.body.sauce),
        imageUrl: `${request.protocol}://${request.get("host")}/images/${request.file.filename}`
    } : {
        ...request.body
    }
    Sauce.updateOne({
        _id: request.params.id
    }, {
        ...modifiedSauce,
        _id: request.params.id
    }).then(() => {
        response.status(200).json({
            message: "Sauce mise à jour avec succès !"
        });
    }).catch(error => {
        response.status(400).json(error);
    });
}