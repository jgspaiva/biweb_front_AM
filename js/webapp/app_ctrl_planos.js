angular.module('biwebApp').
controller('PlanosController', ['PlanosService', '$scope', '$mdDialog', '$mdMedia', '$rootScope', function(PlanosService, $scope, $mdDialog, $mdMedia, $rootScope){
        var self = this;

        self.lista = [];

        var carregar = function(){
            return self.lista = PlanosService.query();
        };

        carregar();

        self.limpaPlano = function(){
            self.plano = {};
        };

        self.limpaPlano();

        var editado = false;

        self.enviar = function(){
            var processo = Math.floor((Math.random() * 1000) + 1);

            if(editado){
                PlanosService.update({ id: self.plano._id }, self.plano).$promise
                .then(
                    function(res){
                        editado = false;

                        self.limpaPlano();

                        $scope.$broadcast('done', { processo: processo });

                        $('#modalForm').modal('hide');
                    },
                    function(error){
                        alert('Erro ao atualizar');

                        $scope.$broadcast('fail', { processo: processo });
                    }
                );
            }
            else {
                PlanosService.save(self.plano).$promise
                .then(
                    function(res){
                        self.limpaPlano();

                        $scope.$broadcast('done', { processo: processo });

                        carregar();
                    },
                    function(error){
                        alert('Erro ao salvar');

                        $scope.$broadcast('fail', { processo: processo });
                    }
                );
            }

            return processo;
        };

        self.remover = function(plano){
            var processo = Math.floor((Math.random() * 1000) + 1);

			if(confirm('Deseja realmente excluir este plano?')){
                PlanosService.remove({ id: plano._id }).$promise
                    .then(
                    function(response){
                        $scope.$broadcast('done', { processo: processo });
                        self.lista.splice(self.lista.indexOf(plano), 1);
                    },
                    function(error){
                        $scope.$broadcast('fail', { processo: processo });
                    });
			}

            return processo;
		};

        self.removerChecked = function(){
            self.lista.forEach(function(plano){
                if(plano.check) {
                    PlanosService.remove({ id: plano._id }).$promise
                    .then(
                        function(response){
                            self.lista.splice(self.lista.indexOf(plano), 1);
                        },
                        function(error){});
                }
            });
        };

        self.editar = function(plano){
            self.plano = plano;
            editado = true;
        };

        $scope.isClearCheck = function(){
            var saida = true;

            self.lista.forEach(function(pla){
                saida = saida && !(pla.check);
            });

            return saida;
        };

        $scope.showConfirm = function(ev){
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Quer realmente excluir os planos selecionados?')
                .textContent('Esta operação é irreversível. Todos os dados referentes serão perdidos.')
                .ariaLabel('Exclusão')
                .targetEvent(ev)
                .ok('Excluir')
                .cancel('Cancelar');
            $mdDialog.show(confirm).then(
                function() {
                    $rootScope.$broadcast('plano', { operacao: 'remove' });

                    self.removerChecked();
                },
                function() {

                });
        };

        $scope.showDialog = function(evento, objeto) {
            var useFullScreen = $mdMedia('xs');

            $mdDialog.show({
                controller: DialogPlanoController,
                templateUrl: 'templates/add_plano_dialog.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: evento,
                bindToController: true,
                locals: { plano: objeto },
                clickOutsideToClose:true,
                fullscreen: useFullScreen
            })
            .then(
                function(plano) {
                    if(plano.editado){
                        return PlanosService.update({ id: plano._id }, plano).$promise;
                    }
                    else{
                        self.lista.push(plano);

                        return PlanosService.save(plano).$promise;
                    }
                },
                function() {
                    // Cancelado
                })
            .then(
                function(response){
                    if(response != undefined){
                        $rootScope.$broadcast('plano', { operacao: 'add' });
                    }
                },
                function(error){
                    alert("erro");
                });
        };

    }]);
