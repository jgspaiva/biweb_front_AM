function DialogClienteController($scope, $mdDialog, planos, cliente) {
    $scope.planos = planos;

    if(!((cliente === undefined) || (cliente === null))) {
        $scope.cliente = cliente;

        $scope.cliente.editado = true;

        try{
            if($scope.cliente.plano._id != undefined) {
                $scope.cliente.plano = $scope.cliente.plano._id;
            }
        }
        catch(exc){}
    }
    else{
        $scope.cliente = { editado: false };
    }

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

function DialogUsuarioController($scope, $mdDialog, clientes, perfilLogado, usuario){
    $scope.clientes = clientes;
    $scope.perfilLogado = perfilLogado;

    if(!((usuario === undefined) || (usuario === null))) {
        $scope.usuario = usuario;

        $scope.usuario.editado = true;

        try{
            if($scope.usuario.cliente._id != undefined) {
                $scope.usuario.cliente = $scope.usuario.cliente._id;
            }
        }
        catch(exc){}
    }
    else{
        $scope.usuario = { editado: false };
    }

    $scope.mudaCliente = function(){
        $scope.clientes.forEach(function(cliente){
            if($scope.usuario.cliente == cliente._id) $scope.usuario.clienteNome = cliente.nome_fantasia;
        });
    };

    $scope.mudaPerfil = function(){
        if($scope.isAdmin() || $scope.isFacilitador()){
            if($scope.usuario.hasOwnProperty('clienteNome')) delete $scope.usuario['clienteNome'];
        }
    };

    $scope.isLogadoAdmin = function(){
        var saida = false;

        if($scope.perfilLogado == 'admin') saida = true;

        return saida;
    };

    $scope.isLogadoMaster = function(){
        var saida = false;

        if($scope.perfilLogado == 'master') saida = true;

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

function DialogPlanoController($scope, $mdDialog, plano) {
    if(!((plano === undefined) || (plano === null))) {
        $scope.plano = plano;

        $scope.plano.editado = true;
    }
    else{
        $scope.plano = { editado: false };
    }

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

function DialogReportController($scope, $mdDialog, $sce, report) {
    $scope.report = report;

    $scope.isHtml = function(report){
        return (report.imagem.contentType.indexOf('html') != -1);
    };

    $scope.isImagem = function(report){
        return (report.imagem.contentType.indexOf('image') != -1);
    };

    $scope.html = function(report){
        var saida = "";

        if($scope.isHtml(report)) saida = decodeURIComponent(escape(atob($scope.report.imagem.data)));

        saida = saida.replace("body { margin: 8px; }", "");

        return $sce.trustAsHtml(saida);
    };

    $scope.html_code = $scope.html($scope.report);

    $scope.imagem = function(report){
        var saida = '';

        if($scope.isImagem(report)) saida = 'data:' + report.imagem.contentType + ';base64,' + report.imagem.data;
        else if($scope.isHtml(report)) saida = 'imagens/painel.jpg';

        return saida;
    };

    $scope.save = function(){};

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

function DialogSenhaController($scope, $mdDialog) {
    $scope.novasenha = '';
    $scope.repetesenha = '';

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

function DialogFonteController($scope, $mdDialog, fontes, componente){
    $scope.fontes = fontes;

    if(!((componente === undefined) || (componente === null))) {
        $scope.componente = componente;

        $scope.componente.editado = true;
    }
    else{
        $scope.componente = {
            editado: false,
            chartType: 'Table',
            fonte: {
                id: '',
                x: '',
                y: []
            }
        };
    }

    $scope.y = {};

    $scope.mudaFonte = function(index){
        $scope.fonteAtual = $scope.fontes[index];
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

    $scope.addValor = function(){
        $scope.y.tipo = 'number';
        $scope.componente.fonte.y.push($scope.y);

        $scope.y = {};
    };

}
