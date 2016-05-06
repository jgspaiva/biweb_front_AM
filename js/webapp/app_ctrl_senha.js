angular.module('biwebApp').

controller('SenhaController', ['UsuariosNovaSenhaService', 'Storage', '$scope', '$location', '$mdDialog', '$mdMedia', '$mdToast', function(UsuariosNovaSenhaService, Storage, $scope, $location, $mdDialog, $mdMedia, $mdToast){
        // Controller de Senha

        var self = this;

        // Dialog da senha

        var useFullScreen = $mdMedia('xs');

        $mdDialog.show({
            controller: DialogSenhaController,
            templateUrl: 'templates/change_senha_dialog.tmpl.html',
            parent: angular.element(document.body),
            clickOutsideToClose:false,
            fullscreen: useFullScreen
        })
        .then(
            function(novasenha) {
                return UsuariosNovaSenhaService.update({ id: Storage.getUsuario()._id }, { password: novasenha }).$promise;
            },
            function() {
                // Cancelado
                $location.path('/principal');
            })
        .then(
            function(response){
                // Retorno da API

                if(response != undefined){
                    Storage.getUsuario().expirada = false;

                    //$location.path('/principal');

                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('Senha alterada')
                        .position('bottom right')
                        .hideDelay(2000));
                }
            },
            function(error){
                alert("erro");
            });


    }]);
