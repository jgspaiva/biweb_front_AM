angular.module('biwebApp', ['ngRoute', 'ngResource'])

// Router
	.config(function($routeProvider){

		$routeProvider
			.when('/usuarios', {
				templateUrl: 'partials/usuarios.html',
				controller: 'UsuariosController as usrCtrl'
			})
			.when('/clientes', {
				templateUrl: 'partials/clientes.html',
				controller: 'ClientesController as cliCtrl'
			})
            .when('/planos', {
				templateUrl: 'partials/planos.html',
				controller: 'PlanosController as plaCtrl'
			})
            .when('/painel', {
				templateUrl: 'partials/painel.html',
				controller: 'PainelController as pnlCtrl'
			})
			.otherwise({
				template: '<h1>Bem-vindo ao PWBI Web</h1>'
			});
	})

// Services
    .service('Storage', function () {
        var token = '';

		var usuario = {
            _id: ''
        };

        return {
			// Metodos para token
            getToken: function () {
                return token;
            },
            setToken: function(value) {
                token = value;
            },

			// Metodos para usuario
			getUsuario: function(){
				return usuario;
			},
			setUsuario: function(user){
				usuario = user;
			}
        };
    })

// Factory
	.factory('AutenticaService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3100/api/autentica');
	}])
	.factory('UsuariosService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3100/api/usuarios/:id', null,
			{
				'update' : { method: 'PUT' }
			});
	}])
    .factory('UsuariosClienteService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3100/api/usuarios/cliente/:id');
	}])
    .factory('UsuariosAutorizaService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3100/api/usuarios/autoriza/:id', null,
			{
				'update' : { method: 'PUT' }
			});
	}])
	.factory('ClientesService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3100/api/clientes/:id', null,
			{
				'update' : { method: 'PUT' }
			});
	}])
    .factory('PlanosService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3100/api/planos/:id', null,
			{
				'update' : { method: 'PUT' }
			});
	}])
	.factory('ResourceInterceptor', ['Storage', '$rootScope', '$q', function(Storage, $rootScope, $q){
		return {
			request: function(config){
				config.headers['x-access-token'] = Storage.getToken();
                config.headers['usuario_id'] = Storage.getUsuario()._id;

				return config;
			},
			requestError: function(rejection){
                $rootScope.$broadcast('fail');

				alert('Falha ao enviar.');

				return $q.reject(rejection);
			},
			response: function(response){
                $rootScope.$broadcast('done');

				return response;
			},
			responseError: function(rejection){
                $rootScope.$broadcast('fail');

				alert('O servidor retornou uma falha.');

				return $q.reject(rejection);
			}
		};
	}])
	.config(['$httpProvider', function($httpProvider){
		$httpProvider.interceptors.push('ResourceInterceptor');
	}])

