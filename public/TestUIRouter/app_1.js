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
                        template: '<data-my-table my-type="scotch"></data-my-table>'
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
     var type = "scotch";
     
    $scope.itemCnt = BasketService.getSelectedCnt(type);
    
    $scope.empty = true;

    $scope.scotches = BasketService.getSelectedList(type);

    $scope.$on('handle' + type + 'ItemCount', function () {
        $scope.itemCnt = BasketService.getSelectedCnt(type);
        $scope.scotches = BasketService.getSelectedList(type);
      
            $scope.empty = ($scope.itemCnt === 0);
             console.log("set empty to "+$scope.empty);
       
    });

    $scope.removeItem = function (value) {
        BasketService.unselect(value,type);
    };

    $scope.removeAllItems = function () {
        BasketService.unselectAll(type);
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

myTable.controller('scotchController', function ($scope, $attrs,BasketService) {

   // var myService = $injector.get($attrs.myService);

    this.message = $attrs.myType;
   // this.message = "test2";
    var type = $attrs.myType;
    BasketService.setType(type);
    
    this.scotches = BasketService.getList(type);

    BasketService.updateSelectedList(this.scotches,type);

    // This property is bound to the checkbox in the table header
    this.allItemsSelected = BasketService.allSelected(type);

// Fired when an entity in the table is checked
    this.selectEntity = function () {
        BasketService.updateSelectedList(this.scotches,type);
    };

    // Fired when the checkbox in the table header is checked
    this.selectAll = function () {
        // Loop through all the entities and set their isChecked property
        for (var i = 0; i < this.scotches.length; i++) {
            this.scotches[i].selected = this.allItemsSelected;
        }

        BasketService.updateSelectedList(this.scotches,type);
    };

    $scope.$on('handle' + type + 'ItemCount', function () {
        this.allItemsSelected = BasketService.allSelected(type);
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

    service.getList = function (type) {
        var list = [];
        list= ScotchService.getList();
        console.log("getList service"+ list);
        return ScotchService.getList();
    };

    service.getSelectedList = function (type) {
        return ScotchService.getSelectedList();
    };

    service.updateSelectedList = function (value,type) {
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
        console.log("allSelected is " + ScotchService.getAllSelected()+ " type is "+type);
        this.broadcastItemCount(type);

        return ret;
    };

    service.broadcastItemCount = function (type) {
        console.log("broadcastItemCount "+type);
        $rootScope.$broadcast('handle' + type + 'ItemCount');
        //  $rootScope.$emit('handleItemCount');
    };

    service.getSelectedCnt = function (type) {
     //   return 0;
     //   console.log("get selected " + ScotchService.getSelectedCnt());
        return ScotchService.getSelectedCnt();
    };

    service.allSelected = function (type) {
        console.log("get allSelected " + ScotchService.getAllSelected());
        return ScotchService.getAllSelected();

    };

    service.unselect = function (value,type) {
        var list = ScotchService.getList();
        for (var i = 0; i < list.length; i++) {
            if (JSON.stringify(list[i]) === JSON.stringify(value)) {
                list[i].selected = false;
                break;
            }
        }
        this.updateSelectedList(list,type);
    };

    service.unselectAll = function (type) {
        var list = ScotchService.getList();
        for (var i = 0; i < list.length; i++) {
            list[i].selected = false;
        }
        this.updateSelectedList(list,type);
    };

    return service;
});

