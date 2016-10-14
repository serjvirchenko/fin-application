'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:ModalCreateController
 * @description
 * # ModalCreateController
 * Controller of the appApp
 */
angular.module('appApp')
  .controller('ModalOCreateController', function($scope, $uibModalInstance, SearchService, offerOData){
    $scope.dataSuccess = 'o-create';

    $scope.offerOData = {
      currency: offerOData.currency_id,
      offer: offerOData.id,
      term: offerOData.term,
      sum: offerOData.minSumma,
      percent: offerOData.minPercent,
      termType: offerOData.termType
    };

    $scope.cancel = function(){
      $uibModalInstance.dismiss('cancel');
    };

    SearchService.sendOCreate($scope.offerOData).then(
      function(data){
        if(data.success){
          $scope.dataSuccess = 'true';
        }else $scope.errorModal = data;
      }
    )

  });
