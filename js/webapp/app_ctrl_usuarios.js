angular.module('biwebApp').
controller('UsuariosController', ['Storage', 'UsuariosService', 'UsuariosResetService', 'UsuariosClienteService', 'ClientesService', 'UsuariosAutorizaService', 'UsuariosClienteCnpjService', '$scope', '$cookies', '$mdDialog', '$mdMedia', function(Storage, UsuariosService, UsuariosResetService, UsuariosClienteService, ClientesService, UsuariosAutorizaService, UsuariosClienteCnpjService, $scope, $cookies, $mdDialog, $mdMedia){
		var self = this;

        var usuarioLogado = Storage.getUsuario();

        $scope.isOpen = true;

        self.isLogadoAdmin = function(){
            return (usuarioLogado.perfil == 'admin');
        };

        self.isLogadoMaster = function(){
            return (usuarioLogado.perfil == 'master');
        };

        self.isLogadoFacilitador = function(){
            return (usuarioLogado.perfil == 'facilitador');
        };

        self.isLogadoBasico = function(){
            return (usuarioLogado.perfil == 'basico');
        };

        self.isLogadoVisual = function(){
            return (usuarioLogado.perfil == 'visual');
        };

        self.header = function(){
            var saida = [
                { campo: 'username', headerName: 'E-mail', width: '40', type: 'String' },
                { campo: 'nome', headerName: 'Nome', width: '40', type: 'String' },
                { campo: 'telefone', headerName: 'Fone', width: '10', type: 'String' },
                { campo: 'perfil', headerName: 'Perfil', width: '10', type: 'String' }
            ];

            if(self.isLogadoAdmin()){
                saida = [
                    { campo: 'username', headerName: 'E-mail', width: '30', type: 'String' },
                    { campo: 'nome', headerName: 'Nome', width:'30', type: 'String' },
                    { campo: 'telefone', headerName: 'Fone', width: '10', type: 'String' },
                    { campo: 'perfil', headerName: 'Perfil', width: '10', type: 'String' },
                    { campo: 'clienteNome', headerName: 'Cliente', width: '20', type: 'String' }
                ];
            }
            else if(self.isLogadoMaster()){
                saida = [
                    { campo: 'username', headerName: 'E-mail', width: '40', type: 'String' },
                    { campo: 'nome', headerName: 'Nome', width: '30', type: 'String' },
                    { campo: 'telefone', headerName: 'Fone', width: '10', type: 'String' },
                    { campo: 'perfil', headerName: 'Perfil', width: '10', type: 'String' },
                    { campo: 'autorizado', headerName: 'Autorizado', width: '10', type: 'Boolean' }
                ];
            }

            return saida;
        };

        self.headerAtual = self.header();

        self.lista = [];

		self.carregar = function(){
            if(self.isLogadoMaster()){
                UsuariosClienteService.query({ id: usuarioLogado.cliente._id }).$promise
                .then(function(response){
                    self.lista = response;

                    var indexExcluir = -1;

                    self.lista.forEach(function(usuario, index){
                        if(usuario._id === usuarioLogado._id) indexExcluir = index;
                    });

                    self.lista.splice(indexExcluir, 1);
                });
            }
            else if(self.isLogadoAdmin()) {
                if($cookies.get('cliente_id') == undefined){
                    UsuariosService.query().$promise.then(function(response){
                        self.lista = response;

                        var indexExcluir = -1;

                        self.lista.forEach(function(usuario, index){
                            if(usuario._id === usuarioLogado._id) indexExcluir = index;

                            try{
                                usuario.clienteNome = usuario.cliente.nome_fantasia;
                            }
                            catch(exception){
                                usuario.clienteNome = "";
                            }
                        });

                        self.lista.splice(indexExcluir, 1);
                    });
                }
                else{
                    UsuariosClienteCnpjService.query({ cnpj: $cookies.get('cliente_id') }).$promise
                    .then(function(response){
                        self.lista = response;
                    });
                }

            }
		};

		self.carregar(); // Inicializa a lista

        var enviar = function(usr){
            usr.permissoes = permissoes(usr.perfil);

            usr.ativo = true;
            usr.autorizado = true;

            usr.email = usr.username;

            if(self.isLogadoMaster()) usr.cliente = usuarioLogado.cliente._id;

            if((usr.perfil == 'admin') || (usr.perfil == 'facilitador')){
                if(usr.hasOwnProperty('cliente')) delete usr['cliente'];
            }

            usr.password = "1234";

            if(self.isLogadoAdmin() && (usr.perfil == 'basico')) usr.autorizado = false;

            return UsuariosService.save(usr).$promise;
		};

        var atualizar = function(usr){
            usr.permissoes = permissoes(usr.perfil);

            usr.email = usr.username;

            if((usr.perfil == 'admin') || (usr.perfil == 'facilitador')){
                if(usr.hasOwnProperty('cliente')) delete usr['cliente'];
            }

            return UsuariosService.update({ id: usr._id }, usr).$promise;
        };

        var editado = false;

		self.editar = function(usr){
			editado = true;

			self.usuario = usr;

            self.clienteAtual = usr.cliente._id;
		};

        self.remover = function(usr){
            var processo = Math.floor((Math.random() * 1000) + 1);

			if(confirm('Deseja remover este usuário?')){
				UsuariosService.remove({ id: usr._id }).$promise
                    .then(
                    function(response){
                        $scope.$broadcast('done', { processo: processo });
                        self.lista.splice(self.lista.indexOf(usr), 1);
                    },
                    function(error){
                        $scope.$broadcast('fail', { processo: processo });
                    });
			}

            return processo;
		};

        self.removeChecked = function(){
            self.lista.forEach(function(usr){
                if(usr.check) {
                    UsuariosService.remove({ id: usr._id }).$promise
                    .then(
                        function(response){
                            self.lista.splice(self.lista.indexOf(usr), 1);
                        },
                        function(error){});
                }
            });
        };

		self.limpaUsuario = function(){
            self.usuario = {
                ativo: true,
                autorizado: true
            };

            if(self.isLogadoMaster()){
                self.usuario.perfil = 'basico';
            }

            self.clienteAtual = undefined;

			editado = false;
		};

		var permissoes = function(perfil){
			var saida = [];

			if(perfil === 'admin'){
				saida = [
					{ cadastro: 'usuarios', nome: 'Usuários', verbos: [ 'GET', 'POST', 'PUT', 'DELETE' ] },
                    { cadastro: 'clientes', nome: 'Clientes', verbos: [ 'GET', 'POST', 'PUT', 'DELETE' ] },
                    { cadastro: 'planos', nome: 'Planos', verbos: [ 'GET', 'POST', 'PUT', 'DELETE' ] },
                    { cadastro: 'painel', nome: 'Painel', verbos: [ 'GET', 'POST', 'PUT', 'DELETE' ] },
                    { cadastro: 'reports', nome: 'Reports', verbos: [ 'GET', 'PUT' ] },
                    { cadastro: 'utilizacao', nome: 'Utilização', verbos: [ 'GET' ] }
				];
			}
			else if(perfil === 'facilitador'){
				saida = [
					{ cadastro: 'painel', nome: 'Painel', verbos: [ 'GET', 'POST', 'PUT', 'DELETE' ] },
                    { cadastro: 'reports', nome: 'Reports', verbos: [ 'GET', 'PUT' ] }
				];
			}
			else if(perfil === 'master'){
				saida = [
					{ cadastro: 'usuarios', nome: 'Usuários', verbos: [ 'GET', 'POST', 'PUT', 'DELETE' ] },
                    { cadastro: 'painel', nome: 'Painel', verbos: [ 'GET', 'POST', 'PUT', 'DELETE' ] },
                    { cadastro: 'reports', nome: 'Reports', verbos: [ 'GET', 'PUT' ] },
                    { cadastro: 'utilizacao', nome: 'Utilização', verbos: [ 'GET' ] }
				];
			}
            else if(perfil === 'basico'){
				saida = [
					{ cadastro: 'painel', nome: 'Painel', verbos: [ 'GET', 'POST', 'PUT', 'DELETE' ] },
                    { cadastro: 'reports', nome: 'Reports', verbos: [ 'GET', 'PUT' ] }
				];
			}
            else if(perfil === 'visual'){
				saida = [
					{ cadastro: 'painel', nome: 'Painel', verbos: [ 'GET' ] },
                    { cadastro: 'reports', nome: 'Reports', verbos: [ 'GET', 'PUT' ] }
				];
			}

			return saida;
		};

        self.isMaster = function(){
            return (self.usuario.perfil == 'master');
        };

        self.isBasico = function(){
            return (self.usuario.perfil == 'basico');
        };

        self.isVisual = function(){
            return (self.usuario.perfil == 'visual');
        };

        self.isAdmin = function(){
            return (self.usuario.perfil == 'admin');
        };

        self.isFacilitador = function(){
            return (self.usuario.perfil == 'facilitador');
        };

        self.isCliente = function(){
            var saida = false;

            saida = (self.isBasico() || self.isMaster() || self.isVisual());

            return saida;
        };

        self.listaClientes = [];

        var carregarClientes = function(){
            return self.listaClientes = ClientesService.query();
        };

        carregarClientes();

        self.autorizar = function(usr){
            var processo = Math.floor((Math.random() * 1000) + 1);

            usr.autorizado = true;

            UsuariosAutorizaService.update({ id: usr._id}, usr).$promise
            .then(
                function(res){
                    $scope.$broadcast('done', { processo: processo });

                    self.carregar();
                },
                function(error){
                    $scope.$broadcast('fail', { processo: processo });

                    alert(error);
                });

            return processo;
        };

        self.authChecked = function(){
            self.lista.forEach(function(usr){
                if(usr.check) {
                    usr.autorizado = true;

                    UsuariosAutorizaService.update({ id: usr._id}, usr).$promise
                    .then(
                        function(response){},
                        function(error){});
                }
            });
        };

        self.resetSenha = function(usr){
            var processo = Math.floor((Math.random() * 1000) + 1);

            UsuariosResetService.update({ id: usr._id}, { password: '1234' }).$promise
            .then(
                function(res){
                    alert(res.message);

                    $scope.$broadcast('done', { processo: processo });
                },
                function(error){
                    alert('Erro ao tentar alterar a senha.');

                    $scope.$broadcast('fail', { processo: processo });
                });

            return processo;
        };

        self.renewChecked = function(){
            self.lista.forEach(function(usr){
                if(usr.check){
                    UsuariosResetService.update({ id: usr._id}, { password: '1234' });
                }
            });
        };

        $scope.isClearCheck = function(){
            var saida = true;

            self.lista.forEach(function(usr){
                saida = saida && !(usr.check);
            });

            return saida;
        };

        $scope.isClearCheckUnauth = function(){
            var saida = true;

            self.lista.forEach(function(usr){
                saida = saida && (!(usr.check) || (usr.autorizado));
            });

            return saida;
        };

        $scope.showConfirmRemove = function(ev){
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Quer realmente excluir os usuários selecionados?')
                .textContent('Esta operação é irreversível. Todos os dados referentes serão perdidos.')
                .ariaLabel('Exclusão')
                .targetEvent(ev)
                .ok('Excluir')
                .cancel('Cancelar');
            $mdDialog.show(confirm).then(
                function() {
                    self.removeChecked();
                },
                function() {

                });
        };

        $scope.showConfirmAuth = function(ev){
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Quer realmente autorizar os usuários selecionados?')
                .textContent('Os usuários selecionados poderão ter acesso a dados, relatórios e paineis de sua empresa.')
                .ariaLabel('Autorizar')
                .targetEvent(ev)
                .ok('Autorizar')
                .cancel('Cancelar');
            $mdDialog.show(confirm).then(
                function() {
                    self.authChecked();
                },
                function() {

                });
        };

        $scope.showConfirmRenew = function(ev){
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Quer realmente renovar a senha dos usuários selecionados?')
                .textContent('Os usuários selecionados voltarão às senhas padrão, contudo expiradas. Será exigida a mudança da senha no primeiro logon.')
                .ariaLabel('Renovar Senha')
                .targetEvent(ev)
                .ok('Restaurar')
                .cancel('Cancelar');
            $mdDialog.show(confirm).then(
                function() {
                    self.renewChecked();
                },
                function() {

                });
        };

        $scope.showDialog = function(evento, objeto) {
            var useFullScreen = $mdMedia('xs');

            $mdDialog.show({
                controller: DialogUsuarioController,
                templateUrl: 'templates/add_usuario_dialog.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: evento,
                clickOutsideToClose:true,
                bindToController: true,
                locals: { clientes: self.listaClientes, perfilLogado: usuarioLogado.perfil, usuario: objeto },
                fullscreen: useFullScreen
            })
            .then(
                function(usuario) {
                    if(usuario.editado){
                        return atualizar(usuario);
                    }
                    else{
                        self.lista.push(usuario);

                        return enviar(usuario);
                    }
                },
                function() {
                    // Cancelado
                })
            .then(
                function(response){
                    // Retorno da API

                    if(response != undefined){

                    }
                },
                function(error){
                    alert("erro");
                });
        };

        $scope.$on('cliente', function(event, data){
            carregarClientes();
        });
	}]);
