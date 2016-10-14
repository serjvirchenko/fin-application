'use strict';

/**
 * @ngdoc service
 * @name appApp.modal
 * @description
 * # modal
 * Factory in the appApp.
 */
angular.module('appApp')
  .factory('VerificationService', function ($http, $q, $rootScope, USER_ROLES) {
    return {
      getToken: function(roles){
        var defer=$q.defer();
        var urlRole;
        $rootScope.spinnerLoading = true;
        angular.forEach(roles, function(role){
          switch(role) {
            case (USER_ROLES.BORROWER_LEVEL1): urlRole = 'personal-data';
              break;
            case (USER_ROLES.BORROWER_LEVEL2): urlRole = 'passports';
              break;
            case (USER_ROLES.BORROWER_LEVEL3): urlRole = 'docs';
              break;
            case (USER_ROLES.BORROWER_LEVEL4): urlRole = 'phone';
              break;
            case (USER_ROLES.BORROWER_LEVEL5): urlRole = 'video';
              break;
          }
        });
        $http({
          method: 'GET',
          url: '/reg/' + urlRole,
          headers: {
              'X-Requested-With' :'XMLHttpRequest'
          }
        })
          .success(function(data, status, headers,config){
              defer.resolve(data);
          })
          .error(function(err, status){
              defer.reject(err);
          })
          .finally(function(){
            $rootScope.spinnerLoading = false;
          });

        return defer.promise;
      },
      sendData: function(role, data){
        var defer=$q.defer();
        var urlRole;
        $rootScope.spinnerLoading = true;
          switch(role) {
            case ('borrower_level1'): urlRole = 'personal-data';
              break;
            case ('borrower_level2'): urlRole = 'passports';
              break;
            case ('borrower_level3'): urlRole = 'docs';
              break;
            case ('borrower_level4'): urlRole = 'docs';
              break;
            case ('borrower_level5'): urlRole = 'phone';
              break;
            case ('borrower_level6'): urlRole = 'video';
              break;
          }
          $http({
            method: 'POST',
            url: '/reg/' + urlRole,
            data: data,
            headers: {
                'X-Requested-With' :'XMLHttpRequest'
            }
          })
            .success(function(data, status, headers,config){
                defer.resolve(data);
            })
            .error(function(err, status){
                defer.reject(err);
            })
            .finally(function(){
              $rootScope.spinnerLoading = false;
            });

          return defer.promise;
      },
      sendDocs: function(files) {
        var fd = new FormData();
        var defer = $q.defer();
        $rootScope.spinnerLoading = true;
        angular.forEach(files, function (file, key) {
            fd.append(key, file);
        });
        $http.post('/reg/docs', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined, 'X-Requested-With': 'XMLHttpRequest'}
        })
          .success(function(data, status, headers,config){
              defer.resolve(data);
          })
          .error(function(err, status){
              defer.reject(err);
          })
          .finally(function(){
            $rootScope.spinnerLoading = false;
          });

        return defer.promise;

      },
    };
  });
