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

// Configuration de l'URL du backend Spring Boot
const ANNONCE_SERVICE_URL = process.env.ANNONCE_SERVICE_URL || 'http://localhost:8080/annonce';

// ========== ENDPOINTS DE MODÉRATION ==========

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 annonceId:
 *                   type: integer
 *       404:
 *         description: Annonce non trouvée
 *       500:
 *         description: Erreur serveur
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
    
    // Appeler le backend Spring Boot pour publier l'annonce
    const response = await axios.patch(`${ANNONCE_SERVICE_URL}/${annonceId}/publier`);
    
    res.json({
      status: 'APPROUVEE',
      message: 'Annonce approuvée et publiée avec succès',
      annonceId: annonceId,
      annonce: response.data
    });
  } catch (error) {
    console.error('Erreur lors de l\'approbation:', error.message);
    
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      res.status(error.response.status).json({
        error: 'Erreur du service d\'annonces',
        details: error.response.data
      });
    } else if (error.request) {
      // La requête a été faite mais pas de réponse
      res.status(503).json({
        error: 'Service d\'annonces indisponible',
        details: 'Impossible de contacter le backend Spring Boot'
      });
    } else {
      // Autre erreur
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 annonceId:
 *                   type: integer
 *       404:
 *         description: Annonce non trouvée
 *       500:
 *         description: Erreur serveur
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
    // Note: Il faudra peut-être ajouter un endpoint /rejeter dans ton backend
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
    } else if (error.request) {
      res.status(503).json({
        error: 'Service d\'annonces indisponible',
        details: 'Impossible de contacter le backend Spring Boot'
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
 * /moderations/health:
 *   get:
 *     summary: Vérifier la santé du service
 *     description: Endpoint pour vérifier que le service de modération fonctionne
 *     responses:
 *       200:
 *         description: Service opérationnel
 */
app.get('/moderations/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'moderation-service',
    timestamp: new Date().toISOString(),
    backendUrl: ANNONCE_SERVICE_URL
  });
});

// Middleware de gestion d'erreurs global
app.use((err, req, res, next) => {
  console.error('Erreur non capturée:', err);
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: err.message
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Service de modération démarré sur http://localhost:${PORT}`);
  console.log(`📚 Documentation Swagger disponible sur http://localhost:${PORT}/api-docs`);
  console.log(`🔗 Backend Spring Boot ciblé: ${ANNONCE_SERVICE_URL}`);
});