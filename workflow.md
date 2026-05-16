# Workflow du Projet Sen-Annonce

Ce document détaille le fonctionnement du projet étape par étape.

## 🟢 Étape 1 : Création de l'Annonce
*   **Action** : L'utilisateur publie via l'interface Angular.
*   **Processus** : Appel `POST /annonces`.
*   **Résultat** : Enregistrement avec statut **`EN_ATTENTE`**.

## 🟡 Étape 2 : Soumission pour Modération
*   **Action** : Clic sur "Soumettre" (Frontend).
*   **Processus Technique** :
    1. Appel `POST /annonces/{id}/soumettre` (Java).
    2. **Communication Inter-Service** : Java notifie Node.js via `POST /moderations/submit`.

## 🟠 Étape 3 : Examen par le Modérateur
*   **Action** : Visualisation via `GET /annonces` (filtré par statut).

## 🔵 Étape 4 : Validation (Approbation)
*   **Action** : Clic sur "Approuver" (Frontend/Moderation).
*   **Processus** : 
    1. Appel `PATCH /moderations/{id}/approve` (Node.js).
    2. Node.js appelle Java : `PATCH /approuver` puis `PATCH /publier`.
*   **Résultat** : Statut **`PUBLIEE`**.

## 🔴 Étape 5 : Refus (Rejet)
*   **Action** : Clic sur "Rejeter" (Frontend/Moderation).
*   **Processus** : 
    1. Appel `PATCH /moderations/{id}/reject` (Node.js).
    2. Node.js appelle Java : `PATCH /rejeter`.
*   **Résultat** : Statut **`REJETEE`**.

---

## 📊 Résumé des Transitions
1. `null` ➔ `EN_ATTENTE`
2. `EN_ATTENTE` ➔ `APPROUVEE` ➔ `PUBLIEE`
3. `EN_ATTENTE` ➔ `REJETEE`
