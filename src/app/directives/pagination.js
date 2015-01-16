
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