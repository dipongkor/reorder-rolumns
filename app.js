(function () {
    var myapp = angular.module('reorder-app', ['ui']);

    myapp.controller('controller', function ($scope) {

        $scope.selectedList = {
            selectedContentType: {
                Fields: []
            }
        };

        $scope.init = function (listener) {
            if (window["chrome"] && chrome.tabs) {
                chrome.runtime.onConnect.addListener(function (port) {
                    port.onMessage.addListener(listener);
                });

                chrome.tabs.executeScript({
                    file: 'Scripts/start.js'
                });
            }
        };

        $scope.livePreviewMessageListener = function (msg) {
            if (msg.key == "allList") {
                $scope.allList = msg.value;
                $scope.$apply();
            }
            else if (msg.key == "contentTypesDetails") {
                $scope.selectedList.selectedContentType.Fields = msg.value;
                $scope.$apply();
            } else if (msg.key == "reorderDone") {
                $scope.message = {
                    category : 'success',
                    text: 'Columns reordered successfully.'
                };
                
                $scope.$apply();
            }
        };

        $scope.contentTypeOnchange = function (selectedContentType) {
            var restUrl = selectedContentType.Fields.__deferred.uri + "?$filter=Hidden eq false&$select=TypeDisplayName,Title,InternalName";
            chrome.tabs.executeScript(null, {
                code: 'var restUrl = ' + '"' + restUrl + '"'
            }, function () {
                chrome.tabs.executeScript(null, { file: 'Scripts/get-content-types.js' });
            });
        };

        $scope.applyOrder = function (fieldsInContentType) {
            chrome.tabs.executeScript(null, {
                code: 'var selectedList = ' + JSON.stringify($scope.selectedList)
            }, function () {
                chrome.tabs.executeScript(null, { file: 'Scripts/reorder-columns.js' });
            });
        };

        $scope.init($scope.livePreviewMessageListener);
    });

    angular.bootstrap(document, ['reorder-app']);
})();