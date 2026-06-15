# Rapport de Projet

## Module d'Authentification & Profil Utilisateur — Application e-joutia

**Projet :** PROJET 1 / 6 — Module d'Authentification & Profil Utilisateur
**Application :** e-joutia (marketplace mobile d'objets de seconde main)
**Technologie :** React Native (Expo) — JavaScript
**Date :** Juin 2026

---

## 1. Introduction

Ce rapport présente le travail réalisé pour le **PROJET 1** de l'application
mobile **e-joutia**, une plateforme d'achat/vente d'objets d'occasion inspirée
du modèle Wallapop.

Ce premier module constitue la **fondation** de l'application : c'est lui qui
gère l'**accès sécurisé** des utilisateurs (connexion / inscription) ainsi que
la **gestion du profil public** d'un vendeur, élément essentiel pour
instaurer un climat de confiance entre acheteurs et vendeurs.

## 2. Objectifs du projet

Conformément au cahier des charges, les objectifs suivants ont été couverts :

- Mettre en place un **écran de Connexion / Inscription** avec saisie de
  l'email, du mot de passe, du nom d'utilisateur et de la ville de résidence.
- Implémenter une **validation en temps réel** des champs (email valide,
  mot de passe de 6 caractères minimum).
- Créer un **écran Profil Public** (vue vendeur) affichant la photo, le nom,
  la localisation et la date d'inscription.
- Ajouter une **section Avis** avec note moyenne sur 5 étoiles et des
  commentaires fictifs.
- Ajouter des **badges de confiance** ("Profil vérifié", "Répond rapidement").
- Mettre en place une **Stack Navigation** qui bascule automatiquement entre
  les écrans d'authentification et les écrans principaux.
- Gérer les formulaires avec **Formik + Yup**.
- Assurer la **persistance de la session** avec **AsyncStorage**.

## 3. Architecture générale

### 3.1 Stack technique

| Brique | Outil utilisé | Rôle |
|---|---|---|
| Framework mobile | **Expo (React Native)** | Développement et exécution de l'application |
| Navigation | **React Navigation (Native Stack)** | Gestion des écrans et du flux Auth → App |
| Formulaires | **Formik** | Gestion des champs, soumission, état du formulaire |
| Validation | **Yup** | Règles de validation déclaratives |
| Persistance locale | **AsyncStorage** | Sauvegarde de la session utilisateur |
| État global | **Context API (React)** | Partage de l'état d'authentification |
| Icônes | **@expo/vector-icons** | Étoiles, badges, icônes de localisation |

### 3.2 Arborescence du projet

```
e-joutia/
├── App.js                       # Point d'entrée : Provider + Navigation
├── app.json / package.json
├── assets/                       # Icônes de l'application
├── src/
│   ├── context/
│   │   └── AuthContext.js        # État d'authentification global
│   ├── navigation/
│   │   ├── RootNavigator.js       # Switch Auth ↔ App
│   │   ├── AuthNavigator.js       # Stack : Login, Register
│   │   └── AppNavigator.js        # Stack : Home, Profile
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   └── RegisterScreen.js
│   │   ├── HomeScreen.js
│   │   └── ProfileScreen.js
│   ├── components/
│   │   ├── FormField.js
│   │   ├── PrimaryButton.js
│   │   ├── StarRating.js
│   │   ├── TrustBadge.js
│   │   └── ReviewCard.js
│   ├── data/
│   │   └── mockProfile.js         # Avis et badges fictifs
│   ├── theme/
│   │   └── colors.js
│   └── validation/
│       └── schemas.js             # Schémas Yup (login / register)
├── rapport.md
└── explications.md
```

### 3.3 Flux de navigation

```
Démarrage de l'app
        │
        ▼
  Lecture AsyncStorage (session existante ?)
        │
   ┌────┴────┐
   │         │
  NON       OUI
   │         │
   ▼         ▼
AuthNavigator   AppNavigator
 - Login         - Home
 - Register      - Profile
   │
   │ (connexion / inscription réussie)
   └────────────► AppNavigator
```

Ce flux est entièrement automatique : aucune navigation manuelle n'est
nécessaire après une connexion ou une déconnexion, car le `RootNavigator`
observe l'état global d'authentification et affiche la stack appropriée.

## 4. Fonctionnalités réalisées

### 4.1 Écran de Connexion (`LoginScreen`)

- Formulaire **email + mot de passe** géré par Formik.
- Validation Yup en temps réel :
  - email au format valide ;
  - mot de passe de 6 caractères minimum.
- Affichage d'un message d'erreur sous chaque champ dès qu'il est touché.
- Lien vers l'écran d'inscription.

### 4.2 Écran d'Inscription (`RegisterScreen`)

- Formulaire **nom d'utilisateur, ville de résidence, email, mot de passe,
  confirmation du mot de passe**.
- Mêmes règles de validation que la connexion, plus :
  - nom d'utilisateur ≥ 3 caractères ;
  - ville obligatoire ;
  - confirmation de mot de passe identique au mot de passe.
- À l'inscription, le profil est enregistré localement puis l'utilisateur est
  automatiquement connecté.

### 4.3 Persistance de session (`AuthContext` + `AsyncStorage`)

- Au lancement de l'application, une vérification de session est effectuée
  dans `AsyncStorage`.
- Si une session existe, l'utilisateur est redirigé directement vers l'écran
  principal (pas de reconnexion nécessaire).
- Un bouton **Se déconnecter** (sur `HomeScreen`) supprime la session et
  ramène automatiquement aux écrans d'authentification.

### 4.4 Écran Profil Public (`ProfileScreen`)

- **Photo** (avatar généré), **nom**, **ville** et **date d'inscription** de
  l'utilisateur connecté.
- **Badges de confiance** : "Profil vérifié" et "Répond rapidement".
- **Note moyenne** affichée sous forme d'étoiles (composant `StarRating`),
  calculée à partir d'avis fictifs.
- **Liste d'avis** (composant `ReviewCard`) : avatar, nom, note, commentaire
  et date pour chaque avis fictif.

### 4.5 Navigation automatique (`RootNavigator`)

- Implémentée avec **React Navigation (Native Stack)**.
- Deux stacks distinctes : `AuthNavigator` (Login/Register) et
  `AppNavigator` (Home/Profile).
- Le choix de la stack affichée dépend uniquement de l'état `user` fourni
  par `AuthContext`.

## 5. Choix techniques (synthèse)

Les justifications détaillées de chaque choix sont disponibles dans le
fichier `explications.md`. En résumé :

- **Expo** a été choisi pour simplifier le développement (pas besoin
  d'environnement natif Android/iOS pour démarrer).
- **Context API** a été préféré à Redux car l'état à partager (utilisateur
  connecté) est simple et limité à ce module.
- **AsyncStorage** correspond exactement à la contrainte du cahier des
  charges pour la persistance de session.
- Un **mini "backend local"** simulé dans `AuthContext` (liste d'utilisateurs
  stockée dans AsyncStorage) permet de démontrer un cycle complet
  inscription → connexion → déconnexion sans dépendre d'une API externe.

## 6. Vérification effectuée

Le projet a été initialisé avec `create-expo-app`, toutes les dépendances ont
été installées (`react-navigation`, `formik`, `yup`,
`@react-native-async-storage/async-storage`, `@expo/vector-icons`), puis le
projet a été **compilé avec succès** (`npx expo export --platform web`),
confirmant l'absence d'erreurs d'import ou de syntaxe.

## 7. Conclusion et perspectives

Le PROJET 1 fournit une base solide et réutilisable pour la suite de
l'application e-joutia : un système d'authentification fonctionnel, persistant
et validé, ainsi qu'un écran de profil public qui pourra être enrichi par les
projets suivants (annonces, recherche, messagerie, favoris, etc.).

Pistes d'évolution pour les prochains projets :

- Remplacer le mini "backend local" par une vraie API (authentification par
  token JWT).
- Permettre à l'utilisateur de choisir/uploader sa propre photo de profil
  (lié au PROJET 4 — Formulaire de Publication).
- Afficher, sur le profil, les annonces publiées par le vendeur (lié aux
  PROJETS 2 et 4).