// Diretivas

    .directive('guarda', ['$location', 'Storage', function($location, Storage){
        return {
            restrict: 'AE',
            scope: {
                guardaUsuario: '=',
                guardaVerbo: '@'
            },
            link: function($scope, $element, $attrs){
                var usuario = $scope.guardaUsuario;
                var verbo = $scope.guardaVerbo;
                var cadastro = $location.path().replace(/\W/g, '');

                var esconder = function(usuario_id){
                    var saida = false;

                    if(Storage.getUsuario()._id == usuario_id) saida = true;

                    return saida;
                };

                var exibir = function(verbo_, cadastro_){
                    var saida = false;

                    Storage.getUsuario().permissoes.forEach(function(permissao){
                        if(permissao.cadastro == cadastro_){
                            permissao.verbos.forEach(function(v){
                                if(v == verbo_) saida = true;
                            });
                        }
                    });

                    return saida;
                };

                if(exibir(verbo, cadastro) && !esconder(usuario._id)) $element.css("visibility", "visible");
                else $element.css("display", "none");
            }

        };

    }])

    .directive('buttonSpinner',['$location', 'Storage', function($location, Storage){
        return {
            restrict: 'E',
            scope: {
                action: '&',
                verbo: '@',
                titulo: '@',
                show: '&?',
                disabled: '&?',
                secure: '@?',
                perfil: '@?',
                size: '@?'
            },
            templateUrl: 'componentes/button_spinner.html',
            link: function($scope, $element, $attrs){
                var processing = false;

                $scope.classeVerbo = function(){
                    var classe = {
                        button : "btn btn-primary",
                        spinner: "ajax-loader",
                        icone: "glyphicon glyphicon-plus-sign"
                    };

                    var verbo = $scope.verbo;

                    if(verbo == 'GET') {
                        classe.button = "btn btn-default";
                        classe.icone = "glyphicon glyphicon-list";
                    }
                    else if(verbo == 'POST') {
                        classe.button = "btn btn-success";
                        classe.icone = "glyphicon glyphicon-send";
                    }
                    else if(verbo == 'PUT') {
                        classe.button = "btn btn-info";
                        classe.icone = "glyphicon glyphicon-edit";
                    }
                    else if(verbo == 'DELETE'){
                        classe.button = "btn btn-danger";
                        classe.icone = "glyphicon glyphicon-remove-sign";
                    }

                    if($attrs.size) {
                        classe.button = classe.button + " btn-" + $scope.size;

                        if(($scope.size == 'sm') || ($scope.size == 'xs')) classe.spinner = "ajax-loader-sm";
                    }

                    return classe;
                };

                $scope.$on('done', function(){
                    processing = false;
                });

                $scope.$on('fail', function(){
                    processing = false;
                });

                $scope.isProcessing = function(){
                    return processing;
                };

                $scope.isDisabled = function(){
                    var saida = processing;
                    var cadastro = $location.path().replace(/\W/g, '');
                    var verbo = $scope.verbo;

                    if($attrs.disabled) saida = saida || ($scope.disabled());

                    if($attrs.secure) {
                        if($scope.secure == "true") saida = saida || (!exibir(verbo, cadastro));
                    }

                    return saida;
                };

                $scope.clique = function(){
                    processing = true;

                    $scope.action();
                };

                $scope.intraShow = function(){
                    var saida = true;

                    if($attrs.show) saida = $scope.show();

                    if($attrs.perfil && (Storage.getUsuario().perfil != $scope.perfil)) saida = false;

                    return saida;
                };

                var exibir = function(verbo, cadastro){
                    var saida = false;

                    Storage.getUsuario().permissoes.forEach(function(permissao){
                        if(permissao.cadastro == cadastro){
                            permissao.verbos.forEach(function(v){
                                if(v == verbo) saida = true;
                            });
                        }
                    });

                    return saida;
                };
            }
        };
    }])

    .directive('list', ['Storage', function(Storage){
        return {
            restrict: 'E',
            scope: {
                source: '=',
                subset: '@'
            },
            templateUrl: 'componentes/list.html',
            link: function($scope, $element, $attrs){

            }
        };
    }])

