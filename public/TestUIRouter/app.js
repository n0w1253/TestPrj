// app.js
var routerApp = angular.module('routerApp', ['ui.router']);

routerApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

            // HOME STATES AND NESTED VIEWS ========================================
            .state('home', {
                url: '/home',
                templateUrl: 'partial-home.html'
            })

            // nested list with custom controller
            .state('home.list', {
                url: '/list',
                templateUrl: 'partial-home-list.html',
                controller: function ($scope) {
                    $scope.dogs = ['Bernese', 'Husky', 'Goldendoodle'];
                }
            })

            // nested list with just some random string data
            .state('home.paragraph', {
                url: '/paragraph',
                template: 'I could sure use a drink right now.'
            })


            // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
            .state('about', {
                url: '/about',
                views: {
                    // the main template will be placed here (relatively named)
                    '': {templateUrl: 'partial-about.html'},
                    // the child views will be defined here (absolutely named)
                    'columnOne@about': {template: 'Item Info Here!'},
                    // for column two, we'll define a separate controller 
                    'columnTwo@about': {
                        templateUrl: 'table-data.html',
                        controller: 'scotchController'
                    }
                }

            })
            
            // HOME STATES AND NESTED VIEWS ========================================
            .state('basket', {
                url: '/basket',
                templateUrl: 'partial-basket.html',
                controller: 'basketCtrl'
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
      /*  // If any entity is not checked, then uncheck the "allItemsSelected" checkbox
        for (var i = 0; i < $scope.scotches.length; i++) {
            if (!$scope.scotches[i].selected) {
                $scope.allItemsSelected = false;
                BasketService.updateSelectedList($scope.scotches);
                return;
            }
        }

        // ... otherwise ensure that the "allItemsSelected" checkbox is checked
        BasketService.updateSelectedList($scope.scotches);
        $scope.allItemsSelected = true;
        */
    };

    // Fired when the checkbox in the table header is checked
    $scope.selectAll = function () {
        // Loop through all the entities and set their isChecked property
        for (var i = 0; i < $scope.scotches.length; i++) {
            $scope.scotches[i].selected = $scope.allItemsSelected;
        }
        
        BasketService.updateSelectedList($scope.scotches);
    };

    $scope.$on('handleItemCount', function() {
        $scope.allItemsSelected = BasketService.allSelected();
    });
});

routerApp.controller('basketCtrl', function ($scope, BasketService) {
    $scope.itemCnt = BasketService.getSelectedCnt();
    
    $scope.scotches = BasketService.getSelectedList();
    
    $scope.$on('handleItemCount', function() {
        $scope.itemCnt = BasketService.getSelectedCnt();
    });
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
            name: 'Glenfiddich 1937',
            price: 20000,
            selected: false
        }
    ];

    var selectedList = []; 
    
    var allSelected = false;

   /* this.setSelectedList = function (value) {
        selectedList = this.getSelectedList(value);
        
    };*/
 
    this.getList = function(){
        return scotches;
    };
    
    this.getSelectedList = function(){
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
    };

    this.getSelectedCnt = function () {
        console.log("get selected " + selectedList.length);
        return selectedList.length;
    };
    
    this.allSelected = function () {
        console.log("get allSelected " + allSelected);
        return allSelected;
        // If any entity is not checked, then uncheck the "allItemsSelected" checkbox
       
    };
});

