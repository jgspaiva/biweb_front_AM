function DialogDadosController($scope, $mdDialog, fonte, componente){
    $scope.fonte = fonte;

    if(!((componente === undefined) || (componente === null))) {
        $scope.componente = componente;

        $scope.componente.editado = true;
    }
    else{
        $scope.componente = {
            editado: false,
            chartType: 'Table',
            dados: {
                x: {},
                y: []
            }
        };
    }

    $scope.y = {};

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

    var getIndiceFonte = function(campo){
        var saida = -1;

        $scope.fonte.forEach(function(col, indice){
            if(col.campo.toLowerCase() == campo.toLowerCase()) saida = indice;
        });

        return saida;
    };

    $scope.escolheArgumento = function(){
        var indice = getIndiceFonte($scope.componente.dados.x.campo)
        $scope.componente.dados.x.indice = indice;

        console.log('Indice arg: ' + indice)
    };

    $scope.addValor = function(){
        var indice = getIndiceFonte($scope.y.campo);

        $scope.y.tipo = 'number';
        $scope.y.indice = indice;
        $scope.componente.dados.y.push($scope.y);

        console.log('Indice ' + indice);

        $scope.y = {};
    };

}

function DialogFonteController($scope, $mdDialog, fontes){
    $scope.fontes = fontes;

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

function DialogFilterController($scope, $mdDialog, fonte){
    $scope.fonte = fonte;

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
