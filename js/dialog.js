function DialogClienteController($scope, $mdDialog, planos) {
    $scope.planos = planos;

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };

    $scope.send = function(object){
        $mdDialog.hide(object);
    };
}
