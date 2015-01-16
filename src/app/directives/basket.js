
angular.module("directives")
    .directive('basket', function() {
        return {
            restrict: 'E',
            scope: {
                editMode: '='
            },
            template: 
            "<span>" +
            "<h2 ng-if='editMode'>Edit your basket</h2>" + 
            "<div ng-if='!editMode' class='center'><b>Basket</b> [<a ui-sref='basketEdit'>edit</a>]</div>" +
            "<div ng-repeat='entry in basketEntries'>" +
            "{{entry.item.name}} | {{entry.item.price}} x {{entry.quantity}}"+
            "<span ng-if='editMode'> [<a ng-click='changeQuantity(entry)'>change quantity</a>]  [<a ng-click='delete(entry)'>delete</a>]</span>" +
            "</div>" +
            "<div><b>Total: </b>{{totalPrice}}</div>" +
            "</span>",
            controller: function($scope, $window, LocalStorageResource) {
                var basketResource = LocalStorageResource('shopBasket'),
                    calculatePrice = function() {
                        return _.reduce(_.map($scope.basketEntries, function(entry) {
                            return entry.item.price * entry.quantity;
                        }), function(memo, num){
                            return memo + num; 
                        }, 0)
                    },                    
                    refresh = function () {
                        $scope.basketEntries = basketResource.get([]).results;
                        $scope.totalPrice = calculatePrice();   
                    }
                $scope.changeQuantity = function(entry) {
                    var newQuantity = parseInt($window.prompt("Change quantity", entry.quantity));
                    if(isNaN(newQuantity) || newQuantity < 1) {
                        $window.alert('Invalid quantity');
                        return false;
                    }
                    basketResource.put(entry.id, {
                        id: entry.id,
                        item: entry.item,
                        quantity: newQuantity                    
                    });
                    refresh();
                }
                $scope.delete = function(entry) {
                    if($window.confirm("Delete '" + entry.item.name + "' from basket?")){
                        basketResource.delete(entry.id);
                        refresh();                       
                    }
                }
                refresh();

            }
        }
 
    });

/*
    
*/