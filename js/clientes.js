angular.module('biwebApp').
controller('ClientesController', ['ClientesService', 'PlanosService', '$scope', '$mdDialog', '$mdMedia', '$rootScope', function(ClientesService, PlanosService, $scope, $mdDialog, $mdMedia, $rootScope){
		var self = this;

		self.lista = [];

        self.listaPlanos = [];

        var carregarPlanos = function(){
            return self.listaPlanos = PlanosService.query();
        };

        carregarPlanos();

		var editado = false;

		var carregar = function(){
			return self.lista = ClientesService.query();
		};

		carregar();

		self.limpaCliente = function(){
			self.cliente = {
                telefones: []
            };

            self.planoAtual = {};

            editado = false;
		};

        self.limpaCliente();

		self.enviar = function(){
            var processo = Math.floor((Math.random() * 1000) + 1);

            self.cliente.plano = self.planoAtual;

			if(!editado){
				ClientesService.save(self.cliente).$promise
                    .then(
                        function(response){
                            self.limpaCliente();

                            carregar();

                            $scope.$broadcast('done', { processo: processo });
                        },
                        function(error){
                            alert('Ocorreu um erro ao salvar o cliente');

                            $scope.$broadcast('fail', { processo: processo });
                        }
                );
			}
			else{
				ClientesService.update({ id: self.cliente._id }, self.cliente).$promise
                    .then(
                        function(response){
                            self.limpaCliente();

                            carregar();

                            $scope.$broadcast('done', { processo: processo });

                            $('#modalForm').modal('hide');
                        },
                        function(error){
                            alert('Erro ao atualizar o cliente');

                            $scope.$broadcast('fail', { processo: processo });

                        }
                    );
			}

            return processo;
		};

		self.editar = function(cli){
			editado = true;

			self.cliente = cli;
            self.planoAtual = cli.plano._id;
		};

        self.remover = function(cli){
            var processo = Math.floor((Math.random() * 1000) + 1);

			if(confirm('Deseja remover este cliente?')){
				ClientesService.remove({ id: cli._id }).$promise
                    .then(
                    function(response){
                        $scope.$broadcast('done', { processo: processo });
                        self.lista.splice(self.lista.indexOf(cli), 1);
                    },
                    function(error){
                        $scope.$broadcast('fail', { processo: processo });
                    });
			}

            return processo;
		};

        self.removerChecked = function(){
            self.lista.forEach(function(cliente){
                if(cliente.check) {
                    ClientesService.remove({ id: cliente._id }).$promise
                    .then(
                        function(response){
                            self.lista.splice(self.lista.indexOf(cliente), 1);
                        },
                        function(error){});
                }
            });
        };

        self.telefone = {};

        var limpaTelefone = function(){
            self.telefone = {};
        };

        self.adicionarTelefone = function(){
            self.cliente.telefones.push(self.telefone);
            limpaTelefone();
        };

        self.removerTelefone = function(index){
            self.cliente.telefones.splice(index, 1);
        };

        $scope.showDialog = function(evento, objeto) {
            var useFullScreen = $mdMedia('xs');

            $mdDialog.show({
                controller: DialogClienteController,
                templateUrl: 'templates/add_cliente_dialog.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: evento,
                clickOutsideToClose: true,
                bindToController: true,
                locals: { planos: self.listaPlanos, cliente: objeto },
                fullscreen: useFullScreen
            })
            .then(
                function(cliente) {
                    if(cliente.editado) {
                        return ClientesService.update({ id: cliente._id }, cliente).$promise;
                    }
                    else {
                        self.lista.push(cliente);

                        return ClientesService.save(cliente).$promise;
                    }
                },
                function() {
                    // Cancelado
                })
            .then(
                function(response){
                    if(response != undefined) {
                        $rootScope.$broadcast('cliente', { operacao: 'add' });
                    }
                },
                function(error){
                    alert("erro");
                });
        };

        $scope.showConfirm = function(ev){
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Quer realmente excluir os clientes selecionados?')
                .textContent('Esta operação é irreversível. Todos os dados referentes serão perdidos.')
                .ariaLabel('Exclusão')
                .targetEvent(ev)
                .ok('Excluir')
                .cancel('Cancelar');
            $mdDialog.show(confirm).then(
                function() {
                    $rootScope.$broadcast('cliente', { operacao: 'remove' });

                    self.removerChecked();
                },
                function() {

                });
        };

        $scope.isClearCheck = function(){
            var saida = true;

            self.lista.forEach(function(cli){
                saida = saida && !(cli.check)
            });

            return saida;
        };

        $scope.$on('plano', function(event, data){
            carregarPlanos();
        });
	}]);
