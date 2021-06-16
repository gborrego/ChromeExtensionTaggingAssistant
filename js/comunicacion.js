
function setup() {
    noCanvas();
    let inputTag = select('#tags');
      chrome.tabs.query({ currentWindow: false, active: true }, gotTabs);
      function gotTabs(tabs) {
        document.getElementById('tags').addEventListener("awesomplete-selectcomplete", function(aero) {
        let msg = {
          txt: inputTag.value().slice(1)
        };

        chrome.tabs.sendMessage(tabs[0].id, msg);
            window.close();
        });


        document.getElementById('tags').addEventListener("keypress",function(key){
          console.log(key);
            if (key.charCode == 13) {
              let msg = {
                txt: inputTag.value().slice(1)
              };
      
              chrome.tabs.sendMessage(tabs[0].id, msg);
                  window.close();
            }
        
        });
      }
  
    

  }