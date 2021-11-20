//Inclusion des modules
const Sauce = require("../models/sauce");
const fileSystem = require("fs");
const Arrays = require("../utils/removeFromArray");


//Récupération de toutes les sauces
exports.getAllSauces = (_request, response) => {
    Sauce.find().then(sauces => {
        response.status(200).json(sauces);
    }).catch(error => {
        response.status(400).json(error);
        console.error(error);
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
        console.error(error);
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
        console.error(error);
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
                console.error(error);
            })
        });
    }).catch(error => {
        response.status(500).json(error);
        console.error(error);
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
        console.error(error);
    });
}

//Modification des likes
exports.likeDislike = (request, response) => {
    Sauce.findOne({
        _id: request.params.id
    }).then(sauce => {
        let usersLiked = sauce.usersLiked;
        let usersDisliked = sauce.usersDisliked;
        let nbLikes = sauce.likes;
        let nbDislikes = sauce.dislikes;
        switch (request.body.like) {
            case -1:
                Arrays.removeFromArray(usersLiked, request.body.userId);
                usersDisliked.push(request.body.userId);
                nbLikes > 0 ? nbLikes = sauce.likes - 1 : nbLikes = 0;
                nbDislikes = sauce.dislikes += 1;
                break;
            case 0:
                Arrays.removeFromArray(usersLiked, request.body.userId);
                Arrays.removeFromArray(usersDisliked, request.body.userId);
                nbLikes > 0 ? nbLikes = sauce.likes - 1 : nbLikes = 0;
                nbDislikes > 0 ? nbDislikes = sauce.dislikes - 1 : nbDislikes = 0;
                break;
            case 1:
                Arrays.removeFromArray(usersDisliked, request.body.userId);
                usersLiked.push(request.body.userId);
                nbDislikes > 0 ? nbDislikes = sauce.dislikes - 1 : nbDislikes = 0;
                nbLikes = sauce.likes += 1;
                break;
        }
        const data = {
            likes: nbLikes,
            dislikes: nbDislikes,
            usersLiked: usersLiked,
            usersDisliked: usersDisliked
        }
        Sauce.updateOne({
            _id: request.params.id
        }, data).then(() => {
            response.status(200).json({
                message: "Modification des likes effectuée !"
            });
        }).catch(error => {
            response.status(400).json(error);
            console.error(error);
        });
    });
}