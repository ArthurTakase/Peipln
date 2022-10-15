/// Utils

/**
 * Shuffle an array based on the Fisher-Yates Shuffle
 * Source : https://github.com/surbhioberoi/fisher-yates-shuffle/blob/master/src/shuffle.js 
 * @param {Array} array 
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const random = Math.floor(Math.random() * (array.length - 1));
        const temp = array[random];
        array[random] = array[i];
        array[i] = temp;
    }
    return array;
}

//// Website data and functions

// An array containing all the games
var games = undefined;

// The data of the current game
var currentGame = undefined;

// The current question index number
var currentQuestionIndex = undefined;

// The response window
var adminWindow = undefined;

/// Sauvegarde et chargement des joueurs

/**
 * Sauvegarde la liste des joueurs dans la mémoire du navigateur, si elle est non vide
 */
function savePlayers() {
    const players = [...document.getElementsByClassName("player")]
    .map(elem => ({
        name : elem.getElementsByClassName("name")[0].value,
        score : elem.getElementsByClassName("score")[0].value
    }));
    if(players.length > 0) {
        localStorage.setItem("players", JSON.stringify(players));
    }
}

/**
 * Charge la liste des joueurs contenu dans la mémoire du navigateur, si présent
 */
function loadPlayers() {
    const playerString = localStorage.getItem("players");
    if(playerString != null) {
        var div = document.getElementById("playerZone");
        div.innerHTML = "";
        JSON.parse(playerString).forEach(player => addPlayerWithData(player.name, player.score));
    }
}

// Réalise une backup des joueurs toute les 30 secondes
setInterval(savePlayers, 30000);

/**
 * Ajoute un joueur avec les informations données
 * @param {string} name Le nom du joueur
 * @param {string} score Le score du joueur
 */
function addPlayerWithData(name, score) {
    var div = document.getElementById("playerZone");

    var newPlayer = document.createElement("div");
    newPlayer.classList.add("player");
    if (div.childNodes.length == 0)
        newPlayer.classList.add("current");

    var newName = document.createElement("input");
    newName.type = "text";
    newName.classList.add("name");
    newName.value = name;
    newName.style.fontWeight = "bold";
    newName.style.color = "#c45118";
    newPlayer.appendChild(newName);

    var newScore = document.createElement("input");
    newScore.type = "number";
    newScore.classList.add("score");
    newScore.value = score;
    newScore.style.fontSize = "20px";
    newPlayer.appendChild(newScore);

    div.appendChild(newPlayer);
}

/**
 * Ajoute un joueur dans la liste des joueurs
 */
function addPlayer() {
    addPlayerWithData("Name", "0");
}

/**
 * Supprime le joueur actuellement sélectionné de la liste des joueurs
 */
function removePlayer() {
    var div = document.getElementById("playerZone");
    var i = 0;

    while(i < div.childNodes.length && !div.childNodes[i].classList.contains("current")) {
        i += 1;
    }
    if(i < div.childNodes.length) {
        div.childNodes[(i + 1) % div.childNodes.length].classList.add("current");
        div.removeChild(div.childNodes[i]);
    }
}

/**
 * Passe le joueur actuel
 */
function nextPlayer() {
    var div = document.getElementById("playerZone");
    var current = div.getElementsByClassName("current")[0];
    var next = null;
    if(current == null) {
        next = div.firstElementChild;
    } else {
        try { var next = current.nextElementSibling; } catch (e) { }
        if (next == null)
            next = div.firstElementChild;
        current.classList.remove("current");
    }
    next.classList.add("current");
}

/// Admin window

/**
 * Ouvre une pop-up qui sera destiné à afficher la réponse à la question de manière caché.
 */
function openAdminWindow() {
    adminWindow = window.open("","Réponses","popup,width=300,height=100");
    adminWindow.document.open();
    adminWindow.document.write(`
    <html>
    <head>
    <title>Réponses</title>
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="css/style.css">
    </head>
    <body>
    <div id="response"></div>
    </body>
    </html>
    `);
    adminWindow.document.close();
}

/// Game and question functions

/**
 * Charge un jeu
 * @param {Blob} file Le fichier JSON à lire
 */
function initGame(file) {
    var reader = new FileReader();
    reader.onload = function(evt) {
        defaultJSON = JSON.parse(evt.target.result);
        games = defaultJSON;
        addGame(defaultJSON);
    };
    reader.readAsText(file);
}

