const enableBlur = document.getElementById('enableBlur');
const blurRange = document.getElementById('blurRange');
const blurValue = document.getElementById("blurValue");
const blurMessages = document.getElementById("blurMessages");
const blurNames = document.getElementById("blurNames");


function save_settings (){
    chrome.storage.sync.set(
        {
            enabled : enableBlur.checked,
            blurIntensity : blurRange.value,
            blurMessages : blurMessages.checked,
            blurNames : blurNames.checked


        });
        
}