(function () {
    function injectCodeToPage(code, args) {
        var script = document.createElement('script');
        script.textContent = '(' + code + ')(' + (args || '') + ');';
        (document.head || document.documentElement).appendChild(script);
        script.parentNode.removeChild(script);
    }

    injectCodeToPage(getContentTypesDetails, '"' + restUrl + '"');

    function getContentTypesDetails(url) {
        try {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", url);
            xmlhttp.setRequestHeader("Accept", "application/json;odata=verbose");
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                    if (xmlhttp.status == 200) {
                        var response = JSON.parse(xmlhttp.responseText);
                        window.postMessage({ id: "ReorderSPColumns", key: "contentTypesDetails", value: response.d.results }, "*");
                    } else {
                        console.log('Error: ' + xmlhttp.statusText);
                        window.postMessage({ id: "ReorderSPColumns", key: "error", value: "Something went wrong. Please check console for more details" }, "*");
                    }
                }
            };
            xmlhttp.send();
        } catch (ex) {
            console.log(ex);
            window.postMessage({ id: "ReorderSPColumns", key: "error", value: "Something went wrong. Please check console for more details" }, "*");
        }
    }
})();