'use strict';

/**
 * @ngdoc service
 * @name appApp.page
 * @description
 * # apge
 * Factory in the appApp.
 */
angular.module('appApp')
  .factory('BargainService', function ($http, $q, $rootScope) {

    return {
      getBargains: function(a){
        var defer=$q.defer();
        $http({
          method: 'POST',
          url: '/bargain/' + a,
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

        return defer.promise;
      },

        getInsteadMessages: function(id){
            var defer=$q.defer();
            $http({
                method: 'POST',
                url: '/bargain/get-messages',
                data: {
                    bargain: id,
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

            return defer.promise;
        },

        addInsteadMessage: function(newBargainData){
            var defer=$q.defer();
            $http({
                method: 'POST',
                url: '/bargain/add-message',
                data: newBargainData,
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

            return defer.promise;
        },

        changeMesStatus: function(newStatus){
            var defer=$q.defer();
            $http({
                method: 'POST',
                url: '/bargain/change-mes-status',
                data: {
                    message: newStatus
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

            return defer.promise;
        },

        rejectMes: function(rejectData){
            var defer=$q.defer();
            $http({
                method: 'POST',
                url: '/bargain/reject',
                data: rejectData,
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

            return defer.promise;
        },

        createBMes: function(createBData){
            var defer=$q.defer();
            $http({
                method: 'POST',
                url: '/deal/b-create',
                data: createBData,
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

            return defer.promise;
        },

        getSuccessStatus: function(data){
            var defer=$q.defer();
            $http({
                method: 'POST',
                url: '/deal/data',
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

            return defer.promise;
        },

        geTokenForCreate: function(){
            var defer=$q.defer();
            $http({
                method: 'GET',
                url: '/order/create',
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

            return defer.promise;
        },

        sendOrderC: function(data){
            var defer=$q.defer();
            $http({
                method: 'POST',
                url: '/order/create',
                data: data
            })
                .success(function(data, status, headers,config){
                    defer.resolve(data);

                })
                .error(function(err, status){
                    defer.reject(err);
                })

            return defer.promise;
        },

    };
  });
