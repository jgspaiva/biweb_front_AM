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

function DialogUsuarioController($scope, $mdDialog, clientes, perfilLogado){
    $scope.clientes = clientes;
    $scope.perfilLogado = perfilLogado;

    $scope.usuario = {};

    $scope.isLogadoAdmin = function(){
        var saida = false;

        if($scope.perfilLogado == 'admin') saida = true;

        return saida;
    };

    $scope.isAdmin = function(){
        var saida = false;

        if($scope.usuario.perfil == 'admin') saida = true;

        return saida;
    };

    $scope.isMaster = function(){
        var saida = false;

        if($scope.usuario.perfil == 'master') saida = true;

        return saida;
    };

    $scope.isFacilitador = function(){
        var saida = false;

        if($scope.usuario.perfil == 'facilitador') saida = true;

        return saida;
    };

    $scope.isBasico = function(){
        var saida = false;

        if($scope.usuario.perfil == 'basico') saida = true;

        return saida;
    };

    $scope.isVisual = function(){
        var saida = false;

        if($scope.usuario.perfil == 'visual') saida = true;

        return saida;
    };

    $scope.isCliente = function(){
        return ($scope.isMaster() || $scope.isBasico() || $scope.isVisual());
    };

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
