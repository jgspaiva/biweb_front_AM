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

    $scope.loadEditor = function (){
        // Create the chart to edit.

        var wrapper = new google.visualization.ChartWrapper({
            'chartType':'ColumnChart',
            'dataTable': dados,
            'options': {'title':'População (milhões)', 'legend':'bottom' },
            'containerId': 'vis_div'
        });

        wrapper.draw();

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
        })
        .then(
            function(componente) {
                if(componente.editado) {
                    // Recebe componente editado
                }
                else {
                    // Recebe componente novo

                    $scope.painelAtual.componentes.push(componente);
                }
            },
            function() {
                    // Cancelado
            });
    };

}]);
