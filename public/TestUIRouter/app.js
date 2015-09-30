// app.js
var routerApp = angular.module('routerApp', ['ui.router', 'ngAnimate', 'ui.bootstrap']);

routerApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

            .state('home2', {
                url: '/home2',
                templateUrl: 'partial-home2.html',
                controller: 'CarouselCtrl'
            })
            
            // HOME STATES AND NESTED VIEWS ========================================
            .state('home', {
                url: '/home',
                templateUrl: 'partial-home.html'
            })

            // nested list with custom controller
            .state('home.list', {
                url: '/list',
                templateUrl: 'partial-home-list.html',
                controller: 'CarouselCtrl'
            })

            // nested list with just some random string data
            .state('home.paragraph', {
                url: '/paragraph',
                template: 'I could sure use a drink right now.'
            })


            // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
            .state('products', {
                url: '/products',
                views: {
                    // the main template will be placed here (relatively named)
                    '': {templateUrl: 'partial-products.html'},
                    // the child views will be defined here (absolutely named)
                    'columnRight@products': {template: 'Item Info Here!'},
                    // for column two, we'll define a separate controller 
                    'columnLeft@products': {
                        templateUrl: 'table-data.html',
                        controller: 'scotchController'
                    }
                }

            })

            // HOME STATES AND NESTED VIEWS ========================================
            .state('basket', {
                url: '/basket',
                views: {
                    // the main template will be placed here (relatively named)
                    '': {templateUrl: 'partial-basket.html'},
                    // the child views will be defined here (absolutely named)
                    'columnRight@basket': {template: 'Advertisement! Just Kidding!'},
                    // for column two, we'll define a separate controller 
                    'columnLeft@basket': {
                        templateUrl: 'basket-data.html',
                        controller: 'basketCtrl'
                    }
                }

            });

});

// let's define the scotch controller that we call up in the about state
routerApp.controller('scotchController', function ($scope, BasketService) {

    $scope.message = 'test';

    $scope.scotches = BasketService.getList();

    BasketService.updateSelectedList($scope.scotches);

    // This property is bound to the checkbox in the table header
    $scope.allItemsSelected = BasketService.allSelected();

// Fired when an entity in the table is checked
    $scope.selectEntity = function () {
        BasketService.updateSelectedList($scope.scotches);

    };

    // Fired when the checkbox in the table header is checked
    $scope.selectAll = function () {
        // Loop through all the entities and set their isChecked property
        for (var i = 0; i < $scope.scotches.length; i++) {
            $scope.scotches[i].selected = $scope.allItemsSelected;
        }

        BasketService.updateSelectedList($scope.scotches);
    };

    $scope.$on('handleItemCount', function () {
        $scope.allItemsSelected = BasketService.allSelected();
    });
});

routerApp.controller('basketCtrl', function ($scope, BasketService) {
    $scope.itemCnt = BasketService.getSelectedCnt();

    $scope.scotches = BasketService.getSelectedList();

    $scope.$on('handleItemCount', function () {
        $scope.itemCnt = BasketService.getSelectedCnt();
        $scope.scotches = BasketService.getSelectedList();
    });

    $scope.removeItem = function (value) {
        BasketService.unselect(value);
    };

    $scope.removeAllItems = function () {
        BasketService.unselectAll();
    };
});

routerApp.service('BasketService', function ($rootScope) {
    var scotches = [{
            name: 'Macallan 12',
            price: 50,
            selected: false
        },
        {
            name: 'Chivas Regal Royal Salute',
            price: 10000,
            selected: false
        },
        {
            name: 'Highland Park',
            price: 100,
            selected: false
        },
        {
            name: 'Aberfeldy 21',
            price: 500,
            selected: false
        },
        {
            name: 'Glenfiddich 1937',
            price: 20000,
            selected: false
        }
    ];

    var selectedList = [];

    var allSelected = false;


    this.getList = function () {
        return scotches;
    };

    this.getSelectedList = function () {
        return selectedList;
    };

    this.updateSelectedList = function (value) {
        var ret = [];
        for (var i = 0; i < value.length; i++) {
            if (value[i].selected)
                ret.push(value[i]);
        }

        selectedList = ret;
        //debug

        console.log("selected " + selectedList.length);



        var all_selected = true;
        for (var i = 0; i < scotches.length; i++) {
            if (!scotches[i].selected) {
                all_selected = false;
                break;
            }
        }

        allSelected = all_selected;
        console.log("allSelected is " + allSelected);
        this.broadcastItemCount();

        return ret;
    };

    this.broadcastItemCount = function () {
        $rootScope.$broadcast('handleItemCount');
        //  $rootScope.$emit('handleItemCount');
    };

    this.getSelectedCnt = function () {
        console.log("get selected " + selectedList.length);
        return selectedList.length;
    };

    this.allSelected = function () {
        console.log("get allSelected " + allSelected);
        return allSelected;

    };

    this.unselect = function (value) {
        for (var i = 0; i < scotches.length; i++) {
            if (JSON.stringify(scotches[i]) === JSON.stringify(value)) {
                scotches[i].selected = false;
                break;
            }
        }
        this.updateSelectedList(scotches);
    };

    this.unselectAll = function () {
        for (var i = 0; i < scotches.length; i++) {
            scotches[i].selected = false;
        }
        this.updateSelectedList(scotches);
    };
});


routerApp.controller('CarouselCtrl', function CarouselCtrl($scope) {
    $scope.myInterval = 3000;
    $scope.slides = [
        {
            image: '../images/img1.jpg'
        },
        {
            image: '../images/img2.jpg'
        },
        {
            image: '../images/img3.jpg'
        },
        {
            image: '../images/img4.jpg'
        },
        {
            image: '../images/img5.jpg'
        }
    ];
});