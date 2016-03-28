angular.module('biwebApp', ['ngRoute', 'ngResource', 'ngCookies', 'ngMaterial','dx'])

// Router
	.config(function($routeProvider){

		$routeProvider
			.when('/usuarios', {
				templateUrl: 'partials/usuarios.html',
				controller: 'UsuariosController as usrCtrl',
                resolve: {
                    deviate:function(Storage, $location){
                        if(Storage.getUsuario().expirada) $location.path('/senha');
                    }
                }
			})
            .when('/principal', {
				templateUrl: 'partials/principal.html',
				controller: 'InicialController as iniCtrl',
                resolve: {
                    deviate:function(Storage, $location){
                        if(Storage.getUsuario().expirada) $location.path('/senha');
                    }
                }
			})
			.when('/clientes', {
				templateUrl: 'partials/clientes.html',
				controller: 'ClientesController as cliCtrl',
                resolve: {
                    deviate:function(Storage, $location){
                        if(Storage.getUsuario().expirada) $location.path('/senha');
                    }
                }
			})
            .when('/planos', {
				templateUrl: 'partials/planos.html',
				controller: 'PlanosController as plaCtrl',
                resolve: {
                    deviate:function(Storage, $location){
                        if(Storage.getUsuario().expirada) $location.path('/senha');
                    }
                }
			})
            .when('/painel', {
				templateUrl: 'partials/painel.html',
				controller: 'PainelController as pnlCtrl',
                resolve: {
                    deviate:function(Storage, $location){
                        if(Storage.getUsuario().expirada) $location.path('/senha');
                    }
                }
			})
            .when('/reports', {
				templateUrl: 'partials/reports.html',
				controller: 'ReportsController as repCtrl',
                resolve: {
                    deviate:function(Storage, $location){
                        if(Storage.getUsuario().expirada) $location.path('/senha');
                    }
                }
			})
            .when('/senha', {
				templateUrl: 'partials/senha.html',
				controller: 'SenhaController as senCtrl'
			})
            .when('/utilizacao', {
				templateUrl: 'partials/utilizacao.html',
				controller: 'UtilizacaoController as utlCtrl',
                resolve: {
                    deviate:function(Storage, $location){
                        if(Storage.getUsuario().expirada) $location.path('/senha');
                    }
                }
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
    .factory('UsuariosResetService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3100/api/usuarios/reset/:id', null,
			{
				'update' : { method: 'PUT' }
			});
	}])
    .factory('UsuariosNovaSenhaService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3100/api/usuarios/novasenha/:id', null,
			{
				'update' : { method: 'PUT' }
			});
	}])
    .factory('UsuariosClienteService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3100/api/usuarios/cliente/:id');
	}])
    .factory('UsuariosClienteCnpjService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3100/api/usuarios/cliente/cnpj/:cnpj');
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
    .factory('ReportsIdService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3100/api/relatorios/:id', null,
			{
				'update' : { method: 'PUT' }
			});
	}])
    .factory('ReportsService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3100/api/relatorios/cnpj/:cnpj', null,
			{
				'update' : { method: 'PUT' }
			});
	}])
    .factory('ReportsUsuarioService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3100/api/relatorios/cnpj/:cnpj/usuario/:usuario', null,
			{
				'update' : { method: 'PUT' }
			});
	}])
    .factory('ReportsVisualizadoService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3100/api/relatorios/visualizado/:id/usuario/:usuario', null,
			{
				'update' : { method: 'PUT' }
			});
	}])
    .factory('FontesService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3100/api/fontes/:id');
	}])
    .factory('FontesCnpjService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3100/api/fontes/cnpj/:cnpj');
	}])
    .factory('PaineisService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3100/api/paineis/:id', null,
        {
            'update' : { method : 'PUT' }

        });
	}])
    .factory('PaineisCnpjService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3100/api/paineis/cnpj/:cnpj');
	}])
	.factory('ResourceInterceptor', ['$cookies', '$q', function($cookies, $q){
		return {
			request: function(config){
				config.headers['x-access-token'] = $cookies.token;
                config.headers['usuario_id'] = $cookies.usuario_id;

				return config;
			},
			requestError: function(rejection){
                alert('Falha ao enviar.');

				return $q.reject(rejection);
			},
			response: function(response){
                return response;
			},
			responseError: function(rejection){
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
    /*
    ==========================================================================
    Para utilizar esta diretiva (button-spinner) é necessário:
    a) action() deve retornar o número do processo;
    b) Devem ser lançados os eventos 'done' ou 'fail';
    c) Cada evento deve enviar o objeto 'data' contendo o número do processo.
    ==========================================================================
    */

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
                var processo = 0;

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

                $scope.$on('done', function(event, data){
                    if(data.processo == processo) processing = false;
                });

                $scope.$on('fail', function(event, data){
                    if(data.processo == -1) processing = false;
                    if(data.processo == processo) processing = false;
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

                    processo = $scope.action();
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

    .directive('mdDataTable', [ function(){
        return{
            restrict: 'E',
            scope: {
                items: '=',
                header: '=',
                titulo: '@'
            },
            templateUrl: 'componentes/md_table_template.html',
            link: function($scope, $element, $attrs){
                $scope.allCheck = false;

                $scope.toggleAllCheck = function(){
                    angular.forEach($scope.items, function(item, index){
                        item.check = $scope.allCheck;
                    });
                };

                $scope.$watchCollection("items", function(newValue, oldValue){
                    $scope.items = newValue;
                });
            }

        };
    }])

    .directive('buttonChart', ['$rootScope', function($rootScope){
        return{
            restrict: 'E',
            scope: {
                titulo: '@',
                tipo: '@',
                callback: '&',
                indice: '@'
            },
            templateUrl: 'componentes/button_chart.html',
            link: function($scope, $element, $attrs){
                $scope.clicado = false;

                $scope.$on('clicked', function(event, data){
                    if(data.button_indice == $scope.indice){
                        $scope.clicado = true;
                    }
                    else{
                        $scope.clicado = false;
                    }
                });

                $scope.icone = function(){
                    var saida = "";

                    switch($scope.tipo){
                        case "barras":
                            saida = "insert_chart";
                            break;
                        case "linhas":
                            saida = "show_chart";
                            break;
                        case "pizza":
                            saida = "pie_chart";
                            break;
                    }

                    return saida;
                };

                $scope.classe = function(){
                    var saida = "btn btn-default";

                    if($scope.clicado) saida = "btn ativo";

                    return saida;
                };

                $scope.clique = function(){
                    $rootScope.$broadcast('clicked', { button_indice: $scope.indice });

                    $scope.callback({ tipo: $scope.tipo });
                };
            },

        };
    }])

// Controllers
	.controller('MainController', ['AutenticaService', 'UsuariosService', 'Storage', 'ClientesService', '$location', '$cookies', '$route', '$mdSidenav', function(AutenticaService, UsuariosService, Storage, ClientesService, $location, $cookies, $route, $mdSidenav){
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

            if($cookies.logado === 'true') saida = true;
            else saida = false;

            return saida;
        };

		if($cookies.logado == undefined){
            $cookies.logado = 'false';
        }
        else if($cookies.usuario_id != undefined){
            UsuariosService.get({ id: $cookies.usuario_id }).$promise
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

                    if($cookies.cliente_id != undefined){
                        self.clienteId = $cookies.cliente_id;
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
                    $cookies.token = response.token;
                    $cookies.usuario_id = self.usuario._id;

                    try{
                        $cookies.cnpj = self.usuario.cliente.cnpj;
                    }
                    catch(error){
                        $cookies.cnpj = "";
                    }

                    Storage.setUsuario(self.usuario);

					$cookies.logado = 'true';

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
            if(confirm('Deseja realmente sair?')){
                $cookies.logado = 'false';

                self.usuario = { nome: 'Convidado' };
                self.user = { username: '', password: '' };

                Storage.setUsuario({ id: '' });

                delete $cookies.token;
                delete $cookies.usuario_id;
                delete $cookies.cliente_id;
                delete $cookies.cnpj;

                delete self.clienteId;

                $location.path('/');
            }
        };

        self.mudaCliente = function(){
            $cookies.cliente_id = self.clienteId;

            $cookies.cnpj = self.clienteId;

            $route.reload();
        };

        self.openLeftMenu = function(){
            $mdSidenav('left').toggle();
        };

	}])
	.controller('UsuariosController', ['Storage', 'UsuariosService', 'UsuariosResetService', 'UsuariosClienteService', 'ClientesService', 'UsuariosAutorizaService', 'UsuariosClienteCnpjService', '$scope', '$cookies', function(Storage, UsuariosService, UsuariosResetService, UsuariosClienteService, ClientesService, UsuariosAutorizaService, UsuariosClienteCnpjService, $scope, $cookies){
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
                self.lista = UsuariosClienteService.query({ id: usuarioLogado.cliente._id });
            }
            else if(self.isLogadoAdmin()) {
                if($cookies.cliente_id == undefined){
                    self.lista = UsuariosService.query();
                }
                else{
                    self.lista = UsuariosClienteCnpjService.query({ cnpj: $cookies.cliente_id });
                }

            }

            return self.lista;
		};

		self.carregar(); // Inicializa a lista

		self.enviar = function(){
            var processo = Math.floor((Math.random() * 1000) + 1);

            self.usuario.permissoes = permissoes(self.usuario.perfil);

            self.usuario.email = self.usuario.username;

            if(self.isLogadoAdmin()) self.usuario.cliente = self.clienteAtual;
            else if(self.isLogadoMaster()) self.usuario.cliente = usuarioLogado.cliente._id;

            if(self.isAdmin() || self.isFacilitador()){
                if(self.usuario.hasOwnProperty('cliente')) delete self.usuario['cliente'];
            }

			if(!editado) {
				self.usuario.password = "1234";

                if(self.isLogadoAdmin() && self.isBasico()) self.usuario.autorizado = false;

				UsuariosService.save(self.usuario).$promise
                    .then(function(response){
						self.limpaUsuario();
						self.carregar();

                        $scope.$broadcast('done', { processo: processo });
					}, function(error){
                        $scope.$broadcast('fail', { processo: processo });
                    });
			}
			else{
				UsuariosService.update({ id: self.usuario._id }, self.usuario).$promise
                    .then(function(response){
						self.limpaUsuario();
						self.carregar();

                        $scope.$broadcast('done', { processo: processo });

						$('#modalForm').modal('hide');
					}, function(error){
                        $scope.$broadcast('done', { processo: processo });
                    });
			}

            return processo;
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
	}])
	.controller('ClientesController', ['ClientesService', 'PlanosService', '$scope', '$mdDialog', function(ClientesService, PlanosService, $scope, $mdDialog){
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

        /* showDialog(ev) aqui */

        $scope.showDialog = function(ev) {
            $mdDialog.show({
                controller: DialogClienteController,
                templateUrl: 'templates/add_cliente_dialog.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                bindToController: true,
                locals: { planos: self.listaPlanos }
            })
            .then(
                function(cliente) {
                    self.lista.push(cliente);

                    return ClientesService.save(cliente).$promise;
                },
                function() {
                    $scope.status = 'You cancelled the dialog.';
                })
            .then(
                function(response){
                    self.carregar();
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
                .ok('Excluir assim mesmo')
                .cancel('Cancelar a operação');
            $mdDialog.show(confirm).then(
                function() {

                },
                function() {

                });
        };

        self.isClearCheck = function(){
            var saida = true;

            self.lista.forEach(function(cli){
                saida = saida && !(cli.check)
            });

            return saida;
        };
	}])
    .controller('PlanosController', ['PlanosService', '$scope', function(PlanosService, $scope){
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

        self.editar = function(plano){
            self.plano = plano;
            editado = true;
        };

    }])

    .controller('PainelController', [ 'FontesService', 'FontesCnpjService', 'PaineisService', 'PaineisCnpjService', 'Storage', '$scope', '$cookies', function(FontesService, FontesCnpjService, PaineisService, PaineisCnpjService, Storage, $scope, $cookies){
        // Controller de Painel
        var self = this;

        self.fontes = [];
        self.fonteAtual = {};

        var graficoEscolhido = {};

        var editado = false;

        self.carregarFontes = function(){
            if($cookies.cnpj != undefined && $cookies.cnpj != "") self.fontes = FontesCnpjService.query({ cnpj: $cookies.cnpj });
        };

        self.carregarFontes();

        self.lista = [];

        self.carregarPaineis = function(){
            if($cookies.cnpj != undefined && $cookies.cnpj != "") self.lista = PaineisCnpjService.query({ cnpj: $cookies.cnpj });
        };

        self.carregarPaineis();

        self.novoPainel = function(){
            self.painel = {
                cnpj: $cookies.cnpj,
                titulo: "",
                descricao: "",
                componentes: []
            };
        };

        self.enviar = function(){
            var processo = Math.floor((Math.random() * 1000) + 1);

            if(editado){
                PaineisService.update({ id: self.painel._id }, self.painel).$promise
                .then(
                    function(res){
                        editado = false;

                        self.novoPainel();

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
                PaineisService.save(self.painel).$promise
                .then(
                    function(res){
                        alert(res.message);

                        self.novoPainel();

                        $scope.$broadcast('done', { processo: processo });

                        self.carregarPaineis();
                    },
                    function(error){
                        alert('Erro ao salvar');

                        $scope.$broadcast('fail', { processo: processo });
                    }
                );
            }

            return processo;
        };

        self.editar = function(painel){
            editado = true;

            self.painel = painel;
        };

        self.remover = function(painel){
            var processo = Math.floor((Math.random() * 1000) + 1);

			if(confirm('Deseja realmente excluir este painel?')){
                PaineisService.remove({ id: painel._id }).$promise
                    .then(
                    function(response){
                        $scope.$broadcast('done', { processo: processo });
                        self.lista.splice(self.lista.indexOf(painel), 1);
                    },
                    function(error){
                        $scope.$broadcast('fail', { processo: processo });
                    });
			}
            else{
                $scope.$broadcast('fail', { processo: -1 });
            }

            return processo;
        };

        self.exibir = function(painel){
            self.painelVisao = painel;

            self.painelVisao.componentes.forEach(function(componente, i){
                FontesService.get({ id: componente.fonte.id }).$promise
                .then(
                    function(response){
                        var dxComponent = $("#chartContainer" + i)[componente.dx.tipo]({
                            dataSource: response.dados,
                            title: componente.titulo,
                            series: {
                                argumentField: componente.categoria,
                                valueField: componente.valor,
                                type: componente.dx.subtipo,
                                name: componente.categoria
                            }
                        });

                        dxComponent('instance').render();

                    },
                    function(error){
                        alert("Erro");
                    });
            });

            $("#modalMaximo").modal("show");
        };

        self.grafico = function(tipo){
            graficoEscolhido.tipo = tipo;

            switch(tipo){
                case "barras":
                    graficoEscolhido.dx = {
                        tipo: "dxChart",
                        subtipo: "bar"
                    };
                    break;
                case "linhas":
                    graficoEscolhido.dx = {
                        tipo: "dxChart"
                    };
                    break;
                case "pizza":
                    graficoEscolhido.dx = {
                        tipo: "dxPieChart"
                    };
                    break;
            }
        };

        self.adicionarComponente = function(){
            var componente = {
                titulo: self.componente.titulo,
                tipo: graficoEscolhido.tipo,
                dx: graficoEscolhido.dx,
                fonte: {
                    id: self.fonteAtual._id,
                    nome: self.fonteAtual.nome
                },
                categoria: self.categoriaAtual.campo,
                valor: self.valorAtual.campo
            };

            self.painel.componentes.push(componente);

            self.componente.titulo = "";
        };

        self.removerComponente = function(index){
            self.painel.componentes.splice(index, 1);
        };

        self.categorias = function(lista){
            var saida = [];

            lista.forEach(function(item){
                if(item.tipo != "Number") saida.push(item);
            });

            return saida;
        };

        self.valores = function(lista){
            var saida = [];

            lista.forEach(function(item){
                if(item.tipo == "Number") saida.push(item);
            });

            return saida;
        };
    }])
    .controller('ReportsController', ['ClientesService','ReportsService','ReportsUsuarioService', 'ReportsVisualizadoService', 'ReportsIdService', 'UsuariosService', 'UsuariosClienteCnpjService', 'Storage', '$cookies', function(ClientesService, ReportsService, ReportsUsuarioService, ReportsVisualizadoService, ReportsIdService, UsuariosService, UsuariosClienteCnpjService, Storage, $cookies){
        // Controller de Reports
        var self = this;

        self.isAdmin = function(){
            return (Storage.getUsuario().perfil == 'admin');
        };

        self.isMaster = function(){
            return (Storage.getUsuario().perfil == 'master');
        };

        // o relatorio clicado
        self.reportAtual = {};

        // Lista de Relatorios
        self.listaReports = [];

        self.usuarios = [];

        self.carregaUsuarios = function(){
            if(self.isAdmin()){
                if($cookies.cliente_id == undefined){
                    //carrega todos

                    self.usuarios = UsuariosService.query();
                }
                else{
                    // carrega pelo cnpj da navbar

                    self.usuarios = UsuariosClienteCnpjService.query({ cnpj: $cookies.cliente_id });
                }
            }
            else if(self.isMaster()){
                // carrega pelo cnpj do master

                self.usuarios = UsuariosClienteCnpjService.query({ cnpj: Storage.getUsuario().cliente.cnpj });
            }
        };

        self.carregaUsuarios();

        self.carregarReports = function(){
            if(self.isAdmin()){
                if($cookies.cliente_id != undefined){
                    if(self.usuarioId == undefined){
                        self.listaReports = ReportsService.query({ cnpj: $cookies.cliente_id });
                    }
                    else{
                        self.listaReports = ReportsUsuarioService.query(
                            {
                                cnpj: $cookies.cliente_id,
                                usuario: self.usuarioId
                            });
                    }
                }

            }
            else if(self.isMaster()){
                if(self.usuarioId == undefined){
                    self.listaReports = ReportsService.query({ cnpj: Storage.getUsuario().cliente.cnpj });
                }
                else{
                    self.listaReports = ReportsUsuarioService.query(
                    {
                        cnpj: Storage.getUsuario().cliente.cnpj,
                        usuario: self.usuarioId
                    });
                }
            }
            else{
                self.listaReports = ReportsUsuarioService.query(
                    {
                        cnpj: Storage.getUsuario().cliente.cnpj,
                        usuario: Storage.getUsuario().username
                    });
            }

        };

        self.carregarReports();

        self.clicado = function(report, spin){
            var spinner = '#spin'+spin;

            $(spinner).removeClass('ocultar').addClass('mostrar');

            ReportsIdService.get({ id: report._id }).$promise
            .then(
                function(response){
                    self.reportAtual = response;

                    $(spinner).removeClass('mostrar').addClass('ocultar');

                    $('#modalMaximo').modal('show');


                    if(self.isHtml(report)){            $('#frameHtml').contents().find('html').html(decodeURIComponent(escape(atob(self.reportAtual.imagem.data))));
                    }

                    if(self.isNovo(report) && (!self.isAdmin())){
                        return ReportsVisualizadoService.update({ id: report._id, usuario: username }, {}).$promise;
                    }
                },
                function(error){
                    $(spinner).removeClass('mostrar').addClass('ocultar');
                })
            .then(
                function(response){
                    for (i in report.visualizado){
                        if(report.visualizado[i].login == username) report.visualizado[i].valor = true;
                    }
                },
                function(error){

                });
        };

        self.miniImagem = function(report){
            var saida = '';

            if(self.isImage(report)) saida = 'imagens/painel.jpg';
            else if(self.isHtml(report)) saida = 'imagens/cubo.jpg';

            return saida;
        };

        self.imagem = function(report){
            var saida = '';

            if(self.isImage(report)) saida = 'data:' + report.imagem.contentType + ';base64,' + report.imagem.data;
            else if(self.isHtml(report)) saida = 'imagens/painel.jpg';

            return saida;
        };

        self.isImage = function(report){
            return (report.imagem.contentType.indexOf('image') != -1);
        };

        self.isHtml = function(report){
            return (report.imagem.contentType.indexOf('html') != -1);
        };

        self.isNovo = function(report){
            var saida = true;

            for (i in report.visualizado){
                if(report.visualizado[i].login == username) saida = !report.visualizado[i].valor;
            }

            return saida;
        };

        self.mudaUsuario = function(){
            self.carregarReports();
        };

    }])
    .controller('SenhaController', ['UsuariosNovaSenhaService', 'Storage', '$scope', '$location', function(UsuariosNovaSenhaService, Storage, $scope, $location){
        // Controller de Senha

        var self = this;

        self.usuario = {};

        self.enviar = function(){
            var processo = Math.floor((Math.random() * 1000) + 1);

            if(self.usuario.novasenha == self.usuario.confere){
                UsuariosNovaSenhaService.update({ id: Storage.getUsuario()._id },
                                                { password: self.usuario.novasenha }).$promise
                .then(
                    function(res){
                        alert(res.message);

                        Storage.getUsuario().expirada = false;

                        $scope.$broadcast('done', { processo: processo });

                        $location.path('/principal');
                    },
                    function(error){
                        alert('Erro ao atualizar');

                        $scope.$broadcast('fail', { processo: processo });
                    }
                );
            }
            else{
                alert('As senhas não conferem.');

                $scope.$broadcast('fail', { processo: -1 });
            }

            return processo;
        };


    }])
    .controller('InicialController', ['Storage', function(Storage){
        var self = this;

        self.listaApps = Storage.getUsuario().permissoes;

    }])
    .controller('UtilizacaoController', ['UsuariosClienteService', 'UsuariosService', '$scope', 'Storage', function(UsuariosClienteService, UsuariosService, $scope, Storage){
        var self = this;

        var usuarioLogado = Storage.getUsuario();

        self.isLogadoAdmin = function(){
            return (usuarioLogado.perfil == 'admin');
        };

        self.isLogadoMaster = function(){
            return (usuarioLogado.perfil == 'master');
        };

        var lista = [];

        var usuarios = [];

        var dataSource = {
            fields: [
                {
                    area:'row',
                    dataField: 'cliente',
                    dataType: 'string',
                    displayFolder:'Users'
                },
                {
                    area: 'row',
                    dataField: 'nome',
                    dataType: 'string',
                    displayFolder:'Users'
                },
                {
                    area: 'column',
                    dataField: 'ultimoAcesso',
                    groupInterval: 'year',
                    dataType: 'date',
                    displayFolder:'Date'
                },
                {
                    area: 'column',
                    dataField: 'ultimoAcesso',
                    groupInterval: 'month',
                    dataType: 'date',
                    displayFolder:'Date'
                },
                {
                    area: 'column',
                    dataField: 'ultimoAcesso',
                    groupInterval: 'day',
                    dataType: 'date',
                    displayFolder:'Date'
                },
                {
                    area: 'data',
                    dataField: 'qtAcesso',
                    dataType: 'number',
                    summaryType: 'sum',
                    caption: 'Qt Acessos',
                    displayFolder:'Log'
                }],

            retrieveFields: false
        };

        self.carregar = function(){
            if(self.isLogadoMaster()){
                UsuariosClienteService.query({ id: usuarioLogado.cliente._id }).$promise
                .then(
                    function(response){
                        lista = response;

                        lista.forEach(function(usr){
                            usuarios.push({
                                nome : usr.nome,
                                username : usr.username,
                                qtAcesso : usr.qtAcesso,
                                ultimoAcesso : usr.ultimoAcesso,
                                cliente : usr.cliente.razao_social
                            });
                        });

                        dataSource.store = usuarios;

                        $('#cuboUtil').dxPivotGrid('instance').option('dataSource', dataSource);
                        $('#cuboUtil').dxPivotGrid('instance').repaint();
                    },
                    function(error){
                        alert('Erro');
                    });
            }
            else if(self.isLogadoAdmin()) {
                UsuariosService.query().$promise
                .then(
                    function(response){
                        lista = response;

                        lista.forEach(function(usr){
                            var cliente = '';

                            if(usr.cliente != null) cliente = usr.cliente.razao_social;

                            usuarios.push({
                                nome : usr.nome,
                                username : usr.username,
                                qtAcesso : usr.qtAcesso,
                                ultimoAcesso : usr.ultimoAcesso,
                                cliente : cliente
                            });

                        });

                        dataSource.store = usuarios;

                        $('#cuboUtil').dxPivotGrid('instance').option('dataSource', dataSource);
                        $('#cuboUtil').dxPivotGrid('instance').repaint();
                    },
                    function(error){

                    });
            }
		};

		self.carregar();
    }]);
