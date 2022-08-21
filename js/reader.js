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
    var i = 0

    json.forEach(game => {
        div.innerHTML += '<div class="card" onclick="showQuestion(' + i + ')">\
                            <div class="content">' + game.name + '</div>\
                            <div class="type">' + game.type + '</div>\
                        </div>'
        i++
    });
}

function showQuestion(id) {
    const div = document.getElementById("questionZone")
    const card = document.getElementById("questionInner")

    card.innerHTML = '<div id="questionTitle">' + json[id].name + '</div>\
                    <div id="questionRule">' + json[id].rules + '</div>'

    div.style.top = "0%"
}

function hideQuestion() {
    const div = document.getElementById("questionZone")

    div.style.top = "-100%"
}

function addPlayer() {
    var div = document.getElementById("playerZone")

    div.innerHTML += '<div class="player">\
                        <input type="text" class="name" value="Name" style="font-weight: bold; color: #c45118;">\
                        <input type="text" class="score" value="0" style="font-size: 20px;">\
                    </div>'
}

function removePlayer() {
    var div = document.getElementById("playerZone")
    div.removeChild(div.lastChild)
}