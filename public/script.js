
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
    const affirmation = document.getElementById("love-note-textarea").value
    window.localStorage.setItem("affirmation", affirmation)
    window.localStorage.setItem("start-time", secondsSinceEpoch)
    init()
}

function clearNote() {
    window.localStorage.setItem("start-time", "null")
    window.localStorage.setItem("affirmation", "")
    document.getElementById("love-note-textarea").value = ""
    switchSection("writing-section")
}

function remainingTime() {
    let startingTime = parseInt(window.localStorage.getItem("start-time"))
    let endTime = startingTime + (777 * 60)
    let secondsSinceEpoch = Math.round(Date.now() / 1000)
    return Math.ceil((endTime - secondsSinceEpoch) / 60)
}

// this function also manipulates the state
function setTimer() {
    let timeLeft = remainingTime()
    if(Number.isInteger(timeLeft)){
        let minuteOrMinutes = (timeLeft == 1) ? " minute" : " minutes"
        document.getElementById("timer").innerHTML = String(timeLeft).concat(minuteOrMinutes)
        if(timeLeft <= 0){
            document.getElementById("love-note").innerHTML = window.localStorage.getItem("affirmation")
            switchSection("love-note-section");
        }
    } else{
        document.getElementById("timer").innerHTML = ""
    }
}

setInterval(function() {setTimer()} , 500)

function init() {
    let timeLeft = remainingTime()
    let affirmation = window.localStorage.getItem("affirmation");

    if (timeLeft > 0) {
        switchSection("timer-section")
    } else {
        console.log(affirmation)
        if(affirmation){
            switchSection("love-note-section")
        } else{
            switchSection("writing-section")
        }
    }
}