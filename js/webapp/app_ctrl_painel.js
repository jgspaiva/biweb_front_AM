angular.module('biwebApp').

controller('PainelController', [ 'FontesService', 'FontesCnpjService', 'PaineisService', 'PaineisCnpjService', 'Storage', '$scope', '$cookies', '$mdDialog', '$mdMedia', '$mdSidenav', function(FontesService, FontesCnpjService, PaineisService, PaineisCnpjService, Storage, $scope, $cookies, $mdDialog, $mdMedia, $mdSidenav){

    // Fontes de Dados
    $scope.fontes = [];

    $scope.fonte = {};

    var dataTable = null;
    $scope.filtros = [];
    self.graficos = [];
    $scope.charts = [];
    $scope.chartAtual = null;

    var carregaFontes = function(){
        $scope.fontes = FontesCnpjService.query({ cnpj: $cookies.get('cnpj') });
    };

    carregaFontes();

    // Menu de Paineis
    $scope.openRightMenu = function(){
        $mdSidenav('right').toggle();
    };

    var dash = null;
    var componenteCharts = [];
    var filters = [];

    var componenteAtual = null;

    // Dashboard
    // Cria um novo dashboard em branco
    $scope.newDashboard = function(evento){
        console.log('newDashboard');

        $scope.dashboardAtivo = {
            graficos: [],
            controladores: [],
            fonte: {}
        };

        dataTable = null;
        $scope.filtros = [];
        self.graficos = [];
        $scope.charts = [];
        $scope.chartAtual = null;

        $scope.showDialogFonte(evento);
    };

    // Salva o dashboard ativo
    $scope.saveDashboard = function(){
        console.log('saveDashboard');

        FontesService.get({ id: $scope.fonte._id }).$promise.
        then(
            function(response){
                var dados = getDadosNovo($scope.fonte.header, response.dados);

                console.log(JSON.stringify(dados));

                geraDashTeste(dados, componenteCharts, filters);
            });


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

        $scope.charts[$scope.charts.indexOf($scope.chartAtual)] = wrapper; // Atualiza o Chart no Array

        //componenteCharts.push({ componente: componenteAtual, chart: wrapper});

        wrapper.draw(document.getElementById(wrapper.containerId));
    }

    // Funções de Gráficos
    function desenhaGrafico(grafico_, dados_, tagId_) {
        var cols = [];
        var columns = [0];
        var i = 1;

        grafico_.dados.y.forEach(function(val){
            var aggreg = google.visualization.data.sum;

            if(val.totalizador == 'AVG') aggreg = google.visualization.data.avg;
            else if(val.totalizador == 'MAX') aggreg = google.visualization.data.max;
            else if(val.totalizador == 'MIN') aggreg = google.visualization.data.min;
            else if(val.totalizador == 'COUNT') aggreg = google.visualization.data.count;

            var reg = { 'column' : val.indice, 'aggregation' : aggreg, 'type' : val.tipo.toLowerCase() }

            cols.push(reg);

            columns.push(i);
            i++;
        });

        var grouped_dt = google.visualization.data.group(
                          dados_, [grafico_.dados.x.indice],
                          cols);

        var wrapper = new google.visualization.ChartWrapper(
            {
                chartType: grafico_.chartType,
                dataTable: grouped_dt,
                options: {'title': grafico_.titulo },
                containerId: 'vis_div_' + tagId_
            }
        );

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

    var getDadosNovo = function(header, dados){
        var saida = new google.visualization.DataTable();

        header.forEach(function(col){
            console.log('campo: ' + col.campo + ', tipo: ' + col.tipo);
            saida.addColumn(col.tipo.toLowerCase(), col.campo);
        });

        var rows = [];

        dados.forEach(function(dado){
            var row = [];

            header.forEach(function(col){
                if(String(dado[col.campo]).split('/').length == 3){
                    var data = String(dado[col.campo]).split('/');

                    row.push(new Date(data[2], data[1], data[0]));
                }
                else row.push(dado[col.campo]);
            });

            rows.push(row);
        });

        saida.addRows(rows);

        console.log('Number of rows: ' + saida.getNumberOfRows());
        console.log('Number of columns: ' + saida.getNumberOfColumns());

        return saida;
    };

    var geraDashTeste = function(dataTable, // Fonte de dados
                                  cCharts,  // Array de charts
                                  filters
                                 )
    {
        dash = new google.visualization.Dashboard(document.getElementById("dash_teste"));

        google.visualization.events.addOneTimeListener(dash, 'ready', function() {
        //redraw the barchart with grouped data
        //console.log("redraw grouped");

            console.log("Componentes: " + cCharts.length);

            cCharts.forEach(function(componenteChart, indice){
                var componente = componenteChart.componente;
                var chart = componenteChart.chart;

                console.log("->" + chart.toJSON());

                var cols = [];
                var columns = [0];
                var i = 1;

                componente.dados.y.forEach(function(val){
                    var aggreg = google.visualization.data.sum;

                    console.log("Totalizador: " + val.totalizador);

                    if(val.totalizador == 'AVG') aggreg = google.visualization.data.avg;
                    else if(val.totalizador == 'MAX') aggreg = google.visualization.data.max;
                    else if(val.totalizador == 'MIN') aggreg = google.visualization.data.min;
                    else if(val.totalizador == 'COUNT') aggreg = google.visualization.data.count;

                    console.log('Aggregation: ' + aggreg);

                    var reg = { 'column' : val.indice, 'aggregation' : aggreg, 'type' : val.tipo.toLowerCase() }

                    cols.push(reg);

                    console.log('Reg = ' + JSON.stringify(reg));

                    columns.push(i);
                    i++;
                });

                var grouped_dt = google.visualization.data.group(
                          dash.getDataTable(), [componente.dados.x.indice],
                          cols);

                console.log('Gouped = ' + grouped_dt.toString());

                console.log('columns: ' + columns.toString());

                chart.setView({ 'columns' : columns });
                chart.setDataTable(grouped_dt);
                chart.setContainerId('chart_teste_' + indice);

                console.log('Esse: ' + chart.toJSON());

                chart.draw();
            });

        });

        var charts = [];

        cCharts.forEach(function(cc){
            charts.push(cc.chart);
        });

        console.log('1 @ GeraDash');

        dash.bind(filters, charts);

        console.log('2 @ GeraDash');

        dash.draw(dataTable);

        console.log('3 @ GeraDash');
    };

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

                    var tagId = self.graficos.length;

                    self.graficos.push(grafico);

                    var wrapper = desenhaGrafico(grafico, dataTable, tagId);
                    $scope.chartAtual = wrapper;
                    $scope.charts.push($scope.chartAtual);

                    $scope.loadEditor($scope.chartAtual);
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

                FontesService.get({ id: $scope.fonte._id }).$promise.
                then(function(response){
                    dataTable = getDadosNovo(fonte.header, response.dados);
                });
            },
            function() {
                // Cancelado
                console.log('Cancelado');
            }
        );
    };

    $scope.showDialogControlador = function(evento) {
        var useFullScreen = $mdMedia('xs');

        $mdDialog.show({
            controller: DialogFilterController,
            templateUrl: 'templates/add_filter_dialog.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: evento,
            clickOutsideToClose: false,
            bindToController: true,
            locals: { fonte: $scope.fonte },
            fullscreen: useFullScreen
        }).
        then(
            function(filtro) {
                $scope.filtros.push(filtro);
            },
            function() {
                // Cancelado
                console.log('Cancelado');
            }
        );
    };



}]);
