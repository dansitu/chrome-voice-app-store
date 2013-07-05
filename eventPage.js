
console.log('Voice extension loaded');
chrome.commands.onCommand.addListener(function(command){
  if(command === 'listen-for-speech'){
    startListening();
    return;
  }
});

function startListening(){
  console.log("attempting to start listening");
  chrome.experimental.speechInput.start({}, recordingStarted);
}

function recordingStarted(){
  if (chrome.runtime.lastError) {
    console.log("Couldn't start speech input: " + chrome.runtime.lastError.message);
    return;
  }
  console.log("started listening");
  setStartIcon();
}

function recognitionSucceeded(result){
  console.log("recognized:", result);
}

function recognitionFailed(error){
  console.log("failed to recognize:", error);
}

function soundStarted(){
  console.log("sound started");
}

function soundEnded(){
  console.log("sound ended");
  setStopIcon();
}

function setStartIcon() {
  chrome.browserAction.setIcon({ path: "start.png" });
}

function setStopIcon() {
  chrome.browserAction.setIcon({ path: "stop.png" });
}

chrome.experimental.speechInput.onResult.addListener(recognitionSucceeded);
chrome.experimental.speechInput.onError.addListener(recognitionFailed);

chrome.experimental.speechInput.onSoundStart.addListener(soundStarted);
chrome.experimental.speechInput.onSoundEnd.addListener(soundEnded);
