'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:FirstModalCtrl
 * @description
 * # FirstModalCtrl
 * Controller of the appApp
 */
angular.module('appApp')
    .controller('FirstModalCtrl', function ($rootScope, $scope, $uibModalInstance) {

        $scope.spinnerModal = false;
        $scope.currentStep = 1;

        $scope.next = function(){
            $scope.currentStep = $scope.currentStep + 1;
        };
        $scope.prev = function(){
            $scope.currentStep = $scope.currentStep - 1;
        };

        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


    });
