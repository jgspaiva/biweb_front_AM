angular.module('biwebApp').
controller('InicialController', ['Storage', function(Storage){
        var self = this;

        self.listaApps = Storage.getUsuario().permissoes;

    }]);