// Controllers
	.controller('MainController', ['AutenticaService', 'Storage', function(AutenticaService, Storage){
		var self = this;

		self.isLogado = false;

		self.user = { username : "", password : "" };

		self.usuario = { nome: 'Convidado' };

		self.logon = function(){
			AutenticaService.save(self.user, function(response){
				//alert(response.message);

				if(response.success) {
					Storage.setToken(response.token);
					Storage.setUsuario(response.usuario);

					self.usuario = response.usuario;

					self.isLogado = true;
				}
			});
		};
	}])
	.controller('UsuariosController', ['Storage', 'UsuariosService','UsuariosClienteService', 'ClientesService', 'UsuariosAutorizaService', function(Storage, UsuariosService, UsuariosClienteService, ClientesService, UsuariosAutorizaService){
		var self = this;

        var usuarioLogado = Storage.getUsuario();

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

        self.lista = [];

		self.carregar = function(){
            if(self.isLogadoMaster()){
                self.lista = UsuariosClienteService.query({ id: usuarioLogado.cliente });
            }
            else if(self.isLogadoAdmin()) {
                self.lista = UsuariosService.query();
            }

            return self.lista;
		};

		self.carregar(); // Inicializa a lista

		self.enviar = function(){
            self.usuario.permissoes = permissoes(self.usuario.perfil);

			if(!editado) {
				self.usuario.password = self.usuario.username;

                if(self.isLogadoAdmin()) {
                    self.usuario.cliente = self.clienteAtual;
                    if(self.isBasico()) self.usuario.autorizado = false;
                }
                else if(self.isLogadoMaster()) self.usuario.cliente = usuarioLogado.cliente;

				UsuariosService.save(self.usuario, function(response){
						self.limpaUsuario();
						self.carregar();
					});
			}
			else{
				UsuariosService.update({ id: self.usuario._id }, self.usuario, function(response){
						self.limpaUsuario();
						self.carregar();

						$('#modalForm').modal('hide');
					});
			}
		};

        var editado = false;

		self.editar = function(usr){
			editado = true;

			self.usuario = usr;

            self.clienteAtual = usr.cliente._id;
		};

		self.remover = function(usr){
			if(confirm('Deseja remover este usuário?')){
				UsuariosService.remove({ id: usr._id }, function(response){
					//alert(response.message);
					self.carregar();
				});
			}
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
                    { cadastro: 'painel', nome: 'Painel', verbos: [ 'GET', 'POST', 'PUT', 'DELETE' ] }
				];
			}
			else if(perfil === 'facilitador'){
				saida = [
					{ cadastro: 'painel', nome: 'Painel', verbos: [ 'GET', 'POST', 'PUT', 'DELETE' ] }
				];
			}
			else if(perfil === 'master'){
				saida = [
					{ cadastro: 'usuarios', nome: 'Usuários', verbos: [ 'GET', 'POST', 'PUT', 'DELETE' ] },
                    { cadastro: 'painel', nome: 'Painel', verbos: [ 'GET', 'POST', 'PUT', 'DELETE' ] }
				];
			}
            else if(perfil === 'basico'){
				saida = [
					{ cadastro: 'painel', nome: 'Painel', verbos: [ 'GET', 'POST', 'PUT', 'DELETE' ] }
				];
			}
            else if(perfil === 'visual'){
				saida = [
					{ cadastro: 'painel', nome: 'Painel', verbos: [ 'GET' ] }
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

        self.isCliente = function(){
            var saida = false;

            saida = (self.isBasico() || self.isMaster() || self.isVisual());

            if(!saida) if(self.usuario.hasOwnProperty('cliente')) delete self.usuario['cliente'];

            return saida;
        };

        self.listaClientes = [];

        var carregarClientes = function(){
            return self.listaClientes = ClientesService.query();
        };

        carregarClientes();

        self.autorizar = function(usr){
            usr.autorizado = true;

            UsuariosAutorizaService.update({ id: usr._id}, usr).$promise
            .then(
                function(res){
                    self.carregar();
                },
                function(error){
                    alert(error);
                });
        };
	}])
	.controller('ClientesController', ['ClientesService', 'PlanosService', function(ClientesService, PlanosService){
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
            self.cliente.plano = self.planoAtual;

			if(!editado){
				ClientesService.save(self.cliente).$promise
                    .then(
                        function(response){
                            self.limpaCliente();

                            carregar();
                        },
                        function(error){
                            alert('Ocorreu um erro ao salvar o cliente');
                        }
                );
			}
			else{
				ClientesService.update({ id: self.cliente._id }, self.cliente).$promise
                    .then(
                        function(response){
                            self.limpaCliente();

                            carregar();

                            $('#modalForm').modal('hide');
                        },
                        function(error){
                            alert('Erro ao atualizar o cliente');

                        }
                    );
			}
		};

		self.editar = function(cli){
			editado = true;

			self.cliente = cli;
            self.planoAtual = cli.plano._id;
		};

		self.remover = function(cli){
			if(confirm('Deseja remover este cliente?')){
				ClientesService.remove({ id: cli._id }).$promise
                    .then(
                        function(response){
                            alert(response.message);
                            carregar();
                        },
                        function(error){
                            alert('Erro ao remover cliente');
                        }
                );
			}
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
	}])
    .controller('PlanosController', ['PlanosService', function(PlanosService){
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
            if(editado){
                PlanosService.update({ id: self.plano._id }, self.plano).$promise
                .then(
                    function(res){
                        editado = false;

                        alert(res.message);

                        self.limpaPlano();

                        $('#modalForm').modal('hide');
                    },
                    function(error){
                        alert('Erro ao atualizar');
                    }
                );
            }
            else {
                PlanosService.save(self.plano).$promise
                .then(
                    function(res){
                        alert(res.message);

                        carregar();

                        self.limpaPlano();
                    },
                    function(error){
                        alert('Erro ao salvar');
                    }
                );
            }
        };

        self.remover = function(plano){
            if(confirm('Deseja realmente excluir este plano?')){
                PlanosService.remove({ id: plano._id }).$promise
                .then(
                    function(res){
                        alert(res.message);

                        carregar();
                    },
                    function(error){
                        alert('Erro ao excluir');
                    }
                );
            }
        };

        self.editar = function(plano){
            self.plano = plano;
            editado = true;
        };

    }])

    .controller('PainelController', [function(){
        // Controller de Painel
    }]);
