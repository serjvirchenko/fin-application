'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:ModalCreateController
 * @description
 * # ModalCreateController
 * Controller of the appApp
 */
angular.module('appApp')
  .controller('ModalCreateController', function($scope, $uibModalInstance, SearchService, offerData){
    $scope.dataSuccess = 'create';

    $scope.offerData = {
      currency: offerData.currency_id,
      offer: offerData.id,
      term: offerData.term,
      termType: offerData.termType
    };

    $scope.cancel = function(){
      $uibModalInstance.dismiss('cancel');
    };

    $scope.sendData = function(){
      SearchService.sendCreate($scope.offerData).then(
        function(data){
          if(data.success){
            $scope.dataSuccess = 'true';
          }else $scope.errorModal = data;
        }
      )
    };

  });
