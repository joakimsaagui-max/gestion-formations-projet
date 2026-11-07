# Gestion des étudiants et des formations

Application web de gestion des étudiants, des formations et des inscriptions.

**Technologies :** Laravel 12 (API REST), MySQL, React JS (Vite), Axios.
**Réalisé par :** SAAGUI Joakim , DJIMASSE Abdo , LANTONKPODE Calmus

## Contenu du dépôt

- `gestion-formations/` : backend Laravel (API REST)
- `gestion-formations-front/` : frontend React
- `gestion_formations.sql` : base de données
- Rapport de projet

## Fonctionnalités

- Gestion des étudiants, des formations et des inscriptions (CRUD)
- Validation des données côté serveur
- Recherche multicritère (texte + formation)
- Tableau de bord statistique

## Prérequis

PHP 8.2+, Composer, Node.js, XAMPP (MySQL).

## Lancer le backend

1. Démarrer MySQL dans XAMPP.
2. Créer la base `gestion_formations` dans phpMyAdmin, puis importer `gestion_formations.sql`.
3. Dans le dossier `gestion-formations` :

```bash
cp .env.example .env
composer install
php artisan key:generate
php artisan serve
```

4. Dans `.env`, vérifier `DB_CONNECTION=mysql`, `DB_DATABASE=gestion_formations`, `DB_USERNAME=root` et `DB_PASSWORD=` (vide).

L'API est disponible sur `http://127.0.0.1:8000/api`.

## Lancer le frontend

Dans le dossier `gestion-formations-front` :

```bash
npm install
npm run dev
```

Ouvrir `http://localhost:5173`.

## Routes principales de l'API

| Méthode | Route | Rôle |
|---|---|---|
| GET, POST | `/api/students` | Lister (`?q=`, `?formation_id=`), créer |
| GET, PUT, DELETE | `/api/students/{id}` | Voir, modifier, supprimer |
| GET, POST | `/api/formations` | Lister (`?q=`), créer |
| GET, POST | `/api/inscriptions` | Lister, inscrire |
| GET | `/api/stats` | Statistiques du tableau de bord |
