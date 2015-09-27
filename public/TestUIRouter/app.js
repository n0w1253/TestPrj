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
                    'columnOne@about': {template: 'Look I am a column!'},
                    // for column two, we'll define a separate controller 
                    'columnTwo@about': {
                        templateUrl: 'table-data.html',
                        controller: 'scotchController'
                    }
                }

            });

});

// let's define the scotch controller that we call up in the about state
routerApp.controller('scotchController', function ($scope) {

    $scope.message = 'test';

    $scope.scotches = [
        {
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

    // This property is bound to the checkbox in the table header
    $scope.allItemsSelected = false;

// Fired when an entity in the table is checked
    $scope.selectEntity = function () {
        // If any entity is not checked, then uncheck the "allItemsSelected" checkbox
        for (var i = 0; i < $scope.scotches.length; i++) {
            if (!$scope.scotches[i].isChecked) {
                $scope.allItemsSelected = false;
                return;
            }
        }

        // ... otherwise ensure that the "allItemsSelected" checkbox is checked
        $scope.allItemsSelected = true;
    };

    // Fired when the checkbox in the table header is checked
    $scope.selectAll = function () {
        // Loop through all the entities and set their isChecked property
        for (var i = 0; i < $scope.scotches.length; i++) {
            $scope.scotches[i].isChecked = model.allItemsSelected;
        }
    };

});



