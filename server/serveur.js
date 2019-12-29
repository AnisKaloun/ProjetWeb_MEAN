
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

console.log("Dans le serveur");



const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";


MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    console.log("Connexion");

    let db = client.db("VENTESBOUQUINS");
    //console.log(db);


    app.get("/", (req, res) => {
        console.log("/");
        res.end("Bonjour");

    });

    //get tout les produits
    app.get("/produits", (req, res) => {
        console.log("/produits");
        db.collection("produits").find().toArray((err, documents) => {
            res.end(JSON.stringify(documents));
        });
    });

    //get les produits de la catégorie    
    app.get("/produits/:categorie", (req, res) => {
        let categorie = req.params.categorie;
        console.log("/produits/" + categorie);
        db.collection("produits").find({ type: categorie }).toArray((err, documents) => {
            console.log("Renvoie du produits " + JSON.stringify(documents));
            res.end(JSON.stringify(documents));
        });
    });
    //get toute les categories
    app.get("/categories", (req, res) => {
        console.log("/categories");
        categories = [];
        try {
            db.collection("produits").find().toArray((err, documents) => {
                for (let doc of documents) {
                    if (!categories.includes(doc.type))
                        categories.push(doc.type);
                }
                console.log("Renvoie de " + JSON.stringify(categories));
                res.end(JSON.stringify(categories));
            });
        } catch (e) {
            console.log("Erreur sur /categories:" + e)
            res.end(JSON.stringify(categories));
        }
    });



    app.get("/produits/:auteur", (req, res) => {
        console.log("/produits/:auteur");
        let auteur = req.params.auteur;
        db.collection("produits").find({ auteur: auteur }).toArray((err, documents) => {
            res.end(JSON.stringify(documents));
        });
    });


    //Connexion
    app.post("/membres/connexion", (req, res) => {
        console.log("/membres/connexion avec" + JSON.stringify(req.body));
        db.collection("membres").find(req.body).toArray((err, documents) => {
            if (documents.length == 1)
                res.end(JSON.stringify({ "resultat": 1, "message": "Authentification réussie" }));
            else res.end(JSON.stringify({ "resultat": 0, "message": "Email et/ou mot de passe incorrect" }));

        });
    });


    //Ajout Utilisateurs
    app.post("/membres/inscription", (req, res) => {

        //tester l'existance de l'email
        db.collection("membres").find({ "email": req.body.email }).toArray(function (err, documents) {
            if (documents.length == 1) {
                res.end(JSON.stringify({ "resultat": 0, "message": "Email existe déjà" }));
            }
            else {
                console.log("inscription nouveau membre" + req.body);
                db.collection("membres").insertOne(req.body);
                db.collection("Panier").insertOne({ "email": req.body.email, "produits": [] });
                res.end(JSON.stringify({ "resultat": 1, "message": "inscription Reussi" }));
            }
        });

    });

    //Ajout un article dans le panier
    app.post("/Panier/ajout", (req, res) => {
        console.log("Ajout Produit au Panier " + JSON.stringify(req.body.produit));
        console.log("email :" + req.body.email + "prduit nom : " + req.body.produit['nom'] + "produit auteur" + req.body.produit['auteur'])
        db.collection("Panier").find({ "email": req.body.email, "produits.nom": req.body.produit['nom'], "produits.auteur": req.body.produit['auteur'] }).toArray(function (err, documents) {
            if (documents.length == 1) {
                //on incremente le nombre d'exemplaire 
                console.log("on incremente le nombre d'exemplaire");
                db.collection("Panier").updateOne({ "email": req.body.email, "produits": req.body.produit },
                    { $inc: { "produits.$.nbrExemplaire": 1 } });
                res.end(JSON.stringify({ "resultat": 1 }));

            }
            else {
                console.log("ajout d'un nouveau produit dans le panier");
                db.collection("Panier").updateOne({ "email": req.body.email },
                    { $push: { "produits": req.body.produit } });
                res.end(JSON.stringify({ "resultat": 1 }));

            }

        });


    });

    //Get Panier
    app.get("/Panier/:email", (req, res) => {
        let email = req.params.email;
        console.log("Get Panier de" + email);
        db.collection("Panier").find({ email: email }, { "produits": 1, "_id": 0 }).toArray((err, documents) => {
            res.end(JSON.stringify(documents));
            console.log("Panier envoyé");
        });
    });

    //Valider Panier
    app.get("/Panier/valider/:email", (req, res) => {
        let email = req.params.email;
        console.log("validation Panier : Serveur mail : " + email);
        db.collection("Panier").update({ "email": email },
            { $set: { "produits": [] } });

    });

    //supprimer un article dans le panier
    app.post("/Panier/delete", (req, res) => {
        console.log("supprimer produit du Panier Serveur " + JSON.stringify(req.body.produit));
        db.collection("Panier").updateOne({ "email": req.body.email },
            { $pull: { "produits": req.body.produit } }, function (err, result) {
                console.log("result : " + result);
                if (result['result']['ok'] == 1) {
                    res.end(JSON.stringify({ "resultat": 1 }));
                    console.log("suppresion done");
                }
                else {
                    console.log("Pas de suppresion");
                }


            });

    });

    //diminuer le nombre d'exemplaire d'un article dans le panier
    app.post("/Panier/diminuerExemplaire", (req, res) => {
        console.log("diminuer examplaire produit du Panier Serveur " + JSON.stringify(req.body.produit));
        db.collection("Panier").updateOne({ "email": req.body.email, "produits": req.body.produit },
            { $inc: { "produits.$.nbrExemplaire": -1 } }, function (err, result) {
                console.log("result : " + result);
                if (result['result']['ok'] == 1) {
                    res.end(JSON.stringify({ "resultat": 1 }));
                    console.log("suppresion done");
                }
                else {
                    console.log("Pas de suppresion");
                }


            });

    });

    //augmenter le nombre d'exemplaire d'un article dans le panier
    app.post("/Panier/augmenterExemplaire", (req, res) => {
        console.log("augmenter examplaire produit du Panier Serveur " + JSON.stringify(req.body.produit));
        db.collection("Panier").updateOne({ "email": req.body.email, "produits": req.body.produit },
            { $inc: { "produits.$.nbrExemplaire": 1 } }, function (err, result) {
                console.log("result : " + result);
                if (result['result']['ok'] == 1) {
                    res.end(JSON.stringify({ "resultat": 1 }));
                    console.log("suppresion done");
                }
                else {
                    console.log("Pas de suppresion");
                }


            });

    });



    app.post("/Recherche", function (req, res) {

        var filter = {};
        //categorie
        if (req.body.categorie !== "") {
            filter["type"] = req.body.categorie;
        }
        //prix
        if (req.body.prixMax !== "" && req.body.prixMin !== "") {
            filter["prix"] = { $gt: parseInt(req.body.prixMin), $lt: parseInt(req.body.prixMax) };
        }
        else if (req.body.prixMax == "" && req.body.prixMin !== "") {
            filter["prix"] = { $gt: parseInt(req.body.prixMin) };

        }
        else if (req.body.prixMax !== "" && req.body.prixMin == "") {

            filter["prix"] = { $lt: parseInt(req.body.prixMax) };
        }

        //nom
        if (req.body.nom !== "") {
            filter["nom"] = { $regex: req.body.nom, $options: "ix" };
            console.log()
        }
        if (req.body.auteur !== "") {
            filter["auteur"] = { $regex: req.body.auteur, $options: "ix" };
        }

        //

        console.log("filter: " + JSON.stringify(filter));

        db.collection("produits").find(filter).toArray(function (err, documents) {
            console.log("/Recherche resultat: " + JSON.stringify(documents));
            if (documents.length >= 1) {
                console.log("resultat trouvé");
                res.end(JSON.stringify(documents));
                criteriasearch = documents;
            }
            else {
                console.log("Pas de résultat");
                res.end(JSON.stringify({ "resultat": 0 }));
            }

        });


    });




});



app.listen(8888);
