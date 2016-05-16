angular.module('biwebApp').

controller('PainelController', [ 'FontesService', 'FontesCnpjService', 'PaineisService', 'PaineisCnpjService', 'Storage', '$scope', '$cookies', '$mdDialog', '$mdMedia', function(FontesService, FontesCnpjService, PaineisService, PaineisCnpjService, Storage, $scope, $cookies, $mdDialog, $mdMedia){

    $scope.fontes = [];

    $scope.painelAtual = {
        componentes: []
    };

    $scope.celulas = [];

    $scope.celulas.push({ id: 'Nova', empty: false });
    $scope.celulas.push({ id: 'Nova', empty: true });

    var carregaFontes = function(){
        $scope.fontes = FontesCnpjService.query({ cnpj: $cookies.get('cnpj') });
    };

    carregaFontes();

    // Chart Editor

    var chartEditor = null;

    var dados = [
        ['Brasil', 'Estados Unidos', 'Cuba'],
        [202, 300, 25]
    ];

    $scope.loadEditor = function (wrapper){
        chartEditor = new google.visualization.ChartEditor();
        google.visualization.events.addListener(chartEditor, 'ok', redrawChart);
        chartEditor.openDialog(wrapper, {});
    };

    // On "OK" save the chart to a <div> on the page.
    function redrawChart(){
        var wrapper = chartEditor.getChartWrapper();
        var options = wrapper.getOptions();

        // Define o tamanho do gráfico externamente
        options["width"] = 400;
        options["height"] = 400;

        wrapper.setOptions(options);

        wrapper.draw(document.getElementById('vis_div'));
    }

    $scope.classCelula = function(empty){
        var saida = "";

        if(empty) saida = "dashed";

        return saida;
    };

    $scope.showDialog = function(evento, objeto) {
        var useFullScreen = $mdMedia('xs');

        $mdDialog.show({
            controller: DialogFonteController,
            templateUrl: 'templates/choose_fonte_dialog.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: evento,
            clickOutsideToClose: false,
            bindToController: true,
            locals: { fontes: $scope.fontes, componente: objeto },
            fullscreen: useFullScreen
        }).
        then(
            function(componente) {
                if(componente.editado) {
                    // Recebe componente editado
                }
                else {
                    // Recebe componente novo

                    $scope.painelAtual.componentes.push(componente);

                    FontesService.get({ id: componente.fonte.id }).$promise.
                    then(function(response){
                        var dataTable = getDados(componente.fonte, response.dados);

                        var wrapper = desenhaGrafico(componente.chartType, componente.titulo, dataTable, 'vis_div');

                        $scope.loadEditor(wrapper);
                    });


                }
            },
            function() {
                    // Cancelado
            }
        );
    };

    // Funções de Gráficos
    function desenhaGrafico(tipo, titulo, dados, tagId) {
        var wrapper = new google.visualization.ChartWrapper({
        chartType: tipo,
        dataTable: dados,
        options: {'title': titulo },
        containerId: tagId });

        wrapper.draw();

        return wrapper;
    }

    function getDados(header, dados){
        var saida = new google.visualization.DataTable();
        var headerDataTable = [];

        var sqlConsulta = "";
        var sqlCampos = [];
        var argumento = "";

        saida.addColumn(header.x.tipo.toLowerCase(), header.x.campo);
        headerDataTable.push(header.x.campo);

        // Inclusão do argumento
        argumento = header.x.campo;
        sqlCampos.push(argumento);

        header.y.forEach(function(y_i){
            saida.addColumn(y_i.tipo.toLowerCase(), y_i.campo);
            headerDataTable.push(y_i.campo);

            // Inclusão de totalizadores de valores
            /*
            Reescrever assim:
            =================

            sqlCampos.push(y_i.totalizador + "([" + y_i.campo + "]) AS [" + y_i.campo + "]");

            */
            sqlCampos.push("SUM([" + y_i.campo + "]) AS [" + y_i.campo + "]");
        });

        // Consulta SQL (Alasql)
        sqlConsulta = "SELECT " + sqlCampos.join() + " FROM ? GROUP BY " + argumento;

        // Array obtido da consulta SQL
        var interArray = alasql(sqlConsulta, [dados]);

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

}]);
