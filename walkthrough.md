# Plan d'Action Stratégique : Psymaroc vers PsyMed

Ce document détaille la feuille de route pour transformer la plateforme `psymaroc` en `PsyMed`, une référence d'autorité pour le marché marocain, optimisée pour le SEO et les LLM.

---

## Phase 1 : Architecture Technique & SEO "AI-Ready" (Semaines 1-2)

**Objectif :** Passer d'un site statique à une application performante et sémantique.

### 1.1 Migration vers Next.js (SSR)
*   **Action :** Migrer le code HTML/JS actuel vers le framework Next.js.
*   **Pourquoi :** Garantir un rendu côté serveur (SSR) pour un chargement instantané et une meilleure indexation par Google (Core Web Vitals).

### 1.2 Extension des Données Structurées (JSON-LD)
*   **Action :** Enrichir le schéma `Organization` et `MedicalBusiness` existant.
*   **Détails :**
    *   Utiliser `MedicalSpecialty` et `ServiceArea` (Maroc + Diaspora).
    *   Ajouter `KnowsAbout` pour les expertises culturelles (ex: "Thérapie biculturelle", "Stress de l'expatriation").

### 1.3 Audit et Optimisation de Performance
*   **Action :** Conversion de tous les assets visuels.
*   **Détails :** Passer les images lourdes (`hero-bg.jpg`, `lieu.jpg`) en format **WebP** nouvelle génération.

---

## Phase 2 : Le Pivot Linguistique & Culturel (Semaines 3-4)

**Objectif :** Différenciation par l'ancrage local et linguistique.

### 2.1 Indexation "Arabe-Latin"
*   **Action :** Création de pages "Landing" ciblées sur des expressions locales et arabes.
*   **Mots-clés cibles :** 
    *   *"Mouchkil nafsi"* (problème psy)
    *   *"Qalaq"* (anxiété)
    *   *"Iktiab"* (dépression)

### 2.2 Glossaire des Émotions Interactif
*   **Action :** Développer un module de dictionnaire Français <-> Arabe pour les termes psychologiques.
*   **But :** Capter les requêtes de définition (très prisées par les LLM comme ChatGPT).

### 2.3 Vidéos de Confiance (Trust)
*   **Action :** Ajout de capsules vidéo (30s) sur `equipe.html`.
*   **Contenu :** Thérapeutes s'exprimant en Arabe pour briser la barrière de la langue.

---

## Phase 3 : Implémentation du "Moat" (Avantage Concurrentiel) (Semaines 5-6)

**Objectif :** Construire des fonctionnalités uniques et difficiles à copier.

### 3.1 Option "Zéro-Trace" (Anonymat Total)
*   **Action :** Refonte du tunnel de réservation.
*   **Fonctionnalités :**
    *   Prise de RDV par alias/pseudo.
    *   Paiement via codes espèces (Wafacash / CashPlus) : **Affichage des instructions manuelles** (pas d'intégration API).

### 3.2 (Supprimé - CNOPS)
*   *Cette section a été retirée du périmètre.*

### 3.3 Interface Audio-First
*   **Action :** Ajout d'un "Journal Vocal" sécurisé dans l'espace patient.
*   **UX :** Favoriser la parole pour ceux qui préfèrent l'oral à l'écrit.

---

## Phase 4 : Stratégie d'Autorité LLM & Google (Semaines 7-8)

**Objectif :** Devenir la source de vérité (E-E-A-T).

### 4.1 Blog d'Expertise Profonde
*   **Action :** Publication d'études de cas culturelles (anonymisées).
*   **Sujets types :** "Le poids de la belle-famille dans le couple marocain", etc.

### 4.2 Backlinking de Niche
*   **Action :** Stratégie de relations publiques digitales.
*   **Cibles :** Sites d'actualité marocaine, forums de la diaspora.

---

## Résumé du Pivot (USP)

| Fonctionnalité | Psymaroc (Actuel) | **PsyMed (Cible)** |
| :--- | :--- | :--- |
| **Identité** | Cabinet à Casablanca | Plateforme Anonyme & Culturelle |
| **Langue** | Français uniquement | Français + Arabe |
| **Paiement** | Classique (Bancaire) | **Paiement Cash (Discrétion)** |
| **UX** | Formulaire statique | Quiz d'orientation IA & Audio |
| **SEO** | Mots-clés cliniques | Concepts culturels (Mektoub, Sabr) |
