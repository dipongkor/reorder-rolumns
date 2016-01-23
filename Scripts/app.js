(function () {
    var reorderApp = angular.module('reorder-app', ['ui.sortable', 'ngAnimate', 'toastr']);

    reorderApp.config(function (toastrConfig) {
        angular.extend(toastrConfig, {
            autoDismiss: true,
            containerId: 'toast-container',
            maxOpened: 0,
            newestOnTop: true,
            positionClass: 'toast-top-full-width',
            preventDuplicates: false,
            preventOpenDuplicates: true,
            target: 'body'
        });
    });

    reorderApp.controller('reorderCtrl', function ($scope, toastr) {

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

                chrome.tabs.executeScript(null, {
                    file: 'Scripts/window-message-listener.js'
                }, function () {
                    chrome.tabs.executeScript(null, { file: 'Scripts/get-lists.js' });
                });
            }
        };

        $scope.messageListener = function (msg) {
            if (msg.key == "allList") {
                $scope.allList = msg.value;
                toastr.info($scope.allList.length + " lists found.", 'Ahem!!');
                $scope.$apply();
            }
            else if (msg.key == "contentTypesDetails") {
                $scope.selectedList.selectedContentType.Fields = msg.value;
                $scope.$apply();
            } else if (msg.key == "reorderDone") {
                toastr.success("New order apllied successfully.", 'Ahem!!');
                $scope.$apply();
            } else {
                toastr.error(msg.value, 'Ahem!!');
                $scope.$apply();
            }
        };

        $scope.contentTypeOnchange = function (selectedContentType) {
            var restUrl = selectedContentType.Fields.__deferred.uri + "?$filter=Hidden eq false and InternalName ne 'ContentType'&$select=TypeDisplayName,Title,InternalName";
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
        
        $scope.removeSealedContentTypes = function(contentType){
            return !contentType.Sealed;
        }

        $scope.init($scope.messageListener);
    });
})()