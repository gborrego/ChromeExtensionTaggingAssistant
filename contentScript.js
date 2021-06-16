console.log("EXTENSION CREADA POR LOUIS GAMBINO");
var actInput;
chrome.runtime.onMessage.addListener(gotMessage);

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
    // SCRIPT A EJECUTAR CUANDO EXISTAM CAMBIOS EN LA ESTRUCTURA DOM
        elemInternos =document.getElementsByTagName("textarea");
        for (var i=0; i<elemInternos.length; i++){
            elemInternos[i].addEventListener("keydown", detectarHashInput, false);
        }
    
});

//Elementos que se observaran en el DOM
observer.observe(document, {
  subtree: true,
  attributes: true
  //...
});

if (window == top) {
    //Elementos tipo input antes de que el DOM cambie
    inputList =document.getElementsByTagName("input");
    for (var i=0; i<inputList.length; i++){
        inputList[i].addEventListener("keydown", detectarHashInput, false);
    }
    
}


//Funcion para agregar etiqueta al input activo.
function gotMessage(message, sender, sendResponse) {
  console.log(message);

  actInput.value += " #"+message.txt;
}

//Detectar # 
function detectarHashInput(e){ 
    if (e.altKey && e.shiftKey && e.keyCode == 69) {        //Si se inserta un #
         actInput = inputActivo();
         
         chrome.runtime.sendMessage("hashDetected");
    }
}


function inputActivo(){
    return document.activeElement;
}
