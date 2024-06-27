const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Configuration de la base de données
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin', // Remplacez par votre mot de passe
  database: 'cannabisinventory'
});

// Connexion à la base de données
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL connecté...');
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir les fichiers statiques (HTML, CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Route pour ajouter une plantule
app.post('/ajouter_plantule', (req, res) => {
  const { etatSante, dateArrivee, identification, provenance, description, stade, entreposage, actifInactif, dateRetrait, raisonRetrait, responsable, note } = req.body;

  // Générer le QR code
  const qrCodePath = `public/qrcodes/${identification}.png`;
  QRCode.toFile(qrCodePath, identification, (err) => {
    if (err) {
      console.error('Erreur lors de la génération du QR code:', err);
      return res.status(500).send('Erreur interne du serveur');
    }

    // Insérer les données dans la base de données
    const sql = 'INSERT INTO Plantules (EtatSante, DateArrivee, Identification, Provenance, Description, Stade, Entreposage, ActifInactif, DateRetrait, RaisonRetrait, Responsable, Note, QRCodePath) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [etatSante, dateArrivee, identification, provenance, description, stade, entreposage, actifInactif, dateRetrait, raisonRetrait, responsable, note, qrCodePath];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'insertion des données:', err);
        return res.status(500).send('Erreur interne du serveur');
      }
      res.send('Plantule ajoutée avec succès!');
    });
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
