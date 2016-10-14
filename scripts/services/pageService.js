'use strict';

/**
 * @ngdoc service
 * @name appApp.page
 * @description
 * # apge
 * Factory in the appApp.
 */
angular.module('appApp')
  .factory('PageFactory', function ($http, $q) {

    return {
      getDemoOffers: function(){
          var defer=$q.defer();
          $http({
              method: 'POST',
              url: '/offers/demo',
              headers: {
                  'X-Requested-With' :'XMLHttpRequest'
              }
          })
              .success(function(data, status, headers,config){
                  defer.resolve(data);

              })
              .error(function(err, status){
                  defer.reject(err);
              });

          return defer.promise;
      },
      getOffers: function(data){
        var defer=$q.defer();
        $http({
          method: 'POST',
          url: '/offers/list',
          data: {
              minSum: data.minSum,
              maxSum: data.maxSum,
              maxTerm: data.maxTerm,
              minTerm: data.minTerm,
              term: data.term,
              termType: data.termType,
              limit: data.limit,
              minPercent: data.minPercent,
              maxPercent: data.maxPercent,
              page: data.page,
              orderBy: data.orderBy,
              orderDirection: data.orderDirection,
              currency: data.currency
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
      getAddOfferToken: function(){
        var defer=$q.defer();
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

        return defer.promise;
      },
      addOffer: function(data){
        var defer=$q.defer();
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

        return defer.promise;
      },
      sendBargain: function(data){
        var defer=$q.defer();
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

        return defer.promise;
      },
        sendOCreate: function(data){
          var defer=$q.defer();
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

          return defer.promise;
        },
    };
  });
