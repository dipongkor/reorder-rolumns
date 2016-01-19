
chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(listener);
});

chrome.tabs.executeScript({
    file: 'Scripts/start.js'
});