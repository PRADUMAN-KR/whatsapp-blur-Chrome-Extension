function applyBlur(settings) {
    const blurAmount = `${settings.blurIntensity}px`;
    const elements = [];

    if (settings.blurMessages) {
        elements.push(...document.querySelectorAll(".message-in, .message-out"));
    }

     if (settings.blurNames) {
        const nameElement = document.querySelectorAll("header")[3].querySelector(".x1iyjqo2.x6ikm8r.x10wlt62.x1n2onr6.xlyipyv.xuxw1ft.x1rg5ohu._ao3e");
        if (nameElement) {
            elements.push(nameElement);
        }
    }

    elements.forEach(el => {
        el.style.filter = settings.enabled ? `blur(${blurAmount})` : "none";
    });
}

function initializeBlurFeature() {
    chrome.storage.sync.get(null, applyBlur);

    const observer = new MutationObserver(() => {
        if (chrome?.storage?.sync) {
            chrome.storage.sync.get(null, (settings) => {
                if (chrome.runtime?.lastError) {
                    console.error("Storage get error:", chrome.runtime.lastError);
                    return;
                }
                applyBlur(settings);
            });
        } else {
            console.warn("Chrome storage API not available.");
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    chrome.runtime.onMessage.addListener((msg) => {
        if (msg.type === 'refreshBlur') {
            chrome.storage.sync.get(null, applyBlur);
        }
    });
}

let lastUrl = location.href;
const urlObserver = new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        setTimeout(() => {
            chrome.storage.sync.get(null, applyBlur);
        }, 1000);
    }
});
urlObserver.observe(document.body, { childList: true, subtree: true });

initializeBlurFeature();
