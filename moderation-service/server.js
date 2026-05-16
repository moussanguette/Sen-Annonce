const express = require('express');
const axios = require('axios');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Moderation Service API',
      version: '1.0.0',
      description: 'Service de modération pour SenAnnonces - API pour approuver/rejeter les annonces',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Serveur de développement',
      },
    ],
  },
  apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Configuration de l'URL du backend Spring Boot (Pluriel: /annonces)
const ANNONCE_SERVICE_URL = process.env.ANNONCE_SERVICE_URL || 'http://localhost:8080/annonces';

// ========== ENDPOINTS DE MODÉRATION ==========

/**
 * @swagger
 * /moderations/submit:
 *   post:
 *     summary: Recevoir une notification de soumission d'annonce
 *     description: Endpoint appelé par annonce-service quand une annonce est soumise
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               annonceId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Notification reçue
 */
app.post('/moderations/submit', (req, res) => {
  const { annonceId } = req.body;
  console.log(`[Moderation] Nouvelle annonce reçue pour modération: ID ${annonceId}`);
  res.json({ message: 'Notification de modération reçue', annonceId });
});

/**
 * @swagger
 * /moderations/{id}/approve:
 *   patch:
 *     summary: Approuver une annonce
 *     description: Change le statut d'une annonce de EN_ATTENTE à PUBLIEE
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'annonce
 *     responses:
 *       200:
 *         description: Annonce approuvée avec succès
 */
app.patch('/moderations/:id/approve', async (req, res) => {
  try {
    const annonceId = req.params.id;
    
    // Vérifier d'abord si l'annonce existe
    const getResponse = await axios.get(`${ANNONCE_SERVICE_URL}/${annonceId}`);
    
    if (!getResponse.data) {
      return res.status(404).json({ 
        error: 'Annonce non trouvée',
        annonceId: annonceId 
      });
    }
    
    // Appeler le backend Spring Boot pour approuver l'annonce
    const response = await axios.patch(`${ANNONCE_SERVICE_URL}/${annonceId}/approuver`);
    
    // Optionnel: On pourrait aussi appeler /publier ici si on veut que ce soit automatique
    await axios.patch(`${ANNONCE_SERVICE_URL}/${annonceId}/publier`);
    
    res.json({
      status: 'APPROUVEE',
      message: 'Annonce approuvée et publiée avec succès',
      annonceId: annonceId,
      annonce: response.data
    });
  } catch (error) {
    console.error('Erreur lors de l\'approbation:', error.message);
    
    if (error.response) {
      res.status(error.response.status).json({
        error: 'Erreur du service d\'annonces',
        details: error.response.data
      });
    } else {
      res.status(500).json({
        error: 'Erreur interne du service de modération',
        details: error.message
      });
    }
  }
});

/**
 * @swagger
 * /moderations/{id}/reject:
 *   patch:
 *     summary: Rejeter une annonce
 *     description: Change le statut d'une annonce de EN_ATTENTE à REJETEE
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'annonce
 *     responses:
 *       200:
 *         description: Annonce rejetée avec succès
 */
app.patch('/moderations/:id/reject', async (req, res) => {
  try {
    const annonceId = req.params.id;
    
    // Vérifier si l'annonce existe
    const getResponse = await axios.get(`${ANNONCE_SERVICE_URL}/${annonceId}`);
    
    if (!getResponse.data) {
      return res.status(404).json({ 
        error: 'Annonce non trouvée',
        annonceId: annonceId 
      });
    }
    
    // Appeler le backend Spring Boot pour changer le statut à REJETEE
    const response = await axios.patch(`${ANNONCE_SERVICE_URL}/${annonceId}/rejeter`);
    
    res.json({
      status: 'REJETEE',
      message: 'Annonce rejetée avec succès',
      annonceId: annonceId,
      annonce: response.data
    });
  } catch (error) {
    console.error('Erreur lors du rejet:', error.message);
    
    if (error.response) {
      res.status(error.response.status).json({
        error: 'Erreur du service d\'annonces',
        details: error.response.data
      });
    } else {
      res.status(500).json({
        error: 'Erreur interne du service de modération',
        details: error.message
      });
    }
  }
});

app.get('/moderations/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'moderation-service',
    timestamp: new Date().toISOString(),
    backendUrl: ANNONCE_SERVICE_URL
  });
});

app.use((err, req, res, next) => {
  console.error('Erreur non capturée:', err);
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Service de modération démarré sur http://localhost:${PORT}`);
  console.log(`📚 Documentation Swagger disponible sur http://localhost:${PORT}/api-docs`);
  console.log(`🔗 Backend Spring Boot ciblé: ${ANNONCE_SERVICE_URL}`);
});