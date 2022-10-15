# PeipLn

PeipLn est un prompteur de question et gestionnaire de score réalisé en application web.

Le projet a été initié et créé par Arthur Decaen. Hugo Briatte y a participé.

## Exécution du programme

L'application peut être desservi par n'importe quel serveur web statique.

L'application, avec le code source tel quel, peut être utilisé par n'importe quel navigateur web supportant ECMAScript 6. Pour baisser la version nécessaire d'ECMAScript, il faut utliser un "compilateur" tel que Babel.

## Dépendances du projet

* Boxicons, version 2.1.2 (Décrit par le code HTML).

## Fonctionnalités actuelles

* Ajouter, modifier et supprimer des joueurs, chacun associé à des points.
* Sauvegarder les joueurs et score dans la mémoire du navigateur, et le charger au besoin.
* Charger une partie sous la forme d'un objet JSON.
    * Une partie contient une série de jeu de question. Chaque question peut être de la forme textuelle, par image ou son.
    * Les images et sons sont chargés par des chemins HTTP/HTTPS.
    * La réponse est cachée par défaut, et peut être affichée par l'utilisateur.
    * Une liste de réponse possible peut être affiché, avec le nombre de réponse souahité.
    * Un prompteur sous forme de pop-up peut être ouvert pour avoir en toute circonstance la réponse à la question affichée.
    * Les questions défilent tel l'ordre d'écriture dans l'objet JSON, ou de manière aléatoire.

## Format JSON d'une partie

L'objet JSON représentant une partie est composé tel quel :

```json
[
    {
        "name": "string",
        "type": "string",
        "rules": "string",
        "content": [
            {
                "type": "text" | "picture" | "audio",
                "answers": ["stringA", ...],
                "question": "string",
                "content": "string"
            },
            [...]
        ]
    },
    [...]
]
```

### Format JSON d'un jeu de question

Un jeu de question est défini par son nom (obligatoire), son type (obligatoire), et ses régles (facultatif). Ces valeurs sont simplements affichés à l'écran et sont interprétables comme l'utilisateur le souhaite.

Un jeu contient aussi un tableau "content", contenant l'ensemble des questions.

### Format JSON d'une question

Une question peut être de trois "type" :

* "text" si la question est purement textuelle
* "picture" si l'on souhaite afficher une image
* "audio" si l'on souhaite jouer un son

Une question est explicitée par son champ "question". Le champ "content" est un lien URL ou un chemin relatif à la racine du serveur web menant vers la ressource à afficher, si la question est de type "picture" ou "audio".

Le champ "answers" contient un tableau avec les différentes réponses possibles. La première réponse dans l'ordre du tableau est la bonne.