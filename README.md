# Sen-Annonce - Plateforme de Petites Annonces

Sen-Annonce est une mini plateforme de petites annonces basée sur une architecture microservices. Ce projet a été réalisé pour mettre en pratique les concepts d'Architecture Orientée Services (SOA) et les microservices.

## 🏗 Architecture du Projet

Le système est composé de trois parties principales :

1.  **Annonce-Service (Java / Spring Boot)** : 
    - Gère le cycle de vie des annonces.
    - Base de données : MySQL.
    - Documentation : [Swagger UI](http://localhost:8080/swagger-ui.html)
    - Port : `8080`.

2.  **Moderation-Service (Node.js / Express)** :
    - Gère l'approbation et le rejet des annonces.
    - Documentation : [Swagger UI](http://localhost:3000/api-docs)
    - Port : `3000`.

3.  **Interface (Angular)** :
    - Frontend pour interagir avec les services.
    - Port : `4200`.

## 🚀 Installation et Lancement

### Prérequis
- Java 17+
- Node.js 18+
- MySQL Server
- Maven

### 0. Configuration de la Base de Données
Avant de lancer le backend, créez une base de données MySQL nommée `senAnnonceDB` :
```sql
CREATE DATABASE senAnnonceDB;
```
Configurez ensuite vos accès (username/password) dans `annonce-service/src/main/resources/application.properties`.

### 1. Lancement du Backend Java
```bash
cd annonce-service
mvn clean install
mvn spring-boot:run
```

### 2. Lancement du Service de Modération
```bash
cd moderation-service
npm install
npm start
```

### 3. Lancement de l'Interface Angular
```bash
cd interface
npm install
npm start
```

## 🛠 API Endpoints Principaux

### Annonce Service (8080)
| Méthode | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/annonces` | Créer une annonce |
| `GET` | `/annonces` | Lister toutes les annonces |
| `GET` | `/annonces/{id}` | Détails d'une annonce |
| `POST` | `/annonces/{id}/soumettre` | Envoyer en modération |
| `PATCH` | `/annonces/{id}/approuver` | Marquer comme approuvée |
| `PATCH` | `/annonces/{id}/publier` | Publier l'annonce |

### Moderation Service (3000)
| Méthode | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/moderations/submit` | Notifier une soumission (interne) |
| `PATCH` | `/moderations/{id}/approve` | Approuver une annonce |
| `PATCH` | `/moderations/{id}/reject` | Rejeter une annonce |

## ✅ Workflow Attendu
1. Création d'annonce via le frontend (Statut : `EN_ATTENTE`).
2. Clic sur "Soumettre" -> Appel à `annonce-service` qui notifie `moderation-service`.
3. Le modérateur voit l'annonce dans son panel et clique sur "Approuver".
4. `moderation-service` appelle `annonce-service` pour changer le statut en `APPROUVEE` puis `PUBLIEE`.

## 📂 Structure des dossiers
- `annonce-service/` : Backend Spring Boot.
- `moderation-service/` : Backend Node.js.
- `interface/` : Frontend Angular (Bonus).

## 👥 Auteur
Projet réalisé dans le cadre du module **Architecture Orientée Services et d'Entreprise (AOSE)**.
