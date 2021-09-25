
function switchSection(id) {
    let allSections = document.getElementsByTagName('section');
    for (var i = 0; i < allSections.length; i++) {
        allSections[i].style.display = 'none';
    }
    document.getElementById(id).style.display = "block"
}

function buryCapsule() {
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


function encryptTimeCapsule(message, startTime) {
    const key = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 15);
    const encryptedMessage = CryptoJS.AES.encrypt(message, key).toString()
    const encryptedTime = CryptoJS.AES.encrypt(startTime, key).toString()

    return encryptedMessage.concat("&t=").concat(encryptedTime).concat("&k=").concat(key)
}

function generateURL (){
    const affirmation = window.localStorage.getItem("affirmation")
    const startingTime = window.localStorage.getItem("start-time")
    const encryptedTimeCapsule = encryptTimeCapsule(affirmation, startingTime)
    return window.location.href.concat("?m=").concat(encryptedTimeCapsule)
}

function copyURL() {
    const encryptedURL = generateURL()
    navigator.clipboard.writeText(encryptedURL);
    alert("Copied to Clipboard, share it with someone special ✨")
    return true
}

function getTimeCapsuleFromQueryParams() {
    const params = new URLSearchParams(window.location.search)
    const message = params.get("m")
    const time = params.get("t")
    const key = params.get("k")
    if (message){
        return {"message" : message,
                "startingTime": time,
                "key" : key }
    } else {
        return null
    }
}

function resetURL() {
    const bareURL = location.protocol + '//' + location.host + location.pathname
    window.location.href = bareURL;
}

function decrypt(val,key) {
    const bytes = CryptoJS.AES.decrypt(val.toString(), key);
    return bytes.toString(CryptoJS.enc.Utf8);
}

function storeCapsule(queryParams){
    const message = decrypt(queryParams.message, queryParams.key)
    const startingTime = decrypt(queryParams.startingTime, queryParams.key)
    window.localStorage.setItem("start-time", startingTime)
    window.localStorage.setItem("affirmation", message)
}

function init() {
    let timeLeft = remainingTime()
    let affirmation = window.localStorage.getItem("affirmation");
    let queryParams = getTimeCapsuleFromQueryParams();
    if(queryParams) {
        storeCapsule(getTimeCapsuleFromQueryParams())
        resetURL()
    }

    if (timeLeft > 0) {
        switchSection("timer-section")
    } else {
        if(affirmation){
            switchSection("love-note-section")
        } else{
            switchSection("writing-section")
        }
    }
}

// Encrypt
var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123');
// console.log(ciphertext.toString())
// Decrypt
var bytes = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
var plaintext = bytes.toString(CryptoJS.enc.Utf8);
// console.log(plaintext)