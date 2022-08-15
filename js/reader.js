var json = undefined

function initGame(file) {
    var reader = new FileReader();
    reader.onload = function(evt) {
        defaultJSON = JSON.parse(evt.target.result)
        console.log(defaultJSON)
        json = defaultJSON
        addGame(defaultJSON)
    };
    reader.readAsText(file);
}

function addGame(json) {
    const div = document.getElementById("cardZone")

    json.forEach(game => {
        div.innerHTML += '<div class="card" onclick="showQuestion()">\
                            <div class="content">' + game.name + '</div>\
                            <div class="type">' + game.type + '</div>\
                        </div>'
    });
}

function showQuestion() {
    const div = document.getElementById("questionZone")

    div.style.top = "0%"
}

function hideQuestion() {
    const div = document.getElementById("questionZone")

    div.style.top = "-100%"
}