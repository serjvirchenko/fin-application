'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:DemoSearchCtrl
 * @description
 * # DemoSearchCtrl
 * Controller of the appApp
 */
angular.module('appApp')
    .controller('DemoSearchCtrl', function ($rootScope, $scope, ModalService, $document, $uibModal, PageFactory) {
        $scope.firstModalOpen = function(){
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/modalFirstEnter.html',
                controller: 'FirstModalCtrl',
                resolve: {

                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            });
        };
        $scope.firstModalOpen();
        PageFactory.getDemoOffers().then(
            function(data){
                $scope.demoOffers = data.offers;
                if(data.success){
                    $scope.contentSpinner = false;
                }
            }
        );
    });
