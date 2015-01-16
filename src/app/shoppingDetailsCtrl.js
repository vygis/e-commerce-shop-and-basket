angular.module("app")
    .controller("shoppingDetailsCtrl", function ($scope, $window, $timeout, $stateParams, LocalStorageResource) {
        var shopItemData = LocalStorageResource('shopItems').get([['id', $stateParams.id, 'equals']]),
            basketResource = LocalStorageResource('shopBasket');
        $scope.item = shopItemData.results[0];
        $scope.basketRefreshHandle = true;
        $scope.addItemToBasket = function () {
            var basketEntries = basketResource.get([]).results,
                quantity = parseInt($window.prompt("Enter quantity","1"));
            if(quantity) {
                var targetEntry = _.find(basketEntries, function(entry){
                    return entry.id === $scope.item.id;
                });
                if(targetEntry) {
                    basketResource.put($scope.item.id, {
                        id: $scope.item.id,
                        item: targetEntry.item,
                        quantity: quantity + targetEntry.quantity                    
                    })
                }
                else {
                     basketResource.post({
                        id: $scope.item.id,
                        item: $scope.item,
                        quantity: quantity
                    });                   
                }

                $scope.basketRefreshHandle = false;
                $timeout(function(){
                    $scope.basketRefreshHandle = true;
                });
            };

        }
    });