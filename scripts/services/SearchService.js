'use strict';

/**
 * @ngdoc service
 * @name appApp.demo
 * @description
 * # demo
 * Factory in the appApp.
 */
angular.module('appApp')
    .factory('SearchService', function ($http, $q, $rootScope, USER_ROLES) {
      return {
        getOffers: function(roles, filterData){
          var defer=$q.defer();
          var userRole;
          $rootScope.spinnerLoading = true;
          angular.forEach(roles, function(role){
            if(role != USER_ROLES.BORROWER_LEVEL1){
              userRole = 'list';
            }else if(role === USER_ROLES.BORROWER_LEVEL1){
              userRole = 'demo';
            }
          });
          $http({
            method: 'POST',
            url: '/offers/' + userRole,
            data: {
              minSum: filterData.minSum,
              maxSum: filterData.maxSum,
              maxTerm: filterData.maxTerm,
              minTerm: filterData.minTerm,
              term: filterData.term,
              termType: filterData.termType,
              limit: filterData.limit,
              minPercent: filterData.minPercent,
              maxPercent: filterData.maxPercent,
              page: filterData.page,
              orderBy: filterData.orderBy,
              orderDirection: filterData.orderDirection,
              currency: filterData.currency
            },
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
            })

          return defer.promise;
        },

        sendCreate: function(data){
          var defer=$q.defer();
          $rootScope.spinnerLoading = true;
          $http({
            method: 'POST',
            url: '/bargain/create',
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

        sendOCreate: function(data){
          var defer=$q.defer();
          $rootScope.spinnerLoading = true;
          $http({
            method: 'POST',
            url: '/deal/o-create',
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
