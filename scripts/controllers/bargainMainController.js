'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:bargainMainCtrl
 * @description
 * # bargainMainCtrl
 * Controller of the appApp
 */
angular.module('appApp')
    .controller('BargainMainCtrl', function ($rootScope, $scope, BargainFactory, $uibModal) {
        console.log('request');
        $scope.openCalculator = function(bargainData){
            $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/modalCalculator.html',
                scope: $scope,
                size: '',
                controller: function($uibModalInstance){
                    $scope.calcData = {
                        calcPercent: bargainData.percent,
                        calcSum: bargainData.sum,
                        calcTerm: bargainData.term,
                        calcTermType: bargainData.termType,
                        calcCurrency: bargainData.currencyCode
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
        $scope.openModalOrderCreate = function(bargainData) {
            $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/modalCreate.html',
                scope: $scope,
                size: '',
                controller: function ($uibModalInstance) {
                    $scope.sentBargain = 'send-order-create';
                    $scope.spinnerBargainModal = true;
                    BargainFactory.geTokenForCreate().then(
                        function (token) {
                            $scope.spinnerBargainModal = false;
                            $scope.orderData = {
                                deal: bargainData.id,
                                csrfCreateOrder: token.csrfCreateOrder
                            };
                            $scope.cancelBargain = function () {
                                $uibModalInstance.dismiss('cancel');
                            };
                            $scope.sendOrderCreate = function(){
                                $scope.spinnerBargainModal = true;
                                BargainFactory.sendOrderC($scope.orderData).then(
                                    function(data){
                                        if(data.success){
                                            window.location.href = data.redirectUrl;
                                        }else{
                                            $scope.spinnerBargainModal = false;
                                            $scope.redirectErrors = data.messages;
                                        }
                                    }
                                )
                            }
                        }
                    );

                },
                backdrop: 'static'
            });
        }
    })
    .controller('inboxMessages', function ($rootScope, $scope, BargainFactory){
        $scope.messagesSpinner = true;
        $scope.getInboxBargains = BargainFactory.getInboxMessages().then(
            function(data){
                $scope.inboxMessages = data.bargains;
                if(data.success == "true"){
                    $scope.messagesSpinner = false;
                }
            }
        );
        $scope.insteadInboxMessIsOpened = -1;
        $scope.getInsteadInboxMessages = function($index, id){
            $scope.appendRejectMes = false;
            $scope.appendBargain = false;
            $scope.insteadMessagesSpinner = true;
            $scope.insteadInboxMessIsOpened = $index;
            BargainFactory.getInsteadBargain(id).then(
                function(data){
                    $scope.insteadMessInbox = data.messages;
                    $scope.statusDataInbox = data.bargain;
                    if(data.success == true){
                        angular.forEach(data.messages, function(message, key){
                            if(message.user_id != $rootScope.userId){
                                if(message.statusNew){
                                    BargainFactory.changeMesStatus(message.id).then(
                                        function(done){
                                            if(done.success){
                                                $scope.inboxMessages[$index].countNew = $scope.inboxMessages[$index].countNew - 1;
                                            }
                                        }
                                    )
                                }
                            }
                        });
                        if(data.bargain.status === 'finished'){
                            var bargain_id = {
                                bargain: data.bargain.id
                            };
                            BargainFactory.getSuccessStatus(bargain_id).then(
                                function(status){
                                    $scope.finalInboxData = status.deal;
                                    $scope.insteadMessagesSpinner = false;
                                    $scope.appendCreateMes = true;
                                    if($scope.finalInboxData.status === 'new'){
                                        $scope.comissBorrowStatus = true;
                                        $scope.comissCreditStatus = true;
                                    };
                                    if($scope.finalInboxData.status === 'b_comission_paid' && $rootScope.userType === 'borrower'){
                                        $scope.comissBorrowStatus = true;
                                        $scope.comissCreditStatus = false;
                                    };
                                    if($scope.finalInboxData.status === 'c_comission_paid' && $rootScope.userType === 'creditor'){
                                        $scope.comissBorrowStatus = false;
                                        $scope.comissCreditStatus = true;
                                    };
                                    if($scope.finalInboxData.status === 'processing'){
                                        $scope.comissBorrowStatus = false;
                                        $scope.comissCreditStatus = false;
                                    };
                                }
                            );
                        }else{
                            $scope.insteadMessagesSpinner = false;
                            $scope.appendCreateMes = true;
                        }

                    }
                }
            )
        };
        $scope.startBargain = function(bargainData){
            $scope.appendBargain = true;
            $scope.appendCreateMes = false;
            $scope.appendRejectMes = false;
            $scope.newBargainData = {
                currency: bargainData.currency,
                termType: bargainData.termType,
                bargain: bargainData.id
            };
            $scope.sendNewbargain = function(){
                $scope.insteadMessagesSpinner = true;
                BargainFactory.addInsteadMessage($scope.newBargainData).then(
                    function(data){
                        if(data.success){
                            $scope.insteadMessagesSpinner = false;
                            $scope.appendBargain = false;
                            BargainFactory.getInsteadBargain(bargainData.id).then(
                                function(data){
                                    $scope.insteadMessInbox = data.messages;
                                }
                            );
                        }
                        if(data.success == false){
                            $scope.insteadMessagesSpinner = false;
                            $scope.bargainErrors = data.messages;
                        }
                    }
                )
            }
        };

        $scope.appendRejectMes = false;
        $scope.rejectMes = function(bargainData, $index){
            $scope.appendRejectMes = true;
            $scope.appendCreateMes = false;
            $scope.appendBargain = false;
            $scope.rejectMessages = ['Неуважушечка', 'Не по-братски пацык поступает', 'Впадлецо'];
            $scope.rejectMesData = {
                bargain: bargainData.id,
            };
            $scope.sendRejectMes = function(){
                $scope.insteadMessagesSpinner = true;
                BargainFactory.rejectMes($scope.rejectMesData).then(
                    function(data){
                        if(data.success){
                            $scope.inboxMessages[$index].status = 'rejected';
                            $scope.inboxMessages[$index].rejectedMessage = $scope.rejectMesData.message;
                            $scope.insteadMessagesSpinner = false;
                            $scope.appendRejectMes = false;
                            BargainFactory.getInsteadBargain(bargainData.id).then(
                                function(data){
                                    $scope.insteadMessInbox = data.messages;
                                }
                            );
                        }
                        if(data.success == false){
                            $scope.insteadMessagesSpinner = false;
                            $scope.bargainErrors = data.messages;
                        }
                    }
                )
            }
        };
        $scope.createMes = function(bargainData, $index){
            $scope.appendRejectMes = false;
            $scope.appendBargain = false;
            var createMesData = {
                message: bargainData.id,
            };
            $scope.insteadMessagesSpinner = true;
            BargainFactory.createBMes(createMesData).then(
                function(data){
                    if(data.success){
                        BargainFactory.getInsteadBargain(bargainData.bargain_id).then(
                            function(data){
                                if(data.success){
                                    $scope.insteadMessInbox = data.messages;
                                    $scope.statusDataInbox = data.bargain;
                                    var bargain_id = {
                                        bargain: data.bargain.id
                                    };
                                    BargainFactory.getSuccessStatus(bargain_id).then(
                                        function(status){
                                            $scope.finalInboxData = status.deal;
                                            $scope.insteadMessagesSpinner = false;
                                            $scope.appendCreateMes = true;
                                            if($scope.finalInboxData.status === 'new'){
                                                $scope.comissBorrowStatus = true;
                                                $scope.comissCreditStatus = true;
                                            };
                                            if($scope.finalInboxData.status === 'b_comission_paid' && $rootScope.userType === 'borrower'){
                                                $scope.comissBorrowStatus = true;
                                                $scope.comissCreditStatus = false;
                                            };
                                            if($scope.finalInboxData.status === 'c_comission_paid' && $rootScope.userType === 'creditor'){
                                                $scope.comissBorrowStatus = false;
                                                $scope.comissCreditStatus = true;
                                            };
                                            if($scope.finalInboxData.status === 'processing'){
                                                $scope.comissBorrowStatus = false;
                                                $scope.comissCreditStatus = false;
                                            };
                                        }
                                    );
                                }
                            }
                        );
                    }
                    if(data.success == false){
                        $scope.insteadMessagesSpinner = false;
                        $scope.bargainErrors = data.messages;
                    }
                }
            )
        }
    })

    .controller('outboxMessages', function ($rootScope, $scope, BargainFactory){
        $scope.messagesSpinner = true;
        $scope.getOutboxBargains = BargainFactory.getOutboxMessages().then(
            function(data){
                $scope.outboxMessages = data.bargains;
                if(data.success == "true"){
                    $scope.messagesSpinner = false;
                }
            }
        );
        $scope.insteadOutboxMessIsOpened = -1;
        $scope.getInsteadOutboxMessages = function($index, id){
            $scope.appendRejectMes = false;
            $scope.appendBargain = false;
            $scope.insteadMessagesSpinner = true;
            $scope.insteadOutboxMessIsOpened = $index;
            BargainFactory.getInsteadBargain(id).then(
                function(data){
                    $scope.insteadMessOutbox = data.messages;
                    $scope.statusDataOutbox = data.bargain;
                    if(data.success == true){
                        angular.forEach(data.messages, function(message, key){
                            if(message.user_id != $rootScope.userId){
                                if(message.statusNew){
                                    BargainFactory.changeMesStatus(message.id).then(
                                        function(done){
                                            if(done.success){
                                                $scope.outboxMessages[$index].countNew = $scope.outboxMessages[$index].countNew - 1;
                                            }
                                        }
                                    )
                                }
                            }
                        });
                        if(data.bargain.status === 'finished'){
                            var bargain_id = {
                                bargain: data.bargain.id
                            };
                            BargainFactory.getSuccessStatus(bargain_id).then(
                                function(status){
                                    $scope.finalOutboxData = status.deal;
                                    $scope.insteadMessagesSpinner = false;
                                    $scope.appendCreateMes = true;
                                    if($scope.finalOutboxData.status === 'new'){
                                        $scope.comissBorrowStatus = true;
                                        $scope.comissCreditStatus = true;
                                    };
                                    if($scope.finalOutboxData.status === 'b_comission_paid' && $rootScope.userType === 'borrower'){
                                        $scope.comissBorrowStatus = true;
                                        $scope.comissCreditStatus = false;
                                    };
                                    if($scope.finalOutboxData.status === 'c_comission_paid' && $rootScope.userType === 'creditor'){
                                        $scope.comissBorrowStatus = false;
                                        $scope.comissCreditStatus = true;
                                    };
                                    if($scope.finalOutboxData.status === 'processing'){
                                        $scope.comissBorrowStatus = false;
                                        $scope.comissCreditStatus = false;
                                    };
                                }
                            );
                        }else{
                            $scope.insteadMessagesSpinner = false;
                            $scope.appendCreateMes = true;
                        }
                    }
                }
            )
        };
        $scope.startBargain = function(bargainData){
            $scope.appendBargain = true;
            $scope.appendRejectMes = false;
            $scope.newBargainData = {
                currency: bargainData.currency,
                termType: bargainData.termType,
                bargain: bargainData.id
            };
            $scope.sendNewbargain = function(){
                $scope.insteadMessagesSpinner = true;
                BargainFactory.addInsteadMessage($scope.newBargainData).then(
                    function(data){
                        if(data.success){
                            $scope.insteadMessagesSpinner = false;
                            $scope.appendBargain = false;
                            BargainFactory.getInsteadBargain(bargainData.id).then(
                                function(data){
                                    $scope.insteadMessOutbox = data.messages;
                                }
                            );
                        }
                        if(data.success == false){
                            $scope.insteadMessagesSpinner = false;
                            $scope.bargainErrors = data.messages;
                        }
                    }
                )
            }
        };
        $scope.appendRejectMes = false;
        $scope.rejectMes = function(bargainData, $index){
            $scope.appendRejectMes = true;
            $scope.appendBargain = false;
            $scope.rejectMessages = ['Неуважушечка', 'Не по-братски пацык поступает', 'Впадлецо'];
            $scope.rejectMesData = {
                bargain: bargainData.id,
            };
            $scope.sendRejectMes = function(){
                $scope.insteadMessagesSpinner = true;
                BargainFactory.rejectMes($scope.rejectMesData).then(
                    function(data){
                        if(data.success){
                            $scope.outboxMessages[$index].status = 'rejected';
                            $scope.outboxMessages[$index].rejectedMessage = $scope.rejectMesData.message;
                            $scope.insteadMessagesSpinner = false;
                            $scope.appendRejectMes = false;
                            BargainFactory.getInsteadBargain(bargainData.id).then(
                                function(data){
                                    $scope.insteadMessInbox = data.messages;
                                }
                            );
                        }
                        if(data.success == false){
                            $scope.insteadMessagesSpinner = false;
                            $scope.bargainErrors = data.messages;
                        }
                    }
                )
            }
        };
        $scope.createMes = function(bargainData, $index){
            $scope.appendRejectMes = false;
            $scope.appendBargain = false;
            var createMesData = {
                message: bargainData.id,
            };
            $scope.insteadMessagesSpinner = true;
            BargainFactory.createBMes(createMesData).then(
                function(data){
                    if(data.success){
                        BargainFactory.getInsteadBargain(bargainData.bargain_id).then(
                            function(data){
                                $scope.insteadMessOutbox = data.messages;
                                $scope.statusDataOutbox = data.bargain;
                                var bargain_id = {
                                    bargain: data.bargain.id
                                };
                                BargainFactory.getSuccessStatus(bargain_id).then(
                                    function(status){
                                        $scope.finalOutboxData = status.deal;
                                        $scope.insteadMessagesSpinner = false;
                                        $scope.appendCreateMes = true;
                                        if($scope.finalOutboxData.status === 'new'){
                                            $scope.comissBorrowStatus = true;
                                            $scope.comissCreditStatus = true;
                                        };
                                        if($scope.finalOutboxData.status === 'b_comission_paid' && $rootScope.userType === 'borrower'){
                                            $scope.comissBorrowStatus = true;
                                            $scope.comissCreditStatus = false;
                                        };
                                        if($scope.finalOutboxData.status === 'c_comission_paid' && $rootScope.userType === 'creditor'){
                                            $scope.comissBorrowStatus = false;
                                            $scope.comissCreditStatus = true;
                                        };
                                        if($scope.finalOutboxData.status === 'processing'){
                                            $scope.comissBorrowStatus = false;
                                            $scope.comissCreditStatus = false;
                                        };
                                    }
                                );
                            }
                        );
                    }
                    if(data.success == false){
                        $scope.insteadMessagesSpinner = false;
                        $scope.bargainErrors = data.messages;
                    }
                }
            )
        }

});
