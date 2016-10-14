'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:RequestController
 * @description
 * # RequestController
 * Controller of the appApp
 */
angular.module('appApp')
  .controller('BargainsController', function ($rootScope, $scope, $uibModal, BargainService, bargains) {

    $scope.bargains = bargains;

    $scope.messagesOpened = false;

    $scope.getMessages = function($index, id){
      BargainService.getInsteadMessages(id).then(
        function(data){
          $scope.messagesOpened = $index;
          $scope.insteadMessages = data;
        }
      )
    };

    $scope.closeMessages = function(){
      $scope.messagesOpened = false;
    }

    $scope.toggleMessages = function($index, id){
      if($scope.messagesOpened === $index){
        $scope.closeMessages();
        console.log('1')
      }else {$scope.getMessages($index, id);console.log('2')}
    }


  });
