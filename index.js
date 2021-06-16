
    if (window == top) {
    
        console.log("PLUGIN ETIQUETAS");
        inputList =window.document.getElementsByTagName("input"); //Se llaman a todos los inputs~
        console.log("TOTAL INPUTS : "+inputList.length);
    
        for (var i=0; i<inputList.length; i++){
            inputList[i].addEventListener("keyup", detectarHashInput, false);
            inputList[i].classList.add("awesomplete");
            inputList[i].addEventListener("awesomplete-open", function(event) {
                console.log( event.text.label, event.text.value );
            }); 
            console.log("input actualizado "+ inputList[i].classList); //Se agrega el metodo a todos los inputs del DOM
        }
       
        window.addEventListener("keyup", detectarHashDiv, false); //Se agrega el metodo a la Ventana activa
    
    
        }
        
//Lista de tags
var y = document.createElement("DATALIST"); //Lista
y.setAttribute("id", "tags");
document.body.appendChild(y);
//Tags
var tags = [];
tags[0]= document.createElement("OPTION");
tags[0].setAttribute("value", "#Artifact");
tags[1]= document.createElement("OPTION");
tags[1].setAttribute("value", "#Generated");
tags[2]= document.createElement("OPTION");
tags[2].setAttribute("value", "#Documentation");
tags[3]= document.createElement("OPTION");
tags[3].setAttribute("value", "#Software");
tags[4]= document.createElement("OPTION");
tags[4].setAttribute("value", "#Component");
tags[5]= document.createElement("OPTION");
tags[5].setAttribute("value", "#Code");
tags[6]= document.createElement("OPTION");
tags[6].setAttribute("value", "#Necessity");
tags[7]= document.createElement("OPTION");
tags[7].setAttribute("value", "#ArchitecturalDecision");
tags[8]= document.createElement("OPTION");
tags[8].setAttribute("value", "#Topic");
tags[9]= document.createElement("OPTION");
tags[9].setAttribute("value", "#ArchitecturalView");
tags[10]= document.createElement("OPTION");
tags[10].setAttribute("value", "#TechologicalSupport");

for(var i = 0;tags.length>i;i++){
    document.getElementById("tags").appendChild(tags[i]);
}


 
//Cargar scripts
function cargarScript(url, callback){
    var nuevoScript = document.createElement("script");
    nuevoScript.type = "text/javascript";
    if (nuevoScript.readyState){ //Internet Explorer
      nuevoScript.onreadystatechange = function(){
        if (nuevoScript.readyState == "loaded" || nuevoScript.readyState == "complete"){
          nuevoScript.onreadystatechange = null; //evita que se llame mas de una vez
          callback();
        }
      }
    } else {//otros navegadores
      nuevoScript.onload = function(){
        callback();
      }
    }
    nuevoScript.src = chrome.extension.getURL(url);
    document.getElementsByTagName("head")[0].appendChild(nuevoScript);
  }

//Funcion para escuchar Inputs del DOM
function detectarHashInput(e){ 
    var x = document.activeElement;
    if (e.shiftKey && e.keyCode == 51) {//Si se inserta un #
    
         listaTags(x);
       
    }
}

//Funcion para escuchar otros elementos del DOM
function detectarHashDiv(e){ 
    var x = document.activeElement;
    console.log(x.textContent);
    if (x.textContent.slice(-1) == '#'){ //Si se inserta un #
        alert("Creando dialog");
        
    }
}








//Lista de Tags

function listaTags(input){
    var texto = input.value;
    console.log(texto);
    input.setAttribute("multiple","true");
    input.setAttribute("list","tags");
    
}






     
    
   