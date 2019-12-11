
const express =require('express');
const app =express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(function(req,res,next) {
   res.setHeader('Access-Control-Allow-Origin','*');
   res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE');
   res.setHeader('Access-Control-Allow-Headers','*');
   next();
});

console.log("Dans le serveur");



const MongoClient=require('mongodb').MongoClient;
const url="mongodb://localhost:27017";


MongoClient.connect(url,{useNewUrlParser:true},(err,client) =>{
    console.log("Connexion");

        let db=client.db("VENTESBOUQUINS");
        //console.log(db);
        
        
        app.get("/",(req,res) =>{
            console.log("/");
                res.end("Bonjour");
            
        });


        app.get("/produits",(req,res) =>{
            console.log("/produits");
            db.collection("produits").find().toArray((err,documents)=> {
                res.end(JSON.stringify(documents));
            });
        });


        app.get("/produits/:auteur",(req,res) =>{
            console.log("/produits/:auteur");
            let auteur= req.params.auteur;
            db.collection("produits").find({auteur:auteur}).toArray((err,documents)=> {
                res.end(JSON.stringify(documents));
            });
        });
    
    /*
    //Connexion
    app.post("/membres/connexion",(req,res)=>{
        db.collection("/membres/connexion avec"+JSON.stringify(req.body)).find(req.body);
        db.collection("membres").find(req.body).toArray((err,documents)=> {
        if(documents.length==1)
        
          res.end(JSON.stringify({"resultat":1,"message":"Authentification réussie"})); 
         else res.end(JSON.stringify({"resultat":0,"message":"Email et/ou mot de passe"}));
      
        });
      
      });
      */
      
     //Ajout Utilisateurs
     app.post("/membres",(req,res)=>{
        db.collection("membre").find(req.body)
        .toArray((err,documents)=> {
        if(documents.length==1)
        
          res.end(JSON.stringify({"resultat":1,"message":"Authentification réussie"})); 
         else res.end(JSON.stringify({"resultat":0,"message":"Email et/ou mot de passe"}));
      
        });
      
      });
    
});



app.listen(8888);
