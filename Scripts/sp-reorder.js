var SpColumnReorder;
(function (SpColumnReorder) {
    var ChromeIntegration = (function () {
        function ChromeIntegration() {
        }
        ChromeIntegration.init = function (listener) {
            if (window["chrome"] && chrome.tabs) {
                chrome.runtime.onConnect.addListener(function (port) {
                    port.onMessage.addListener(listener);
                });

                chrome.tabs.executeScript({
                    file: 'Scripts/start.js'
                });
            }
        };

        ChromeIntegration.executeInContentScriptContext = function (code) {
            if (!window["chrome"] || !chrome.tabs)
                return false;

            chrome.tabs.executeScript({
                code: code
            });

            return true;
        };
        return ChromeIntegration;
    })();
    SpColumnReorder.ChromeIntegration = ChromeIntegration;
})(SpColumnReorder || (SpColumnReorder = {}));