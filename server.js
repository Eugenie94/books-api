// let http = require("http");

const express = require('express')
const fs = require('fs');
const app = express()
let cors = require('cors');

const livre = require('./livres.json')
app.use(express.json())
app.use(cors())

// Affiche ma page d'accueil
app.get("/", (req, res) => {
      res.writeHead(200, {"Content-type": "text/html"});
      res.end("<h1> Hello World ! </h1>");
})

// Affiche tous les livres
app.get("/livre", (req, res) => {
      res.status(200).json(livre)
})

// Affiche un livre par rapport à son id
app.get("/livre/:id", (req, res) => {
      const id = parseInt(req.params.id)
      const leLivre = livre.find(livre => livre.id === id)
      res.status(200).json(leLivre);
})

// Affiche un livre par rapport à son nom
app.get("/livre/titre/:titre", (req, res) => {
      const titre = req.params.titre;
      const livreTrouve = livre.find(livre => livre.titre === titre);
      res.status(200).json(livreTrouve);
})

// Ajouter un nouveau livre (Utilisation de Postman)
app.post("/livre", (req, res) => {
      livre.push(req.body);
      saveBooksToFile();
      res.status(200).json(livre);
    });

// Modifier un livre par rapport à son id (Utilisation de Postman)
app.put("/livre/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let leLivre = livre.find((livre) => livre.id === id);
  if (leLivre) {
    leLivre.titre = req.body.titre;
    leLivre.auteur = req.body.auteur;
    leLivre.prix = req.body.prix;
    leLivre.description = req.body.description;
    saveBooksToFile();
    res.status(200).json(leLivre);
  } else {
    res.status(404).json({ message: "Livre non trouvé" });
  }
});

// Supprimer un livre par rapport à son id (Utilisation de Postman)
app.delete("/livre/:id", (req, res) => {
      const id = parseInt(req.params.id);
      const index = livre.findIndex((livre) => livre.id === id);
      if (index !== -1) {
        livre.splice(index, 1);
        saveBooksToFile();
        res.status(200).json(livre);
      } else {
        res.status(404).json({ message: "Livre non trouvé" });
      }
    });
    
    function saveBooksToFile() {
      fs.writeFile('./livres.json', JSON.stringify(livre), (err) => {
        if (err) {
          console.error("Erreur lors de l'écriture du fichier JSON :", err);
        } else {
          console.log("Fichier JSON mis à jour avec succès");
        }
      });
    }

app.listen(3000, () => {
      console.log("Serveur à l'écoute")
})