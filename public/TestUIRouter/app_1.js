// app.js



var routerApp = angular.module('routerApp', ['ui.router', 'ngAnimate', 'ui.bootstrap', 'myTable']);

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
                        template: '<data-my-table my-type="scotch" my-service="BasketService"></data-my-table>'
                                //   controller: 'scotchController'
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



routerApp.controller('basketCtrl', function ($scope, BasketService) {
    $scope.itemCnt = BasketService.getSelectedCnt();

    $scope.scotches = BasketService.getSelectedList();

    var type = BasketService.getType();

    $scope.$on('handle' + type + 'ItemCount', function () {
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


var myTable = angular.module('myTable', []);
myTable.directive('myTable', function () {
    return {
        scope: {
        },
        templateUrl: 'table-data_1.html',
        replace: true,
        controller: 'scotchController',
        controllerAs: 'ctrl'
    };
});

myTable.controller('scotchController', function ($scope, $attrs, $injector) {

    var myService = $injector.get($attrs.myService);

    this.message = $attrs.myType;
    this.message = "test2";
    var type = $attrs.myType;
    myService.setType(type);
    this.scotches = myService.getList();

    myService.updateSelectedList(this.scotches);

    // This property is bound to the checkbox in the table header
    this.allItemsSelected = myService.allSelected();

// Fired when an entity in the table is checked
    this.selectEntity = function () {
        myService.updateSelectedList(this.scotches);

    };

    // Fired when the checkbox in the table header is checked
    this.selectAll = function () {
        // Loop through all the entities and set their isChecked property
        for (var i = 0; i < this.scotches.length; i++) {
            this.scotches[i].selected = this.allItemsSelected;
        }

        myService.updateSelectedList(this.scotches);
    };

    $scope.$on('handle' + type + 'ItemCount', function () {
        this.allItemsSelected = myService.allSelected();
    });
});

routerApp.service("ScotchService", function () {
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

    this.getList = function () {
       console.log("getList this"+ scotches.length);
        return scotches;
    };

    var selectedList = [];

    this.getSelectedList = function () {
        return selectedList;
    };

    this.getSelectedCnt = function () {
        return selectedList.length;
    };

    this.setSelectedList = function (value) {
        selectedList = value;
    };

    var allSelected = false;

    this.setAllSelected = function (value) {
        console.log("value length " + value.length);
        allSelected = value;
    };

    this.getAllSelected = function () {
        return allSelected;
    };

});

routerApp.factory('BasketService', function ($rootScope, ScotchService) {
    var service = {};
    var type = '';


    service.setType = function (value) {
        this.type = value;
    };

    service.getType = function () {
        return type;
    };

    service.getList = function () {
        var list = [];
        list= ScotchService.getList();
        console.log("getList service"+ list);
        return ScotchService.getList();
    };

    service.getSelectedList = function () {
        return ScotchService.getSelectedList();
    };

    service.updateSelectedList = function (value) {
        var ret = [];
        for (var i = 0; i < value.length; i++) {
            if (value[i].selected)
                ret.push(value[i]);
        }

        ScotchService.setSelectedList(ret);
        //debug

        console.log("selected " + ScotchService.getSelectedList().length);



        var all_selected = true;
        var list = ScotchService.getList();
        for (var i = 0; i < list.length; i++) {
            if (!list[i].selected) {
                all_selected = false;
                break;
            }
        }

        ScotchService.setAllSelected(all_selected);
        console.log("allSelected is " + ScotchService.getAllSelected());
        this.broadcastItemCount(type);

        return ret;
    };

    service.broadcastItemCount = function (type) {
        $rootScope.$broadcast('handle' + type + 'ItemCount');
        //  $rootScope.$emit('handleItemCount');
    };

    service.getSelectedCnt = function () {
     //   return 0;
     //   console.log("get selected " + ScotchService.getSelectedCnt());
        return ScotchService.getSelectedCnt();
    };

    service.allSelected = function () {
        console.log("get allSelected " + ScotchService.getAllSelected());
        return ScotchService.getAllSelected();

    };

    service.unselect = function (value) {
        var list = ScotchService.getList();
        for (var i = 0; i < list.length; i++) {
            if (JSON.stringify(list[i]) === JSON.stringify(value)) {
                list[i].selected = false;
                break;
            }
        }
        this.updateSelectedList(list);
    };

    service.unselectAll = function () {
        var list = ScotchService.getList();
        for (var i = 0; i < list.length; i++) {
            list[i].selected = false;
        }
        this.updateSelectedList(list);
    };

    return service;
});

