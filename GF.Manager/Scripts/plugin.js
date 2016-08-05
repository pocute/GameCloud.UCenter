﻿var enums = null;
(function (enums) {

    var gender = {};
    gender[gender['Male'] = 0] = '男';
    gender[gender['Female'] = 1] = '女';
    gender[gender['DeclineToState'] = 2] = '拒绝透漏';

    enums.gender = gender;
})(enums || (enums = {}));
var plugins = [
    {
        name: "texaspoker",
        displayName: "德州扑克管理",
        url: "http://localhost:3578/api",
        description: "texaspoker manager",
        collections: [
            {
                name: "player-manager",
                displayName: "玩家管理",
                description: "Manage the players here.",
                items: [
                    {
                        name: "player-search",
                        displayName: "玩家查询",
                        description: "Manage player list here.",
                        view: "player-search.html",
                        type: 'search',
                        url: 'players',
                        method: 'GET'
                    },
                    {
                        name: "bot-search",
                        displayName: "机器人查询",
                        description: "Manager bot list here.",
                        view: "bot-search.html",
                        type: 'search',
                        url: 'bots',
                        method: 'GET'
                    }
                ]
            }
        ]
    }
];
var app = angular.module("pluginApp", ['ui.bootstrap', 'chart.js', 'ngRoute'])
    .filter('enums', function () {
        return function (input, enumName) {
            var items = enums[enumName];
            if (typeof (input) === 'number') {
                return items[input];
            } else {
                return items[items[input]];
            }
        }
    }).filter('yesNo', function () {
        return function (input) {
            return input ? '是' : '否';
        }
    }).service('pluginService', ['$http', function ($http) {
        this.plugins = plugins;
        this.plugin = plugins[0];


        var find = function (items, name) {
            for (var i = items.length - 1; i >= 0; i--) {
                if (items[i].name == name) {
                    return items[i];
                }
            }

            return null;
        }

        this.setCurrent = function (pluginName, collectionName, itemName) {
            this.plugin = find(this.plugins, pluginName);
            this.collection = find(this.plugin.collections, collectionName);
            if (this.collection) {
                this.item = find(this.collection.items, itemName);
            } else {
                this.item = find(this.plugin.items, itemName);
            }
        };
    }]).config(['$routeProvider', function ($routeProvider) {
        if (plugins) {
            plugins.forEach(function (p) {
                $routeProvider.when('/' + p.name, {
                    templateUrl: '/plugins/_templates/views/plugin.html',
                    controller: 'pluginController'
                });

                if (p.collections) {
                    p.collections.forEach(function (c) {
                        $routeProvider.when('/' + p.name + '/' + c.name, {
                            templateUrl: '/plugins/_templates/views/collection.html',
                            controller: 'collectionController'
                        });

                        if (c.items) {
                            c.items.forEach(function (i) {
                                $routeProvider.when('/' + p.name + '/' + c.name + '/' + i.name, {
                                    templateUrl: '/plugins/_templates/views/' + i.type + '.html',
                                    controller: i.type + 'Controller'
                                });
                            })
                        }
                    });

                    if (p.items) {
                        p.items.forEach(function (i) {
                            $routeProvider.when('/' + p.name + '/' + i.name, {
                                templateUrl: '/plugins/_templates/views/' + i.type + '.html',
                                controller: i.type + 'Controller'
                            });
                        })
                    }
                }
            });
            $routeProvider.otherwise({
                templateUrl: '/plugins/_templates/views/error.html'
            });
        }
    }]).controller('navController', ['$scope', '$http', '$templateCache', 'pluginService', function ($scope, $http, $templateCache, pluginService) {
        $scope.plugins = pluginService.plugins;
        $scope.plugin = pluginService.plugin;
        $scope.setCollection = function (c) {
            pluginService.collection = c;
        };

        $scope.setItem = function (item) {
            pluginService.item = item;
        }
    }]).run(['$rootScope', 'pluginService', function ($rootScope, pluginService) {
        $rootScope.$on('$routeChangeStart', function (next, current) {
            console.log("next:", next, "current", current);
            var path = current.$$route.originalPath;
            if (path) {
                var paths = path.split('/');
                pluginService.setCurrent(paths[1], paths[2], paths[3]);
            }
        });
    }]).controller('baseController', ['$scope', '$http', '$templateCache', 'pluginService', function ($scope, $http, $templateCache, pluginService) {
        $scope.plugins = pluginService.plugins;
        $scope.plugin = pluginService.plugin;
        $scope.collection = pluginService.collection;
        $scope.item = pluginService.item;
    }]).controller('pluginController', ['$scope', '$http', '$templateCache', '$controller', 'pluginService', function ($scope, $http, $templateCache, $controller, pluginService) {
        $controller('baseController', { $scope: $scope });
    }]).controller('collectionController', ['$scope', '$http', '$templateCache', '$controller', 'pluginService', function ($scope, $http, $templateCache, $controller, pluginService) {
        $controller('baseController', { $scope: $scope });
    }]).controller('apiController', ['$scope', '$http', '$templateCache', '$controller', 'pluginService', function ($scope, $http, $templateCache, $controller, pluginService) {
        $controller('baseController', { $scope: $scope });
        $scope.params = {};
        $scope.beforeFetch = function () { };
        $scope.fetch = function () {
            $scope.code = null;
            $scope.response = null;
            var url = $scope.plugin.url + "/" + $scope.item.url;
            var params = [];
            for (var n in $scope.params) {
                if ($scope.params[n]) {
                    params.push(n + "=" + $scope.params[n]);
                }
            }

            if (params.length > 0) {
                url += "?" + params.join('&');
            }

            $http.post(
                '/getdata',
                {
                    url: url,
                    content: '',
                    method: $scope.item.method
                },
                {
                    responseType: 'json',
                    cache: $templateCache
                }).
                then(function (response) {
                    $scope.status = response.status;
                    $scope.data = response.data;
                    $scope.raws = response.data.Raws;
                }, function (response) {
                    $scope.data = response.data || "Request failed";
                    $scope.status = response.status;
                });
        };
    }]).controller('searchController', ['$scope', '$http', '$templateCache', '$controller', 'pluginService', function ($scope, $http, $templateCache, $controller, pluginService) {
        $controller('apiController', { $scope: $scope });
        $scope.maxShowPages = 7;
        $scope.params.count = 10;
        $scope.pageSizeList = [5, 10, 20, 50];
        $scope.beforeFetch = function () { };

        $scope.onPageChange = function () {
            $scope.fetch();
        }

        $scope.onPageSizeChange = function (size) {
            $scope.params.count = size;
            $scope.fetch();
        }

        $scope.updateModel = function (method, url) {
            $scope.method = method;
            $scope.url = url;
        };

        $scope.fetch();
    }
    ]);