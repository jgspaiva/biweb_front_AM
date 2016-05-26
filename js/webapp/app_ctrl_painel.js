angular.module('biwebApp').

controller('PainelController', [ 'FontesService', 'FontesCnpjService', 'PaineisService', 'PaineisCnpjService', 'Storage', '$scope', '$cookies', '$mdDialog', '$mdMedia', '$mdSidenav', function(FontesService, FontesCnpjService, PaineisService, PaineisCnpjService, Storage, $scope, $cookies, $mdDialog, $mdMedia, $mdSidenav){

    // Fontes de Dados
    $scope.fontes = [];

    $scope.fonte = {};

    var carregaFontes = function(){
        $scope.fontes = FontesCnpjService.query({ cnpj: $cookies.get('cnpj') });
    };

    carregaFontes();

    // Menu de Paineis
    $scope.openRightMenu = function(){
        $mdSidenav('right').toggle();
    };

    // Dashboard
    // Cria um novo dashboard em branco
    $scope.newDashboard = function(evento){
        console.log('newDashboard');

        $scope.dashboardAtivo = {
            graficos: [],
            controladores: [],
            fonte: {}
        };

        $scope.showDialogFonte(evento);
    };

    // Salva o dashboard ativo
    $scope.saveDashboard = function(){
        console.log('saveDashboard');
    };

    // Abre o dashboard
    $scope.openDashboard = function(){
        console.log('openDashboard')
    };

    // Remove Dashboard
    $scope.removeDashboard = function(dashboard){
        console.log('removeDashboard');
    };


    // Funções para Google Charts
    // 1 - Chart Editor
    var chartEditor = null;

    $scope.loadEditor = function (wrapper){
        chartEditor = new google.visualization.ChartEditor();
        google.visualization.events.addListener(chartEditor, 'ok', redrawChart);
        chartEditor.openDialog(wrapper, {});
    };

    // 1.1 - Redraw Chart
    function redrawChart(){
        var wrapper = chartEditor.getChartWrapper();
        var options = wrapper.getOptions();

        // Define o tamanho do gráfico externamente
        options["width"] = 400;
        options["height"] = 400;

        wrapper.setOptions(options);

        wrapper.draw(document.getElementById(wrapper.containerId));
    }

    // Funções de Gráficos
    function desenhaGrafico(tipo, titulo, dados, tagId) {
        var wrapper = new google.visualization.ChartWrapper({
        chartType: tipo,
        dataTable: dados,
        options: {'title': titulo },
        containerId: 'vis_div_' + tagId });

        wrapper.draw();

        return wrapper;
    }

    // Prepara a fonte de dados
    // ANALISAR
    function getDados(header, dados){
        var saida = new google.visualization.DataTable();
        var headerDataTable = [];

        var sqlConsulta = "";
        var sqlCampos = [];
        var argumento = "";

        saida.addColumn(header.x.tipo.toLowerCase(), header.x.campo);
        headerDataTable.push(header.x.campo);

        console.log('1 @ getDados');

        // Inclusão do argumento
        argumento = header.x.campo;
        sqlCampos.push(argumento);

        console.log('2 @ getDados');

        header.y.forEach(function(y_i){
            saida.addColumn(y_i.tipo.toLowerCase(), y_i.campo);
            headerDataTable.push(y_i.campo);

            console.log('3 loop @ getDados');

            // Inclusão de totalizadores de valores

            sqlCampos.push(y_i.totalizador + "([" + y_i.campo + "]) AS [" + y_i.campo + "]");

            console.log('4 loop @ getDados');
        });

        // Consulta SQL (Alasql)
        sqlConsulta = "SELECT " + sqlCampos.join() + " FROM ? GROUP BY " + argumento;

        console.log('5 @ getDados');
        console.log(sqlConsulta);

        // Array obtido da consulta SQL
        var interArray = alasql(sqlConsulta, [dados]);

        console.log('6 @ getDados');

        var rows = [];

        interArray.forEach(function(dado){
            var row = [];

            headerDataTable.forEach(function(col){
                if(String(dado[col]).split('/').length == 3){
                    var data = String(dado[col]).split('/');

                    row.push(new Date(data[2], data[1], data[0]));
                }
                else row.push(dado[col]);
            });

            rows.push(row);
        });

        saida.addRows(rows);

        return saida;
    }

    $scope.showDialogDados = function(evento, objeto) {
        var useFullScreen = $mdMedia('xs');

        $mdDialog.show({
            controller: DialogDadosController,
            templateUrl: 'templates/choose_dados_dialog.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: evento,
            clickOutsideToClose: false,
            bindToController: true,
            locals: { fonte: $scope.fonte, componente: objeto },
            fullscreen: useFullScreen
        }).
        then(
            function(grafico) {
                if(grafico.editado) {
                    // Recebe os dados escolhidos
                    console.log('Dados atualizados');
                }
                else {
                    // Recebe grafico novo
                    console.log('Dados novos');
                    console.log($scope.fonte._id);

                    var tagId = $scope.dashboardAtivo.graficos.length;
                    $scope.dashboardAtivo.graficos.push(grafico);

                    FontesService.get({ id: $scope.fonte._id }).$promise.
                    then(function(response){
                        console.log(response.dados[0].QTD)
                        var dados = getDados(grafico.dados, response.dados);

                        var wrapper = desenhaGrafico(grafico.chartType, grafico.titulo, dados, tagId);

                        $scope.loadEditor(wrapper);

                        // var wrapper = desenhaGrafico(componente.chartType, componente.titulo, dataTable, 'vis_div');

                        // $scope.loadEditor(wrapper);
                    });
                }
            },
            function() {
                // Cancelado
                console.log('Cancelado');
            }
        );
    };

    $scope.showDialogFonte = function(evento) {
        var useFullScreen = $mdMedia('xs');

        $mdDialog.show({
            controller: DialogFonteController,
            templateUrl: 'templates/choose_fonte_dialog.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: evento,
            clickOutsideToClose: false,
            bindToController: true,
            locals: { fontes: $scope.fontes },
            fullscreen: useFullScreen
        }).
        then(
            function(fonte) {
                console.log('Fonte escolhida');
                $scope.fonte = fonte;
                $scope.openRightMenu();
            },
            function() {
                // Cancelado
                console.log('Cancelado');
            }
        );
    };



}]);
