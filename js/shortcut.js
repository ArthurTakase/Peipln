document.addEventListener('keydown', (e) => {
    if (!e.ctrlKey) return

    switch (e.key) {
        case "a":
            if (currentQuestion == undefined || currentQuestion <= 1) break
            showContent(-1)
            break
        case "z":
            if (currentGame == undefined) break
            if (currentQuestion >= currentGame.content.length) break
            showContent(1)
            break
        case "e":
            nextPlayer()
            break
        case "ArrowLeft":
            console.log("left")
            break
        case "ArrowRight":
            console.log("right")
            break
        case "ArrowUp":
            console.log("up")
            break
        case "ArrowDown":
            console.log("down")
            break
        default:
            break
    }
    e.preventDefault()
});