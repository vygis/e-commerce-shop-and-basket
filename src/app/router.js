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

