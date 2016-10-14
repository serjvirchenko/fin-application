'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:ModalCtrl
 * @description
 * # ModalCtrl
 * Controller of the appApp
 */
angular.module('appApp')
  .controller('AddOfferController', function($scope, $uibModalInstance, CabinetService, token){

    $scope.addedOffer = false;

    $scope.cancelAddOffer = function(){
      $uibModalInstance.dismiss('cancel');
    };

    $scope.addOfferData = {
      csrfAddOffer: token.csrfAddOffer,
    };

    $scope.addOffer = function(){
      CabinetService.addOffers($scope.addOfferData).then(
        function(data){
          $scope.success = data;
          if($scope.success.success == true){
            $scope.addedOffer = true;
          }else if($scope.success.success == false){
            $scope.spinnerAddOfferModal = false;
          }
        }
      )
    };
  });
