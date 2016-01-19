(function () {
    var myapp = angular.module('myapp', ['ui']);

    myapp.controller('controller', function ($scope) {
        $scope.list = ["one", "two", "thre", "four", "five", "six"];

        $scope.getLists = function () {
            chrome.runtime.sendMessage({ directive: "popup-click" }, function (response) {
                alert(response);
            });
        };

        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                switch (request.directive) {
                    case "ListLoaded":
                    $scope.list = request.data;
                    $scope.$apply();
                        break;
                    default:
                        // helps debug when request directive doesn't match
                        console.log("");
                }
            }
            );

    });

    angular.bootstrap(document, ['myapp']);


})();