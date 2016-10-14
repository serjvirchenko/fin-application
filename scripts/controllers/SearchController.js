'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:mainSearchCtrl
 * @description
 * # mainearchCtrl
 * Controller of the appApp
 */
angular.module('appApp')
    .controller('SearchController', function ($rootScope, $scope, $uibModal, SearchService) {

      $scope.filterData = {
        minSum: '',
        maxSum: '',
        minTerm: '',
        maxTerm: '',
        termType: '',
        limit: '10',
        minPercent: '',
        currency: '1',
        maxPercent: '',
        page: '1',
        orderBy: 'createDate',
        orderDirection: 'ASC'
      };

      $scope.openCalculator = function(offerData){
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'views/modalCalculator.html',
          scope: $scope,
          size: '',
          controller: function($uibModalInstance){
            $scope.calcData = {
              calcPercent: offerData.minPercent,
              calcSum: offerData.minSumma,
              calcTerm: offerData.term,
              calcTermType: offerData.termType,
              calcCurrency: offerData.currencyCode
            };
            $scope.cancelCalculate = function(){
              $uibModalInstance.dismiss('cancel');
            };
            $scope.calculatedPerMonth = ($scope.calcData.calcPercent / 1200) * $scope.calcData.calcSum + ($scope.calcData.calcSum / $scope.calcData.calcTerm);
            $scope.calculatedPerDay = (($scope.calcData.calcPercent / 36500) * $scope.calcData.calcSum + ($scope.calcData.calcSum / $scope.calcData.calcTerm)) * 10;
            $scope.calculatedTotalMonth = $scope.calculatedPerMonth * $scope.calcData.calcTerm;
            $scope.calculatedTotalDay = $scope.calculatedPerDay / 10 * $scope.calcData.calcTerm;
          },
          backdrop: 'static'
        });
      };

      $scope.openModalCreate = function(offerData){
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'views/modalCreate.html',
          scope: $scope,
          size: '',
          controller: 'ModalCreateController',
          resolve: {
            offerData: offerData,
          },
          backdrop: 'static'
        });
      };

      $scope.openModalOCreate = function(offerData){
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'views/modalCreate.html',
          scope: $scope,
          size: '',
          controller: 'ModalOCreateController',
          resolve: {
            offerOData: offerData,
          },
          backdrop: 'static'
        });
      };

      $rootScope.$watch('userData', function(){
        $scope.filterMe = function(){
          SearchService.getOffers($rootScope.userData.user.roles, $scope.filterData).then(
            function(data){
              $scope.offers = data;
              $scope.offersPages = $scope.offers.paginator.pages;
            }
          )
        };
        $scope.filterMe();
      });
    });
