'use strict';

/**
 * @ngdoc overview
 * @name appApp
 * @description
 * # appApp
 *
 * Main module of the application.
 */
angular
  .module('appApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ui.router',
    'ngSanitize',
    'ngTouch',
    'ngMaterial',
    'angularModalService',
    'ui.bootstrap',
    'ui-rangeSlider'
  ])
  .run(function($rootScope, $location, $window, $state, CabinetService){
    $rootScope.spinnerLoading = false;
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      if(error){
        event.preventDefault();
        $rootScope.globalError = error;
        $state.go('error');
      }
    });
    $rootScope.$on('$viewContentLoading', function(event, viewConfig){
      $rootScope.spinnerLoading = true;
    });
    $rootScope.$on('$viewContentLoaded', function(event){
      $rootScope.spinnerLoading = false;
    });
}).constant("USER_ROLES", {
    "BORROWER_LEVEL1": "borrower_level1",
    "BORROWER_LEVEL2": "borrower_level2",
    "BORROWER_LEVEL3": "borrower_level3",
    "BORROWER_LEVEL4": "borrower_level4",
    "BORROWER_LEVEL5": "borrower_level5",
    "BORROWER": "borrower",
    "CREDITOR": "creditor"
})
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
      $urlRouterProvider.otherwise("/cabinet/search");
      $stateProvider
        .state('cabinet', {
          url: '/cabinet',
          views: {
            "": {
              controller: 'CabinetController',
              templateUrl: 'views/cabinet.html'
            }
          },
          userRoles: ['creditor', 'borrower_level1', 'borrower_level2', 'borrower_level3', 'borrower_level4', 'borrower_level5', 'borrower'],
          resolve: {
            userData: ['$rootScope', 'CabinetService', function($rootScope, CabinetService){
              return CabinetService.getUserPermission(this.userRoles);
            }],
          }
        })
          .state('cabinet.search', {
              url: '/search',
              views: {
                  "tabs": {
                    controller: 'SearchController',
                    templateUrl: 'views/search.html'
                  }
              },
              userRoles: ['creditor', 'borrower_level1', 'borrower_level2', 'borrower_level3', 'borrower_level4', 'borrower_level5', 'borrower'],
              resolve: {
                userData: ['$rootScope', 'CabinetService', function($rootScope, CabinetService){
                  return CabinetService.getUserPermission(this.userRoles);
                }]
              }
          })
          .state('cabinet.request', {
            url: '/request',
            abstract:true,
            views: {
              "tabs": {
                templateUrl: 'views/bargains.html'
              }
            },
            userRoles: ['creditor', 'borrower'],
            resolve: {
              userData: ['$rootScope', 'CabinetService', function($rootScope, CabinetService){
                return CabinetService.getUserPermission(this.userRoles);
              }]
            }
          })
            .state('cabinet.request.inbox', {
              url: '/inbox',
              views: {
                "bargains": {
                  controller: 'BargainsController',
                  templateUrl: 'views/bargains.inoutbox.html'
                }
              },
              userRoles: ['creditor', 'borrower'],
              resolve: {
                userData: ['$rootScope', 'CabinetService', function($rootScope, CabinetService){
                  return CabinetService.getUserPermission(this.userRoles);
                }],
                bargains: ['BargainService', function(BargainService){
                  return BargainService.getBargains('inbox');
                }]
              }
            })
            .state('cabinet.request.outbox', {
              url: '/outbox',
              views: {
                "bargains": {
                  controller: 'BargainsController',
                  templateUrl: 'views/bargains.inoutbox.html'
                }
              },
              userRoles: ['creditor', 'borrower'],
              resolve: {
                userData: ['$rootScope', 'CabinetService', function($rootScope, CabinetService){
                  return CabinetService.getUserPermission(this.userRoles);
                }],
                bargains: ['BargainService', function(BargainService){
                  return BargainService.getBargains('outbox');
                }]
              }
            })
          .state('cabinet.cabinet', {
              url: '/cabinet',
              views: {
                  "tabs": {
                      templateUrl: 'views/1.html'
                  }
              },
              userRoles: ['creditor', 'borrower'],
              resolve: {
                userData: ['$rootScope', 'CabinetService', function($rootScope, CabinetService){
                  return CabinetService.getUserPermission(this.userRoles);
                }]
              }
          })
        .state('error', {
            url: '/error',
            views: {
                "": {
                    controller: function($rootScope, $scope){

                    },
                    templateUrl: 'views/globalError.html'
                }
            }
        });
      /*$locationProvider.html5Mode({
          enabled: true,
          requireBase: false
      });*/

  });
