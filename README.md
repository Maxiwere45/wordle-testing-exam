# Wordle tesing exam

Wordle Testing Exam est un projet de test de code pour le jeu Wordle. Il est conçu dans le cadre de l'examen du cours "M1S2-Méthodologies de tests et tests unitaires".

## Sommaire

- [Sommaire](#sommaire)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Tests](#tests)
- [Contributeurs](#contributeurs)

## Installation

Pour installer le projet, clonez le dépôt et installez les dépendances depuis le répertoire du projet :

```bash
npm install
```

## Utilisation

Pour lancer le projet, utilisez la commande suivante :

```bash
npm run dev
```

Cela lancera le serveur de développement et vous pourrez accéder à l'application via votre navigateur à l'adresse suivante :
- [localhost:5173](http://localhost:5173/)

## Tests

- Pour lancer les tests, utilisez la commande suivante :

```bash
npm test
```

- Pour les tests de couverture, utilisez :

```bash
npm run test-coverage
```

### Liste des tests implementés

- Test de validation des mots
    - Test de validation des mots de 5 lettres ✅
    - Test de validation des mots alphanumériques ✅
    - Test de validation des mots contenus dans le dictionnaire ✅

- Test de la logique du jeu Wordle
    - Test de la logique de vérification des lettres à la bonne position ✅
    - Test de la logique de vérification des lettres à la mauvaise position ✅
    - Test de la logique de vérification des lettres absentes ✅
    - Test de la logique de vérification des lettres en double ✅

- Test de l'état du jeu
    - Test de blocage du jeu si le wordle n'est pas chargé ✅
    - Test de blocage du jeu si le wordle n'est pas de longueur 5 ✅
    - Test de blocage du jeu si le wordle n'est pas alphanumérique ✅
    - Test de blocage du jeu si le wordle n'est pas dans le dictionnaire ✅
    - Test de l'état du compteur de tentatives après chaque essai ✅
    - Test de l'état du jeu après une tentative non réussie ✅
    - Test de l'état du jeu après une victoire ✅
    - Test de l'état du jeu après une défaite ✅
    - Test de l'état du jeu après le dépassement du nombre de tentatives ✅
    - Test de réinitialisation de l'état du jeu ✅

- Test de la logique du jeu avec un joueur défini
    - Test de la logique du jeu si le joueur propose un mot n'ayant pas 5 lettres ✅
    - Test de la logique du jeu si le joueur propose un mot n'étant pas alphanumérique ✅
    - Test de la logique du jeu si le joueur propose un mot n'étant pas dans le dictionnaire ✅
    - Test de la logique du jeu avec un joueur qui a gagné (mise à jour du nombre de parties gagnée) ✅
    - Test de la logique du jeu avec un joueur qui a gagné (mise à jour des essais moyens du joueur) ✅
    - Test de la logique du jeu avec un joueur qui a gagné (mise à jour du taux de réussite du joueur) ✅
    - Test de la logique du jeu avec un joueur qui a gagné après 2 parties successives (mise à jour des streak du joueur) ✅
    - Test de la logique du jeu avec un joueur qui a gagné (mise à jour du score du joueur) ✅


## Contributeurs

- ANRIFOU Amdjad



