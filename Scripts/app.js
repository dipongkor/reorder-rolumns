(function () {
    var myapp = angular.module('reorder-app', ['ui', 'ngAnimate', 'toastr']);

    myapp.config(function (toastrConfig) {
        angular.extend(toastrConfig, {
            autoDismiss: true,
            containerId: 'toast-container',
            maxOpened: 0,
            newestOnTop: true,
            positionClass: 'toast-top-full-width',
            preventDuplicates: false,
            preventOpenDuplicates: false,
            target: 'body'
        });
    });

    myapp.controller('controller', function ($scope, toastr) {

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
                    file: 'Scripts/get-lists.js'
                });
            }
        };

        $scope.livePreviewMessageListener = function (msg) {
            if (msg.key == "allList") {
                $scope.allList = msg.value;
                toastr.info($scope.allList.length + " lists found.", 'Reorder List Columns');
                $scope.$apply();
            }
            else if (msg.key == "contentTypesDetails") {
                $scope.selectedList.selectedContentType.Fields = msg.value;
                $scope.$apply();
            } else if (msg.key == "reorderDone") {
                toastr.success("New order apllied successfully.", 'Reorder List Columns');
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
})();