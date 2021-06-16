$(function(){
    var hash = {};
    //TODO: hacer que el hash venda del servidor
    hash["Artifact"] = {name:"Artifact",parent:null,children:["TechologicalSupport", "Generated"]};
    hash["Generated"] = {name:"Generated",parent:"Artifact",children:["Documentation", "Software"]};
    hash["Documentation"] = {name:"Documentation",parent:"Generated",children:null};
    hash["Software"] = {name:"Software",parent:"Generated",children:["Component", "Code"]};
    hash["Component"] = {name:"Component",parent:"Software",children:null};
    hash["Code"] = {name:"Code",parent:"Software",children:null};
    hash["Necessity"] = {name:"Necessity",parent:null,children:null};
    hash["ArchitecturalDecision"] = {name:"ArchitecturalDecision",parent:null,children:null};
    hash["Topic"] = {name:"Topic",parent:null,children:null};
    hash["ArchitecturalView"] = {name:"ArchitecturalView",parent:null,children:null};
    hash["TechologicalSupport"] = {name:"TechologicalSupport",parent:"Artifact",children:null};
    hash["IPServicio"] = {name:"IPServicio",parent:"TechnologicalSupport",children:null};
    hash["PruebasREST "] = {name:"PruebasREST",parent:"TechnologicalSupport",children:null};
    hash["RestApikey"] = {name:"RestApikey",parent:"Code",children:null};
    hash["SeguridadRest"] = {name:"SeguridadRest",parent:"Code",children:null};
    hash["Cifrado"] = {name:"Cifrado",parent:"Code",children:null};
    hash["RespuestaREST"] = {name:"RespuestaREST",parent:"Code",children:null};
    hash["DatosPrueba"] = {name:"DatosPrueba",parent:"Code",children:null};
    hash["RecursoREST"] = {name:"RecursoREST",parent:"Code",children:null};
    hash["AngularCifrado"] = {name:"AngularCifrado",parent:"Component",children:null};
    hash["HistoriaUsuario"] = {name:"HistoriaUsuario",parent:"Documentation",children:null};
    
    
    
    
    
    $("input").each(function(){
        new Awesomplete(this, {
                hashTable: hash,
                filter: Awesomplete.FILTER_STARTSWITH
        });
    });

    
        $.fn.focusTextToEnd = function(){
            this.focus();
            var $thisVal = this.val();
            this.val('').val($thisVal);
            return this;
        }
    
    $('#tags').focusTextToEnd();
   
  

});