'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:ModalCtrl
 * @description
 * # ModalCtrl
 * Controller of the appApp
 */
angular.module('appApp')
  .controller('VerificationController', function ($rootScope, $scope, $uibModalInstance, $uibModal, $filter, VerificationService, CabinetService, USER_ROLES, token) {

    $scope.verificationSuccess = false;
    angular.forEach($rootScope.userData.user.roles, function(role){
      switch (role){
        case (USER_ROLES.BORROWER_LEVEL1):
          $scope.currentRole = role;

          $scope.maxDate = new Date(1995, 5, 22);

          $scope.user = {
            personalDataCsrf: token.personalDataCsrf,
          };
          $scope.send = function(){
            $scope.user.birthday = $filter('date')($scope.user.birthday, 'yyyy-MM-dd');
            VerificationService.sendData(role, $scope.user).then(
              function (data){
                if(data.success){
                  $scope.verificationSuccess = true;
                }else $scope.errorModal = data;
              }
            )
          };

          break;
        case (USER_ROLES.BORROWER_LEVEL2):
          $scope.currentRole = role;

          $scope.maxDate = new Date();

          $scope.userPassport = {
            passportsCsrf: token.passportsCsrf,
          };

          $scope.send = function(){
            $scope.userPassport.issuedDate = $filter('date')($scope.userPassport.issuedDate, 'yyyy-MM-dd') ;
            VerificationService.sendData(role, $scope.userPassport).then(
              function (data){
                if(data.success){
                  $scope.verificationSuccess = true;
                }else $scope.errorModal = data;
              }
            )
          };

          break;
        case (USER_ROLES.BORROWER_LEVEL3):
          $scope.currentRole = role;

          $scope.userDocs = {
            docsCsrf: $scope.docsCsrf,
          };

          $scope.uploadFile = function(){
            VerificationService.senDocs($scope.userDocs).then(
              function (data){
                if(data.success){
                  $scope.verificationSuccess = true;
                }else $scope.errorModal = data;
              }
            )
          }

          break;
        case (USER_ROLES.BORROWER_LEVEL4):
          $scope.currentRole = role;

          $scope.minDate = new Date();

          $scope.userPhone = {
            callCsrf: token.callCsrf,
          };

          $scope.send = function(){
            $scope.userPhone.time = $filter('date')($scope.userPhone.time, 'H:mm') ;
            $scope.userPhone.date = $filter('date')($scope.userPhone.date, 'yyyy-MM-dd') ;
            VerificationService.sendData(role, $scope.userPhone).then(
              function (data){
                if(data.success){
                  $scope.verificationSuccess = true;
                }else $scope.errorModal = data;
              }
            )
          };

          break;
        case (USER_ROLES.BORROWER_LEVEL5):
          $scope.currentRole = role;

          $scope.minDate = new Date();

          $scope.userSkype = {
            callCsrf: $scope.callCsrf,
          };

          $scope.send = function(){
            $scope.userSkype.time = $filter('date')($scope.userSkype.time, 'H:mm') ;
            $scope.userSkype.date = $filter('date')($scope.userSkype.date, 'yyyy-MM-dd') ;
            VerificationService.sendData(role, $scope.userSkype).then(
              function (data){
                if(data.success == true){
                  $scope.FifthStepSuccess = true;
                }else $scope.errorModal = data;
              }
            )
          };

          break;
      }
    });


    $scope.userData = {

    };

    $scope.ok = function () {
      CabinetService.getUserIdentity().then(
        function(data) {
            $rootScope.userData = data;
            $uibModalInstance.dismiss('cancel');
        });
	  };

	  $scope.cancel = function () {
      CabinetService.getUserIdentity().then(
        function(data) {
          $rootScope.userData = data;
          $uibModalInstance.dismiss('cancel');
        });
	  };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.open = function($event) {
      $scope.status.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.status = {
      opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 2);
    $scope.events =
      [
        {
            date: tomorrow,
            status: 'full'
        },
        {
            date: afterTomorrow,
            status: 'partially'
        }
      ];

    $scope.getDayClass = function(date, mode) {
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0,0,0,0);

            for (var i=0;i<$scope.events.length;i++){
                var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    };

  });
