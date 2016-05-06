angular.module('biwebApp').

controller('PainelController', [ 'FontesService', 'FontesCnpjService', 'PaineisService', 'PaineisCnpjService', 'Storage', '$scope', '$cookies', function(FontesService, FontesCnpjService, PaineisService, PaineisCnpjService, Storage, $scope, $cookies){

    $scope.fontes = [];

    $scope.painelAtual = {};

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
            'chartType':'Table',
            'dataTable': dados,
            'options': {'title':'População (milhões)', 'legend':'none'},
            'containerId': 'vis_div'
        });

        wrapper.draw();

        chartEditor = new google.visualization.ChartEditor();
        google.visualization.events.addListener(chartEditor, 'ok', redrawChart);
        chartEditor.openDialog(wrapper, {});
    };

    // On "OK" save the chart to a <div> on the page.
    function redrawChart(){
      chartEditor.getChartWrapper().draw(document.getElementById('vis_div'));
    }

    $scope.mudaDados = function(){
        dados = [
            ['Brasil', 'Estados Unidos', 'Cuba'],
            [220, 308, 25]
        ];
    };

    $scope.classCelula = function(empty){
        var saida = "";

        if(empty) saida = "dashed";

        return saida;
    };

}]);
