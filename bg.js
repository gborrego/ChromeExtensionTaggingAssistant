var currentTab = chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    return tabs[0];
  }); //Se obtiene la tab activa

chrome.runtime.onMessage.addListener(gotHash);
chrome.browserAction.onClicked.addListener(intercambiarMensaje); //Ejecutar el popup 
                                                                    //desde click en el icono

function intercambiarMensaje() {
  let msg = {
    txt: ""
  }
  chrome.tabs.sendMessage(currentTab.id, msg);
}


function gotHash(message, sender, sendResponse) { //Content Script detecto un # 
    if(message == "hashDetected"){
        intercambiarMensaje;
        chrome.windows.create({ 
            url: chrome.extension.getURL("/popupPlugin/plugin.html"),
            width:  430,
            height: 200,
            type: "popup",
            focused: true
        });
    }
  }