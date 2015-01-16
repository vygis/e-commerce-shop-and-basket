angular.module("app")
    .controller("shoppingListCtrl", function ($scope, $timeout, LocalStorageResource) {
        $scope.paginationTriggered = false;

        $scope.paginationFunction = function(startIndex, batchSize) {
            $scope.shopItems = [];
            var shopItemData = LocalStorageResource('shopItems').get([], startIndex, batchSize);
            $timeout(function(){
                $scope.shopItems = shopItemData.results;
                $scope.paginationData = shopItemData.pagination; 
            })
        };

        $scope.paginationFunction(0, 3);
    });
