angular.module('biwebApp').
controller('MainController', ['AutenticaService', 'UsuariosService', 'Storage', 'ClientesService', '$location', '$cookies', '$route', '$mdSidenav', '$scope', '$mdDialog', '$timeout', function(AutenticaService, UsuariosService, Storage, ClientesService, $location, $cookies, $route, $mdSidenav, $scope, $mdDialog, $timeout){
		var self = this;

        self.isAdmin = function(){
            var saida = false;

            try{
                saida = (Storage.getUsuario().perfil == 'admin');
            }
            catch(error){
                saida = false;
            }

            return saida;
        };

        self.clientes = [];

        self.carregaClientes = function(){
            return ClientesService.query().$promise;
        };

        self.isLogado = function(){
            var saida = false;

            if($cookies.get('logado') === 'true') saida = true;
            else saida = false;

            return saida;
        };

		if($cookies.get('logado') == undefined){
            $cookies.put('logado', 'false');
        }
        else if($cookies.get('usuario_id') != undefined){
            UsuariosService.get({ id: $cookies.get('usuario_id') }).$promise
            .then(
                function(response){
                    self.usuario = response;
                    Storage.setUsuario(self.usuario);

                    $route.reload();

                    if(self.isAdmin()) return self.carregaClientes();
                    else self.clientes = [];
                },
                function(error){
                    alert('Erro X');
                })
            .then(
                function(res){
                    self.clientes = res;

                    if($cookies.get('cliente_id') != undefined){
                        self.clienteId = $cookies.get('cliente_id');
                    }
                    else{
                        self.clienteId = 0;
                    }

                },
                function(err){
                    alert('Erro Y');

                    self.clientes = [];
                });
        }

		self.user = { username : "", password : "" };

		self.usuario = { nome: 'Convidado' };

        self.statusLogin = {
            mensagem: '',
            erro: false
        };

        self.dismissAlert = function(){
            self.statusLogin.erro = false;
        };

		self.logon = function(){
			AutenticaService.save(self.user).$promise
            .then(
            function(response){
				//alert(response.message);

				if(response.success) {
                    self.usuario = response.usuario;
                    $cookies.put('token', response.token);
                    $cookies.put('usuario_id', self.usuario._id);

                    try{
                        $cookies.put('cnpj', self.usuario.cliente.cnpj);
                    }
                    catch(error){
                        $cookies.put('cnpj', '');
                    }

                    Storage.setUsuario(self.usuario);

					$cookies.put('logado', 'true');

                    self.statusLogin.mensagem = '';
                    self.statusLogin.erro = false;

                    if(self.usuario.expirada) {
                        alert('ATENÇÃO: Sua senha expirou!');

                        $location.path('/senha');
                    }
                    else{
                        $location.path('/principal');
                    }

                    if(self.isAdmin()) return self.carregaClientes();
                    else self.clientes = [];
				}
                else{
                    self.statusLogin.mensagem = 'Verifique o e-mail / senha.';
                    self.statusLogin.erro = true;
                }
			},
            function(error){
                alert('Error')
            })
            .then(
                function(res){
                    self.clientes = res;
                },
                function(err){
                    self.clientes = [];
                }
            );
		};

        self.logout = function(){
            $cookies.put('logado', 'false');

            self.usuario = { nome: 'Convidado' };
            self.user = { username: '', password: '' };

            Storage.setUsuario({ id: '' });

            $cookies.remove('token');
            $cookies.remove('usuario_id');
            $cookies.remove('cliente_id');
            $cookies.remove('cnpj');

            delete self.clienteId;

            $location.path('/');
        };

        self.mudaCliente = function(){
            if(self.clienteId == null) {
                $cookies.remove('cliente_id');
            }
            else{
                $cookies.put('cliente_id', self.clienteId);
                $cookies.put('cnpj', self.clienteId);
            }

            $route.reload();
        };

        $scope.goto = function(rota){
            $mdSidenav('left').toggle();

            $timeout(function(){
                $location.path('/' + rota);
            }, 707);
        };

        self.openLeftMenu = function(){
            $mdSidenav('left').toggle();
        };

        self.icone = function(cadastro){
            var saida = "";

            switch(cadastro){
                case 'usuarios':
                    saida = 'person';
                    break;
                case 'clientes':
                    saida = 'store';
                    break;
                case 'planos':
                    saida = 'shopping_cart';
                    break;
                case 'reports':
                    saida = 'insert_chart';
                    break;
                case 'painel':
                    saida = 'dashboard';
                    break;
                case 'utilizacao':
                    saida = 'history';
                    break;
            }

            return saida;
        };

        $scope.$on('cliente', function(event, data){
            if(self.isAdmin()) {
                self.carregaClientes().then(
                    function(res){
                        self.clientes = res;
                    },
                    function(error){}
                );
            }
        });

        $scope.loads = 0;

        $scope.$on('start', function(event, data){
            $scope.loads++;
        });

        $scope.$on('done', function(event, data){
            $scope.loads--;
        });

        $scope.$on('fail', function(event, data){
            $scope.loads--;
        });
	}]);
