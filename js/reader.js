var json = undefined
var currentGame = undefined
var currentQuestion = undefined

/**
 * Charge un jeu
 * @param {Blob} file Le fichier JSON à lire
 */
function initGame(file) {
    var reader = new FileReader();
    reader.onload = function(evt) {
        defaultJSON = JSON.parse(evt.target.result);
        console.log(defaultJSON);
        json = defaultJSON;
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
        div.innerHTML += `<div class="card" onclick="showGame(${i})">\
                            <div class="content">${game.name}</div>\
                            <div class="type">${game.type}</div>\
                        </div>`
        i++
    });
}

/**
 * Affiche un jeu d'ID donné 
 * @param {number} id L'ID du jeu (sa position dans le tableau de jeux)
 */
function showGame(id) {
    const div = document.getElementById("questionZone");
    const card = document.getElementById("questionInner");

    card.innerHTML = `<div id="questionTitle">${json[id].name}</div>\
                    <div id="questionRule">${json[id].rules}</div>`;

    div.style.top = "0%";
    currentGame = json[id];
    currentQuestion = 0;

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
 * Ajoute un joueur dans la liste des joueurs
 */
function addPlayer() {
    var div = document.getElementById("playerZone");

    var newPlayer = document.createElement("div");
    newPlayer.classList.add("player");
    if (div.childNodes.length == 0)
        newPlayer.classList.add("current");

    var newName = document.createElement("input");
    newName.type = "text";
    newName.classList.add("name");
    newName.value = "Name";
    newName.style.fontWeight = "bold";
    newName.style.color = "#c45118";
    newPlayer.appendChild(newName);

    var newScore = document.createElement("input");
    newScore.type = "number";
    newScore.classList.add("score");
    newScore.value = "0";
    newScore.style.fontSize = "20px";
    newPlayer.appendChild(newScore);

    div.appendChild(newPlayer);
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

/**
 * Affiche une prochaine question
 * @param {number} cursor Le nombre de question à passer
 */
function showContent(cursor) {
    const card = document.getElementById("questionInner");
    const prev = document.getElementById("previous");
    const next = document.getElementById("next");

    currentQuestion += cursor;

    card.innerHTML = `<div id="questionTitle">Question n°${(currentQuestion)}</div>`;

    if (currentGame.content[currentQuestion - 1].question != undefined)
        card.innerHTML += `<div id="questionQuestion">${currentGame.content[currentQuestion - 1].question}</div>`;

    switch (currentGame.content[currentQuestion - 1].type) {
        case "text":
            card.innerHTML += `<div id="questionRule">${currentGame.content[currentQuestion - 1].content}</div>`;
            break;
        case "picture":
            card.innerHTML += `<div id="questionRule"><img src="${currentGame.content[currentQuestion - 1].content}"></div>`;
            break;
        case "audio":
            card.innerHTML += `<div id="questionRule"><audio controls><source src="${currentGame.content[currentQuestion - 1].content}" type="audio/mpeg"></audio></div>`;
            break;
    }

    card.innerHTML += `<div id="questionAnswer" tabindex="0">${currentGame.content[currentQuestion - 1].answer}</div>`;

    if (currentQuestion <= 1) { prev.style.left = "-100%"; } else { prev.style.left = "0%"; }
    if (currentQuestion >= currentGame.content.length) { next.style.right = "-100%"; } else { next.style.right = "0%"; }
}