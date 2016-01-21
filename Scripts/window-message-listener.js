(function () {
     window.removeEventListener("message", postMessage, true);
     window.addEventListener("message", postMessage, true);
    function postMessage(event) {
        if (event.data.id && event.data.id == "ReorderSPColumns") {
            var port = chrome.runtime.connect({ name: "ReorderSPColumns" });
            port.postMessage(event.data);
        }
    }
})();