'use strict';

/**
 * @ngdoc service
 * @name appApp.main
 * @description
 * # main
 * Factory in the appApp.
 */
angular.module('appApp')
    .factory('CabinetService', function ($http, $q, $rootScope) {
      return {
        getUserIdentity: function() {
          var defer=$q.defer();
          $rootScope.spinnerLoading = true;
          $http({
            method: 'GET',
            url: '/cabinet/identity',
            headers: {
                'X-Requested-With' :'XMLHttpRequest'
            }
          })
            .success(function(data, status, headers,config){
                defer.resolve(data);
            })
            .error(function(err, status){
                defer.reject('Ошибка ' + status);
            })
            .finally(function(){
              $rootScope.spinnerLoading = false;
            });

          return defer.promise;
        },
        getUserPermission: function(userRoles) {
          var defer=$q.defer();
          $rootScope.spinnerLoading = true;
          $http({
            method: 'GET',
            url: '/cabinet/identity',
            headers: {
              'X-Requested-With' :'XMLHttpRequest'
            }
          })
            .success(function(data, status, headers,config){
              var i = 0;
              if(data.success){
                angular.forEach(data.user.roles, function(permissionRole){
                  angular.forEach(userRoles, function(userRole){
                    if(userRole === permissionRole){
                      i++;
                    }
                  })
                });
                if(i > 0){
                  defer.resolve(data)
                }else defer.reject("You don't have premission!")
              }else defer.reject(data.success.message);
            })
            .error(function(err, status){
              if (status === 401){
                defer.reject(err.message);
              }else defer.reject('Ошибка ' + status);
            })
            .finally(function(){
              $rootScope.spinnerLoading = false;
            });

          return defer.promise;
        },
        getAddOfferToken: function(){
          var defer=$q.defer();
          $rootScope.spinnerLoading = true;
          $http({
            method: 'GET',
            url: '/offers/create',
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
        addOffers: function(data){
          var defer=$q.defer();
          $rootScope.spinnerLoading = true;
          $http({
            method: 'POST',
            url: '/offers/create',
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
      };
    });
