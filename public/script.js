
function switchSection(id) {
    let allSections = document.getElementsByTagName('section');
    for (var i = 0; i < allSections.length; i++) {
        allSections[i].style.display = 'none';
    }
    document.getElementById(id).style.display = "block"
}

function clearNote(id) {
    document.getElementById(id).value = ""
}

function resetNote(){
    window.localStorage.setItem("start-time", "null")
    window.localStorage.setItem("affirmation", "null")
    switchSection("writing-section")
}

function buryCapsule(id) {
    const secondsSinceEpoch = Math.round(Date.now() / 1000)
    const affirmation = document.getElementById(id).value
    window.localStorage.setItem("affirmation", affirmation)
    window.localStorage.setItem("start-time", secondsSinceEpoch)
    clearNote(id)
    init()
}

function remainingTime() {
    let startingTime = parseInt(window.localStorage.getItem("start-time"))
    if(startingTime){
        let endTime = startingTime + (777 * 60)
        let secondsSinceEpoch = Math.round(Date.now() / 1000)
        return Math.ceil((endTime - secondsSinceEpoch) / 60)
    }
    return null
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


function enc(plainText, key){
    var b64 = CryptoJS.AES.encrypt(plainText, key).toString();
    var e64 = CryptoJS.enc.Base64.parse(b64);
    var eHex = e64.toString(CryptoJS.enc.Hex);
    return eHex;
}

function dec(cipherText, key){
   var reb64 = CryptoJS.enc.Hex.parse(cipherText);
   var bytes = reb64.toString(CryptoJS.enc.Base64);
   var decrypt = CryptoJS.AES.decrypt(bytes, key);
   var plain = decrypt.toString(CryptoJS.enc.Utf8);
   return plain;
}

function encryptTimeCapsule(message, startTime) {
    const key = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 15);
    const encryptedMessage = enc(message, key)
    const encryptedTime = enc(startTime,key)

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
    let message = params.get("m")
    let t = params.get("t")
    let key = params.get("k")
    if (message && t && key){
        return {"message" : message,
                "startingTime": t,
                "key" : key }
    } else {
        return null
    }
}

function resetURL() {
    const bareURL = location.protocol + '//' + location.host + location.pathname
    window.location.href = bareURL;
}


function storeCapsule(queryParams){
    let m = dec(queryParams.message, queryParams.key)
    let startingTime = dec(queryParams.startingTime, queryParams.key)
//    alert(queryParams.message)
//    alert(queryParams.key)
//    alert(queryParams.startingTime)
    alert(m)
    alert(startingTime)
    window.localStorage.setItem("start-time", startingTime)
    window.localStorage.setItem("affirmation", m)
}

function init() {
    let timeLeft = remainingTime()
    let affirmation = window.localStorage.getItem("affirmation");
    let queryParams = getTimeCapsuleFromQueryParams();
    if(queryParams != null) {
        storeCapsule(queryParams)
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