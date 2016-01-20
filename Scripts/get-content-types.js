(function () {
    function injectCodeToPage(code, args) {
        var script = document.createElement('script');
        script.textContent = '(' + code + ')(' + (args || '') + ');';
        (document.head || document.documentElement).appendChild(script);
        script.parentNode.removeChild(script);
    }

    window.addEventListener("message", function (event) {
        if (event.data) {
            var port = chrome.runtime.connect({ name: "ReorderSPColumns" });
            port.postMessage(event.data);
        }
    });

    injectCodeToPage(getContentTypesDetails, '"' + restUrl + '"');

    function getContentTypesDetails(url) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url);
        xmlhttp.setRequestHeader("Accept", "application/json;odata=verbose");
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                    var response = JSON.parse(xmlhttp.responseText);
                    window.postMessage({ key: "contentTypesDetails", value: response.d.results }, "*");
                } else {
                    console.log('Error: ' + xmlhttp.statusText);
                }
            }
        };
        xmlhttp.send();
    }
})();