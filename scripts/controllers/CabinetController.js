'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:PageCtrl
 * @description
 * # PageCtrl
 * Controller of the appApp
 */
angular.module('appApp')
  .controller('CabinetController', function ($rootScope, $scope, ModalService, $document, $uibModal, PageFactory, CabinetService, SearchService, $state, userData, USER_ROLES) {
    $rootScope.userData = userData;
    $scope.userRoles = $rootScope.userData.user.roles;

    /*VERIFICATION DISABLED*/

      $scope.hasPermissionVerificated = function(userRoles){        /*AFTER ALL LEVELS VERIFICATION*/
        var truthy;
        angular.forEach(userRoles, function(role){
          if (role != USER_ROLES.CREDITOR && role != USER_ROLES.BORROWER){
            truthy = true;
          }else truthy = false;
        });
        return truthy;
      };

      $scope.hasPermissionDemo = function(userRoles){       /*DEMO SEARCH*/
        var truthy;
        angular.forEach(userRoles, function(role){
          if (role === USER_ROLES.BORROWER_LEVEL1){
            truthy = true;
          }else truthy = false;
        });
        return truthy;
      };

    /*END VERIFICATION DISABLED*/

    $scope.tabs = [
      { heading: "Поиск", route:"cabinet.search", routeTo:false, active:false },
      { heading: "Запросы", route:"cabinet.request", routeTo:"cabinet.request.inbox", active:false, disable: $scope.hasPermissionVerificated($scope.userRoles)},
      { heading: "Кабинет", route:"cabinet.cabinet", routeTo:false, active:false, disable: $scope.hasPermissionVerificated($scope.userRoles)},
    ];

    $scope.intabs = [
      { heading: "Входящие", route:"cabinet.request.inbox", class:"icon-q1", routeTo:false, active:false },
      { heading: "Исходящие", route:"cabinet.request.outbox", class:"icon-q6", routeTo:false, active:false}
    ];

    $scope.go = function(route){
      if(route != false){
        $state.go(route);
        return true;
      }else return false;
    };

    $scope.active = function(route){
      return $state.includes(route);
    };

    $scope.$on("$stateChangeSuccess", function() {
      $scope.intabs.forEach(function(intab) {
        intab.active = $scope.active(intab.route);
      });
      $scope.tabs.forEach(function(tab) {
        tab.active = $scope.active(tab.route);
      });
    });

    $scope.openModalAddOffer = function(){
      $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'views/modalAddOffer.html',
        scope: $scope,
        controller: 'AddOfferController',
        backdrop: 'static',
        size: 'lg',
        resolve: {
          token: function(CabinetService){
            return CabinetService.getAddOfferToken();
          }
        },
      });
    };

    $scope.openModalVerification = function(){
      $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'views/modalVerification.html',
        scope: $scope,
        controller: 'VerificationController',
        backdrop: 'static',
        size: 'lg',
        resolve: {
          token: function(VerificationService, $rootScope){
            return VerificationService.getToken($rootScope.userData.user.roles);
          }
        }
      })
    };

    $scope.selectMess = function(i){
      $scope.tabMess = i;
    };

    $scope.parseInt = parseInt;

  });
