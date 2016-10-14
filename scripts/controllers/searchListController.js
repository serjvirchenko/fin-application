'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the appApp
 */
angular.module('appApp')
    .controller('SearchCtrl', function ($rootScope, $scope, ModalService, $timeout, $document, $uibModal, PageFactory) {

        $scope.someData = {
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
        $scope.contentSpinner = true;
        $scope.filterMe = function(){
            $scope.contentSpinner = true;

            PageFactory.getOffers($scope.someData).then(
                function(d){
                    $scope.offersD = d;
                    $scope.offersPages = d.paginator.pages;
                    if(d.success){
                        $timeout(function(){$scope.contentSpinner = false}, 1000)
                    }
                }
            )
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
        if($rootScope.userVerificationLevel > 3 || $rootScope.userType === 'creditor'){
            $scope.openModalCreate = function(offerData){
                $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'views/modalCreate.html',
                    scope: $scope,
                    size: '',
                    controller: function($uibModalInstance){
                        $scope.spinnerBargainModal = true;
                        $scope.sentBargain = 'o-create';
                        $scope.createOfferData = offerData;
                        $scope.createOfferData = {
                            currency: offerData.currency_id,
                            offer: offerData.id,
                            term: offerData.term,
                            sum: offerData.minSumma,
                            percent: offerData.minPercent,
                            termType: offerData.termType
                        };
                        PageFactory.sendBargain($scope.createOfferData).then(
                            function(data){
                                if(data.success){
                                    $scope.spinnerBargainModal = false;
                                    $scope.sentBargain = true;
                                }else if(data.success == false){
                                    $scope.spinnerBargainModal = false;
                                }
                            }
                        );
                        $scope.cancelBargain = function(){
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    backdrop: 'static'
                });
            };
            $scope.openBargainModal = function(offerData){
                $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'views/modalCreate.html',
                    scope: $scope,
                    size: '',
                    controller: function($uibModalInstance){
                        $scope.sentBargain = false;
                        $scope.bargainOfferData = offerData;
                        $scope.bargainData = {
                            currency: offerData.currency_id,
                            offer: offerData.id,
                            term: offerData.term,
                            termType: offerData.termType
                        };
                        $scope.cancelBargain = function(){
                            $uibModalInstance.dismiss('cancel');
                        };
                        $scope.startBargain = function(){
                            $scope.spinnerBargainModal = true;
                            PageFactory.sendBargain($scope.bargainData).then(
                                function(data){
                                    if(data.success == "true"){
                                        $scope.spinnerBargainModal = false;
                                        $scope.sentBargain = true;
                                    }else if(data.success == "false"){
                                        $scope.spinnerBargainModal = false;
                                    }
                                }
                            )
                        }
                    },
                    backdrop: 'static'
                });
            }
        }

    });
