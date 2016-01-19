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

    injectCodeToPage(reorderColumns, JSON.stringify(selectedList));

    function reorderColumns(selectedList) {
        var listContentTypes;

        var ctx = new SP.ClientContext.get_current();
        var list = ctx.get_web().get_lists().getByTitle(selectedList.Title);

        listContentTypes = list.get_contentTypes();

        ctx.load(listContentTypes);

        ctx.executeQueryAsync(get_contentTypes_success, onFailure);

        function get_contentTypes_success() {
            var itemContenType = listContentTypes.getById(selectedList.selectedContentType.Id.StringValue);
            var itemContenTypeFieldLink = itemContenType.get_fieldLinks();
            var reorderedFields = [];
            selectedList.selectedContentType.Fields.forEach(function (field) {
                reorderedFields.push(field.InternalName);
            });
            itemContenTypeFieldLink.reorder(reorderedFields);
            itemContenType.update(false);
            ctx.executeQueryAsync(field_reorder_success, onFailure);
            function field_reorder_success() {
                window.postMessage({ key: "reorderDone", value: "done" }, "*");
            }
        }

        function onFailure(sender, args) { 
            window.postMessage({ key: "Error", value: args.get_message() }, "*");
        }
    }
})();