/**
 * Ajoute l'ensemble des jeux dans la page HTML
 * @param {Array} games : Un tableau contenant une série de jeux 
 */
function addGame(games) {
    const div = document.getElementById("cardZone");
    var i = 0;

    div.innerHTML = "";

    games.forEach(game => {
        div.innerHTML += `<div class="card" onclick="showGame(${i})">
                            <div class="content">${game.name}</div>
                            <div class="type">${game.type}</div>
                        </div>`
        i++
    });
}

/**
 * Affiche un jeu d'ID donné 
 * @param {number} id L'ID du jeu (sa position dans le tableau de jeux)
 */
function showGame(id) {
    const questionZone = document.getElementById("questionZone");
    const questionInner = document.getElementById("questionInner");

    questionInner.innerHTML = `<div id="questionTitle">${games[id].name}</div>\
                    <div id="questionRule">${games[id].rules}</div>
                    <div id="randomizeBoxDiv">
                        <input type="checkbox" id="randomizeBox" name="randomizeBox">
                        <label id="randomizeBoxLabel" for="randomizeBox">Questions au hasard?</label>
                    </div>`;

    questionZone.style.top = "0%";
    currentGame = games[id];
    currentQuestionIndex = -1;

    document.getElementById("previous").style.left = "-100%";
    document.getElementById("next").style.right = "0%";
}

/**
 * Cache la zone de question
 */
function hideQuestion() {
    const div = document.getElementById("questionZone");
    div.style.top = "-100%";
}


/**
 * Afficher un nombre de réponses donnée selon l'input "numberOfAnswerInput", de manière aléatoire
 * 
 */
function showResponses() {
    const questionInner = document.getElementById("questionInner");
    const numberOfResponse = parseInt(document.getElementById("numberOfAnswerInput").value);
    const goodResponse = currentGame.content[currentQuestionIndex].answers[0];
    const responseToShow = shuffleArray(currentGame.content[currentQuestionIndex].answers.slice(1)).slice(0, numberOfResponse - 1);
    responseToShow.push(goodResponse);

    document.getElementById("questionResponses").innerHTML = 
    shuffleArray(responseToShow)
    .map(response => `<div id="responseText">${response}</div>`)
    .reduce((prev, current) => prev + current, "");
}

/**
 * Affiche une prochaine question
 * @param {number} cursor Le nombre de question à passer
 */
function showContent(cursor) {
    const questionInner = document.getElementById("questionInner");
    const prev = document.getElementById("previous");
    const next = document.getElementById("next");

    if(currentQuestionIndex == -1 && document.getElementById("randomizeBox").checked) {
        currentGame = structuredClone(currentGame);
        shuffleArray(currentGame.content);
    }

    currentQuestionIndex += cursor;

    questionInner.innerHTML = `<div id="questionTitle">Question n°${(currentQuestionIndex + 1)}</div>`;

    if (currentGame.content[currentQuestionIndex].question != undefined)
        questionInner.innerHTML += `<div id="questionQuestion">${currentGame.content[currentQuestionIndex].question}</div>`;

    switch (currentGame.content[currentQuestionIndex].type) {
        case "picture":
            questionInner.innerHTML += `<div id="questionImage"><img src="${currentGame.content[currentQuestionIndex].content}"></div>`;
            break;
        case "audio":
            questionInner.innerHTML += `<div id="questionAudio"><audio controls src="${currentGame.content[currentQuestionIndex].content}"></audio></div>`;
            break;
    }

    questionInner.innerHTML += `<div id="numberOfResponse">
    <div>Nombre de réponses à afficher</div>
    <input type="number" id="numberOfAnswerInput">
    <button type="button" onclick="showResponses()" id="numberOfAnswerButton">Afficher</button>
    </div>`

    questionInner.innerHTML += `<div id="questionResponses"></div>`;
    questionInner.innerHTML += `<div id="questionAnswer" tabindex="0">${currentGame.content[currentQuestionIndex].answers[0]}</div>`;

    if(adminWindow != undefined)
        adminWindow.document.getElementById("response").innerHTML = `Réponse : ${currentGame.content[currentQuestionIndex].answers[0]}`;

    if (currentQuestionIndex < 1) { prev.style.left = "-100%"; } else { prev.style.left = "0%"; }
    if (currentQuestionIndex + 1 >= currentGame.content.length) { next.style.right = "-100%"; } else { next.style.right = "0%"; }
}