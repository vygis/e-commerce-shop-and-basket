angular.module('app.templates', ['basket-edit.tpl.html', 'shopping-details.tpl.html', 'shopping-list.tpl.html']);

angular.module("basket-edit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("basket-edit.tpl.html",
    "<div class=\"container\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-xs-12\">\n" +
    "            <basket edit-mode='true'></basket>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("shopping-details.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shopping-details.tpl.html",
    "<div class=\"container\" ng-controller=\"shoppingDetailsCtrl\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-xs-9\">\n" +
    "            <h4>Item Details</h4>\n" +
    "            <br/>\n" +
    "            <div class=\"input-group\">\n" +
    "                <span class=\"input-group-addon\">Name</span>\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"item.name\" ng-disabled=\"true\">\n" +
    "            </div>\n" +
    "            <br/>\n" +
    "            <div class=\"input-group\">\n" +
    "                <span class=\"input-group-addon\">Description</span>\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"item.description\" ng-disabled=\"true\">\n" +
    "            </div>\n" +
    "            <br/>\n" +
    "            <div class=\"input-group\">\n" +
    "                <span class=\"input-group-addon\">Price</span>\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"item.price\" ng-disabled=\"true\">\n" +
    "            </div>\n" +
    "            <br/>\n" +
    "            <div class=\"pull-right\">\n" +
    "                <button type=\"button\" class=\"btn btn-s btn-primary\" ng-click=\"addItemToBasket()\">Add to basket</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class='col-xs-3'>\n" +
    "            <basket ng-if=\"basketRefreshHandle\"></basket>\n" +
    "        </div>\n" +
    "    </div> \n" +
    "</div>");
}]);

angular.module("shopping-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shopping-list.tpl.html",
    "<div class=\"container\" ng-controller=\"shoppingListCtrl\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-xs-9\">\n" +
    "            <div class=\"col-sm-4\" ng-repeat=\"item in shopItems\">\n" +
    "                <div class=\"thumbnail\" ui-sref=\"shoppingDetails({ id: item.id })\">\n" +
    "                    <div class=\"caption\">\n" +
    "                        <h3>{{item.name}}</h3>\n" +
    "                        <p>{{item.description}}</p>\n" +
    "                        <p>{{item.price}}</p>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"clearfix\"></div>\n" +
    "            <div class=\"pull-right\">\n" +
    "                <pagination ng-if=\"shopItems\" pagination-data=\"paginationData\" pagination-function=\"paginationFunction(startIndex, batchSize)\"></pagination>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class='col-xs-3'>\n" +
    "            <basket></basket>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);
