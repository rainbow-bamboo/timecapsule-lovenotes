
function switchSection(id) {
    let allSections = document.getElementsByTagName('section');
    for (var i = 0; i < allSections.length; i++) {
        allSections[i].style.display = 'none';
    }
    document.getElementById(id).style.display = "block"
}

function buryCapsule() {
    console.log("capsule buried")
    const secondsSinceEpoch = Math.round(Date.now() / 1000)
    window.localStorage.setItem("start-time", secondsSinceEpoch)
    init()
}

function clearNote() {
    window.localStorage.setItem("start-time", "null")
    switchSection("writing-section")
}

function remainingTime() {
    let startingTime = parseInt(window.localStorage.getItem("start-time"))
    let endTime = startingTime + (.5 * 60)
    let secondsSinceEpoch = Math.round(Date.now() / 1000)
    return Math.ceil((endTime - secondsSinceEpoch) / 60)
}

// this function also manipulates the state
function setTimer() {
    let timeLeft = remainingTime()
    if(Number.isInteger(timeLeft)){
        document.getElementById("timer").innerHTML = String(timeLeft)
        if(timeLeft <= 0){
            switchSection("love-note-section");
        }
    } else{
        document.getElementById("timer").innerHTML = ""
    }
}

setInterval(function() {setTimer()} , 500)

function init() {
    let timeLeft = remainingTime()

    if (timeLeft > 0) {
        switchSection("timer-section")
    } else {
        switchSection("love-note-section")
    }
}