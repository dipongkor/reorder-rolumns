(function () {
    function injectCodeToPage(code, args) {
        var script = document.createElement('script');
        script.textContent = '(' + code + ')(' + (args || '') + ');';
        (document.head || document.documentElement).appendChild(script);
        script.parentNode.removeChild(script);
    }

    window.addEventListener("message", function (event) {
        var port = chrome.runtime.connect();
        port.postMessage(event.data);
    });

    injectCodeToPage(getLists);
    
    function getLists() {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", _spPageContextInfo.webAbsoluteUrl + '/_api/Web/Lists?$expand=ContentTypes&$filter=Hidden eq false&$select=Title,ContentTypes');
        xmlhttp.setRequestHeader("Accept", "application/json;odata=verbose");
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                    var response = JSON.parse(xmlhttp.responseText);
                    window.postMessage({key: "allList", value: response.d.results}, "*");
                } else {
                    console.log('Error: ' + xmlhttp.statusText)
                }
            }
        }

        xmlhttp.send();
    }
})();