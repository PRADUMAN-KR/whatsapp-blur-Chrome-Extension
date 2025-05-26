const enableBlur = document.getElementById('enableBlur');
const blurRange = document.getElementById('blurRange');
const blurValue = document.getElementById("blurValue");
const blurMessages = document.getElementById("blurMessages");
const blurNames = document.getElementById("blurNames");

function saveSettings() {
    chrome.storage.sync.set({
        enabled: enableBlur.checked,
        blurIntensity: blurRange.value,
        blurMessages: blurMessages.checked,
        blurNames: blurNames.checked
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (tab && tab.url.includes("https://web.whatsapp.com")) {
        chrome.tabs.sendMessage(tab.id, { type: "refreshBlur" }).catch(err => {
            console.warn("Could not send message to content script:", err);
        });
    } else {
        console.warn("Not on WhatsApp Web, skipping message.");
    }
});

}

function loadSettings() {
    chrome.storage.sync.get(
        ['enabled', 'blurIntensity', 'blurMessages', 'blurNames'],
        (settings) => {
            enableBlur.checked = settings.enabled ?? true;
            blurRange.value = settings.blurIntensity ?? 8;
            blurValue.textContent = blurRange.value;
            blurMessages.checked = settings.blurMessages ?? true;
            blurNames.checked = settings.blurNames ?? false;
        }
    );
}

blurRange.oninput = () => {
    blurValue.textContent = blurRange.value;
};
enableBlur.onchange = saveSettings;
blurMessages.onchange = saveSettings;
blurNames.onchange = saveSettings;
blurRange.onchange = saveSettings;

document.addEventListener("DOMContentLoaded", loadSettings);
