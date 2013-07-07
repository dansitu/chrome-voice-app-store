
console.log('Voice extension loaded');
chrome.commands.onCommand.addListener(function(command){
  if(command === 'listen-for-speech'){
    startListening();
    return;
  }
});

function startListening(){
  console.log("attempting to start listening");
  chrome.experimental.speechInput.start({
    getGrammarUrl: "ABCD"
  }, recordingStarted);
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

function grammarUrl(){
  var myGrammar = new Blob([getGrammar()], {
   type: 'text/xml'});

  var grammarUrl = window.URL.createObjectURL(myGrammar); 

  return grammarUrl;
}

function getGrammar(){
    return
      '<grammar xmlns="http://www.w3.org/2001/06/grammar"'
      +' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' 
      +' xsi:schemaLocation="http://www.w3.org/2001/06/grammar '
      +'http://www.w3.org/TR/speech-grammar/grammar.xsd"'
      +' xml:lang="en-US" version="1.0">'

      +'<rule id="yes">'
      +'<one-of>'
      +'<item>computer</item>'
      +'<item>cat</item>'
      +'</one-of>'
      +'</rule> '
      +'</grammar>';

}

chrome.experimental.speechInput.onResult.addListener(recognitionSucceeded);
chrome.experimental.speechInput.onError.addListener(recognitionFailed);

chrome.experimental.speechInput.onSoundStart.addListener(soundStarted);
chrome.experimental.speechInput.onSoundEnd.addListener(soundEnded);
