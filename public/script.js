function switchSection(id) {
    let allSections = document.getElementsByTagName('section');
    for (let i = 0; i < allSections.length; i++) {
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

function buryCapsule(message){
    const secondsSinceEpoch = Math.round(Date.now() / 1000)
    const storedMessage = window.localStorage.getItem("affirmation")
    if(storedMessage != null){
        let confirmed = window.confirm("Would you like to replace the currently buried capsule?")
        if(confirmed == true){
            window.localStorage.setItem("affirmation", message)
            window.localStorage.setItem("start-time", secondsSinceEpoch)
            resetURL()
        }
    }else{
        window.localStorage.setItem("affirmation", message)
        window.localStorage.setItem("start-time", secondsSinceEpoch)
        init()
    }
}

function buryCapsuleFromTextarea(id) {
    const message = document.getElementById(id).value
    clearNote(id)
    buryCapsule(message)
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
function setCapsuleTimer() {
    let timeLeft = remainingTime()
    if(Number.isInteger(timeLeft)){
        let minuteOrMinutes = (timeLeft == 1) ? " minute" : " minutes"
        document.getElementById("timer").innerHTML = String(timeLeft).concat(minuteOrMinutes)
        if(timeLeft <= 0){
            switchSection("love-note-section");
        }
    } else{
        document.getElementById("timer").innerHTML = "????"
    }
}


function enc(plainText, key){
    let b64 = CryptoJS.AES.encrypt(plainText, key).toString();
    let e64 = CryptoJS.enc.Base64.parse(b64);
    let eHex = e64.toString(CryptoJS.enc.Hex);
    return eHex;
}

function dec(cipherText, key){
   let reb64 = CryptoJS.enc.Hex.parse(cipherText);
   let bytes = reb64.toString(CryptoJS.enc.Base64);
   let decrypt = CryptoJS.AES.decrypt(bytes, key);
   let plain = decrypt.toString(CryptoJS.enc.Utf8);
   return plain;
}

function encryptTimeCapsule(message) {
    const key = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 15);
    const encryptedMessage = enc(message, key)
    return encryptedMessage.concat("&k=").concat(key)
}

function generateURL (affirmation){
    const encryptedTimeCapsule = encryptTimeCapsule(affirmation)
    return window.location.href.concat("?m=").concat(encryptedTimeCapsule)
}

// Deprecated, but it works on mobile
 function copy(id) {
    var copyText = document.getElementById(id);
    copyText.style.visibility = "visible"
    copyText.select();
    document.execCommand("copy");
  }


function copyURL(affirmID, urlID) {
    const startingTime = Math.round(Date.now() / 1000)
    const affirmation = document.getElementById(affirmID).value
    const encryptedURL = generateURL(affirmation, startingTime)
    document.getElementById(urlID).value = encryptedURL
    copy(urlID)
//    navigator.clipboard.writeText(encryptedURL);
    alert("Copied Capsule to Clipboard ???")
    return true
}

  

function getTimeCapsuleFromQueryParams() {
    const params = new URLSearchParams(window.location.search)
    let message = params.get("m")
    let key = params.get("k")
    if (message && key){
        return {"message" : message,
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
    buryCapsule(m)
}

function openCapsule(){
    document.getElementById("capsule").innerHTML = window.localStorage.getItem("affirmation")
    // document.getElementById("open-capsule").style.display = "none"
    // document.getElementById("love-note").style.display = "block"
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

// This command checks the remaining time on the capsule once a second 
// and updates the #timer span with the new duration in minutes
// if there's no time left, switch to the love-note section
setInterval(function() {setCapsuleTimer()} , 1000)
