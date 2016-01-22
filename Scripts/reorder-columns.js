(function () {
    function injectCodeToPage(code, args) {
        var script = document.createElement('script');
        script.textContent = '(' + code + ')(' + (args || '') + ');';
        (document.head || document.documentElement).appendChild(script);
        script.parentNode.removeChild(script);
    }

    injectCodeToPage(reorderColumns, JSON.stringify(selectedList));

    function reorderColumns(selectedList) {
        try {
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
                    window.postMessage({ id: "ReorderSPColumns", key: "reorderDone", value: "done" }, "*");
                }
            }

            function onFailure(sender, args) {
                console.log(args.get_message());
                window.postMessage({ id: "ReorderSPColumns", key: "error", value: "Something went wrong. Please check console for more details" }, "*");
            }
            
        } catch (ex) {
            console.log(ex);
            window.postMessage({ id: "ReorderSPColumns", key: "error", value: "Something went wrong. Please check console for more details" }, "*");
        }
    }
})();