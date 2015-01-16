
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
    });