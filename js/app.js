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

		var conexoesAbertas = 0;

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
			},

			abreConexao: function(){
				conexoesAbertas++;
			},
			fechaConexao: function(){
				conexoesAbertas--;
			},
			getConexoesAbertas: function(){
				return conexoesAbertas;
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
	.factory('ResourceInterceptor', ['Storage', '$q', function(Storage, $q){
		return {
			request: function(config){
				config.headers['x-access-token'] = Storage.getToken();
                config.headers['usuario_id'] = Storage.getUsuario()._id;

				Storage.abreConexao();

				$('#spinner').show();

				return config;
			},
			requestError: function(rejection){
				Storage.fechaConexao();

				if(Storage.getConexoesAbertas() === 0) $('#spinner').hide();

				alert('Falha ao enviar.');

				return $q.reject(rejection);
			},
			response: function(response){
				Storage.fechaConexao();

				if(Storage.getConexoesAbertas() === 0) $('#spinner').hide();

				return response;
			},
			responseError: function(rejection){
				Storage.fechaConexao();

				if(Storage.getConexoesAbertas() === 0) $('#spinner').hide();

				alert('O servidor retornou uma falha.');

				return $q.reject(rejection);
			}
		};
	}])
	.config(['$httpProvider', function($httpProvider){
		$httpProvider.interceptors.push('ResourceInterceptor');
	}])

// Diretivas
    .directive('controle', ['$location', 'Storage', function($location, Storage){
        return {
            restrict: 'A',
            scope: {
                controleVerbo: '@'
            },
            link: function($scope, $element, $attrs){
                var verbo = $scope.controleVerbo;
                var cadastro = $location.path().replace(/\W/g, '');

                var visibilidade = function(verbo_,cadastro_){
                    var saida = 'hidden';

                    Storage.getUsuario().permissoes.forEach(function(permissao){
                        if(permissao.cadastro == cadastro_){
                            permissao.verbos.forEach(function(v){
                                if(v == verbo_) saida = 'visible';
                            });
                        }
                    });

                    return saida;
                };

                $element.css("visibility", visibilidade(verbo, cadastro));
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
	.controller('UsuariosController', ['UsuariosService','UsuariosClienteService', 'ClientesService', 'Storage', function(UsuariosService, UsuariosClienteService, ClientesService, Storage){
		var self = this;

		self.lista = [];

		self.carregar = function(){
			return self.lista = UsuariosService.query();
		};

		self.carregar(); // Inicializa a lista

		var editado = false;  // Quando o usuario edita objeto da lista
		var idUsuarioEditado = '';  // Id do objeto editado

		self.enviar = function(){
			if(!editado) {
				self.usuario.password = self.usuario.username;

				self.usuario.permissoes = permissoes(self.usuario.perfil);

				UsuariosService.save(self.usuario, function(response){
						//alert(response.message);

						self.limpaUsuario();
						self.carregar();
					});
			}
			else{
                self.usuario.permissoes = permissoes(self.usuario.perfil);

				UsuariosService.update({ id: idUsuarioEditado }, self.usuario, function(response){
						//alert(response.message);

						editado = false;
						self.limpaUsuario();
						self.carregar();

						$('#modalForm').modal('hide');
					});
			}
		};

		self.editar = function(usr){
			editado = true;

			idUsuarioEditado = usr._id;
			self.usuario = usr;
		};

		self.remover = function(id){
			if(confirm('Deseja remover este usuário?')){
				UsuariosService.remove({ id: id }, function(response){
					//alert(response.message);
					self.carregar();
				});
			}
		};

		self.isUsuarioLogado = function(id){
			return id === Storage.getUsuario()._id;
		};

		self.limpaUsuario = function(){
			self.usuario = {
				username: '',
				nome: '',
				password: '',
				telefone: '',
				email: '',
				perfil: '',
				admin: false,
				permissoes : [],
				_id: ''
			};

			editado = false;
		};

		var permissoes = function(perfil){
			var saida = [];

			if(perfil === 'admin'){
				saida = [
					{ cadastro: 'usuarios', nome: 'Usuários', verbos: [ 'GET', 'POST', 'PUT', 'DELETE' ] },
                    { cadastro: 'clientes', nome: 'Clientes', verbos: [ 'GET', 'POST', 'PUT', 'DELETE' ] },
                    { cadastro: 'planos', nome: 'Planos', verbos: [ 'GET', 'POST', 'PUT', 'DELETE' ] }
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

			return saida;
		};

        self.isMaster = function(){
            var saida = false;

            if(self.usuario.perfil == 'master') saida = true;
            else {
                if(self.usuario.hasOwnProperty('cliente')) delete self.usuario['cliente'];
                saida = false;
            }

            return saida;
        };

        self.listaClientes = [];

        var carregarClientes = function(){
            return self.listaClientes = ClientesService.query();
        };

        carregarClientes();
	}])
	.controller('ClientesController', ['ClientesService', 'Storage', function(ClientesService, Storage){
		var self = this;

		self.lista = [];

		var editado = false;
		var idEditado = '';

		self.carregar = function(){
			return self.lista = ClientesService.query();
		};

		self.carregar();

		self.limpaCliente = function(){
			self.cliente = {
				nome : '',
				username: '',
				data_nascimento: '',
				rg: '',
				cpf: '',
				peso: 0,
				altura: 0
			};

			editado = false;
		};

		self.enviar = function(){
			if(!editado){
				ClientesService.save(self.cliente, function(response){
					alert('Informe o codigo do Cliente: ' + response.id);

					self.limpaCliente();
					self.carregar();
				});
			}
			else{
				ClientesService.update({ id: idEditado }, self.cliente, function(response){
					editado = false;

					self.limpaCliente();
					self.carregar();

					$('#modalForm').modal('hide');
				});
			}
		};

		self.editar = function(cli){
			idEditado = cli._id;
			editado = true;

			self.cliente = cli;
		};

		self.remover = function(id){
			if(confirm('Deseja remover este cliente?')){
				ClientesService.remove({ id: id }, function(response){
					//alert(response.message);
					self.carregar();
				});
			}
		};
	}])
    .controller('PlanosController', ['PlanosService', function(PlanosService){


    }]);
