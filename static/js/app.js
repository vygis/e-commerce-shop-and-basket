angular.module("services", []);

angular.module("services")
    .factory('LocalStorageResource', function($window) {
        var localStorage = $window.localStorage,
            JSON = $window.JSON,
            LocalStorageResource = function(namespace) {
                this.namespace = namespace;
                this.target = JSON.parse(localStorage.getItem(this.namespace));
                if(this.target === null) {
                    localStorage.setItem(this.namespace, JSON.stringify([]));
                    this.target = JSON.parse(localStorage.getItem(this.namespace));
                };
            },
            _predicateTypes = ['equals', 'contains'],

            _applyPredicate = function(resultSet, predicate) {
                return {
                    'equals': (function() {
                        return _.filter(resultSet, function(result) {
                            return result[predicate[0]] === predicate[1];
                        })
                    }()),
                    'contains': (function() {
                        return _.filter(resultSet, function(result) {
                            return _.contains(result[predicate[0]], predicate[1]);
                        })
                    }()),                   
                }[predicate[2]] || false;

            },
            _applyPredicates = function(resultSet, predicates) {
                return predicates && predicates.length ?_.unique(_.flatten(_.map(predicates, function(predicate){
                    return _applyPredicate(resultSet, predicate);
                }))) : resultSet;
            },
            _applyPagination = function(resultSet, startIndex, batchSize) {
                var start = startIndex === undefined ? 0 : startIndex,
                    end = batchSize === undefined || batchSize <= 0 ? undefined : start + batchSize;
                return resultSet.slice(start, end);
            };

        LocalStorageResource.prototype.get = function(predicates, startIndex, batchSize) {
            var initialResults = _applyPredicates(this.target, predicates || undefined),
                paginatedResults = _applyPagination(initialResults, startIndex, batchSize);
            return {
                results: paginatedResults,
                pagination: {
                    total: initialResults.length,
                    start: startIndex === undefined ? 0 : startIndex,
                    batch: batchSize === undefined ? -1 : batchSize
                }
            }
        };
        LocalStorageResource.prototype.post = function(data) {
            this.target.push(data);
            localStorage.setItem(this.namespace, JSON.stringify(this.target));
        };
        LocalStorageResource.prototype.put = function(id, data) {
            var targetItem = this.get([["id", id, 'equals']]).results[0];
            if(!targetItem) {
                console.error('Attempting to update item "' + id + '" that doesn\'t exist');
                return false;
            }
            var targetItemIndex = this.target.indexOf(_.find(this.target, function(item){
                return item.id === id;
            }));
            this.target[targetItemIndex] = data;
            localStorage.setItem(this.namespace, JSON.stringify(this.target));
        };
        LocalStorageResource.prototype.delete = function(id) {
            var targetItem = this.get([["id", id, 'equals']]).results[0];
            if(!targetItem) {
                console.error('Attempting to delete item "' + id + '" that doesn\'t exist');
                return false;
            }
            var targetItemIndex = this.target.indexOf(_.find(this.target, function(item){
                return item.id === id;
            }));         
            this.target.splice(targetItemIndex, 1);
            localStorage.setItem(this.namespace, JSON.stringify(this.target));
        }
        return function(namespace) {
            return new LocalStorageResource(namespace);
        }
    });angular.module("app", ["app.templates", "services", "directives", "ui.router", "uuid4"])
    .run(function($window, uuid4){
    	var localStorage = $window.localStorage,
    	JSON = $window.JSON;
    	if (localStorage.getItem('shopItems') === null || localStorage.getItem('shopItems') === "[]") {
    		localStorage.setItem('shopItems', JSON.stringify([
    			{
    				id: uuid4.generate(),
    				name: 'A',
    				description: 'lorem ipsum',
    				price: 1.50
    			},
    			{
    				id: uuid4.generate(),
    				name: 'B',
    				description: 'lorem ipsum',
    				price: 2.50
    			},
    			{
    				id: uuid4.generate(),
    				name: 'C',
    				description: 'lorem ipsum',
    				price: 3.30
    			},
    			{
    				id: uuid4.generate(),
    				name: 'D',
    				description: 'lorem ipsum',
    				price: 10
    			},
    			{
    				id: uuid4.generate(),
    				name: 'E',
    				description: 'lorem ipsum',
    				price: 59.99
    			},
    			{
    				id: uuid4.generate(),
    				name: 'F',
    				description: 'lorem ipsum',
    				price: 100
    			},
    			{
    				id: uuid4.generate(),
    				name: 'G',
    				description: 'lorem ipsum',
    				price: 79
    			},
    			{
    				id: uuid4.generate(),
    				name: 'H',
    				description: 'lorem ipsum',
    				price: 88.88
    			},
    			{
    				id: uuid4.generate(),
    				name: 'I',
    				description: 'lorem ipsum',
    				price: 0.01
    			},
    			{
    				id: uuid4.generate(),
    				name: 'J',
    				description: 'lorem ipsum',
    				price: 10
    			},
    			{
    				id: uuid4.generate(),
    				name: 'K',
    				description: 'lorem ipsum',
    				price: 11
    			},
    			{
    				id: uuid4.generate(),
    				name: 'L',
    				description: 'lorem ipsum',
    				price: 12
    			}
    		]));
		}
    });
angular.module("app")
    .constant("HOME_STATE", "/shop")
    .config(function($stateProvider, $urlRouterProvider, HOME_STATE){
    $urlRouterProvider.otherwise(HOME_STATE);

    $stateProvider
        .state('shoppingList', {
            url: "/shop",
            templateUrl: "shopping-list.tpl.html"
        })
        .state('shoppingDetails', {
            url: "/shop/:id/",
            templateUrl: "shopping-details.tpl.html"
        })
        .state('basketEdit', {
            url: "/basket",
            templateUrl: "basket-edit.tpl.html"
        })
    });

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
    });angular.module("app")
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
angular.module("directives", []);

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
angular.module("directives")
    .directive('pagination', function() {
        return {
            restrict: 'E',
            scope: {
                paginationData: "=",
                paginationFunction: "&"
            },
            template: 
            "<span ng-repeat='link in links'>" +
            "<a ng-if='!link.current' ng-click='link.action()'>{{link.index}}</a>&nbsp;" +
            "<span ng-if='link.current'>{{link.index}}</span>&nbsp;" +
            "</span>",
            controller: function($scope, LocalStorageResource) {
                var numberOfLinks = $scope.paginationData.batch <= 0 ? 1 : Math.floor($scope.paginationData.total / $scope.paginationData.batch);
                $scope.links = [];
                for(var i = 1; i <= numberOfLinks; i++) {
                    $scope.links.push({
                        index: i,
                        current: $scope.paginationData.batch <= 0 ? true : i === Math.floor(($scope.paginationData.start+1)/ $scope.paginationData.batch) + 1,
                        action: (function (index) {
                            return function () {
                                $scope.paginationFunction({'startIndex': (index-1) * $scope.paginationData.batch, 'batchSize': $scope.paginationData.batch});
                            }
                     })(i)
                    });
                }
            }
        }
 
    });

/*
    
*/