angular.module('biwebApp', ['ngRoute', 'ngResource', 'ngCookies', 'ngMaterial', 'ngSanitize', 'dx'])

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
    // Constantes
    .constant('apiUrl', 'http://localhost:3100')

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
	.factory('AutenticaService', ['$resource', 'apiUrl', function($resource, apiUrl){
		return $resource(apiUrl + '/api/autentica');
	}])
	.factory('UsuariosService', ['$resource', 'apiUrl', function($resource, apiUrl){
		return $resource(apiUrl + '/api/usuarios/:id', null,
			{
				'update' : { method: 'PUT' }
			});
	}])
    .factory('UsuariosResetService', ['$resource', 'apiUrl', function($resource, apiUrl){
		return $resource(apiUrl + '/api/usuarios/reset/:id', null,
			{
				'update' : { method: 'PUT' }
			});
	}])
    .factory('UsuariosNovaSenhaService', ['$resource', 'apiUrl', function($resource, apiUrl){
		return $resource(apiUrl + '/api/usuarios/novasenha/:id', null,
			{
				'update' : { method: 'PUT' }
			});
	}])
    .factory('UsuariosClienteService', ['$resource', 'apiUrl', function($resource, apiUrl){
		return $resource(apiUrl + '/api/usuarios/cliente/:id');
	}])
    .factory('UsuariosClienteCnpjService', ['$resource', 'apiUrl', function($resource, apiUrl){
		return $resource(apiUrl + '/api/usuarios/cliente/cnpj/:cnpj');
	}])
    .factory('UsuariosAutorizaService', ['$resource', 'apiUrl', function($resource, apiUrl){
		return $resource(apiUrl + '/api/usuarios/autoriza/:id', null,
			{
				'update' : { method: 'PUT' }
			});
	}])
	.factory('ClientesService', ['$resource', 'apiUrl', function($resource, apiUrl){
		return $resource(apiUrl + '/api/clientes/:id', null,
			{
				'update' : { method: 'PUT' }
			});
	}])
    .factory('PlanosService', ['$resource', 'apiUrl', function($resource, apiUrl){
		return $resource(apiUrl + '/api/planos/:id', null,
			{
				'update' : { method: 'PUT' }
			});
	}])
    .factory('ReportsIdService', ['$resource', 'apiUrl', function($resource, apiUrl){
		return $resource(apiUrl + '/api/relatorios/:id', null,
			{
				'update' : { method: 'PUT' }
			});
	}])
    .factory('ReportsService', ['$resource', 'apiUrl', function($resource, apiUrl){
		return $resource(apiUrl + '/api/relatorios/cnpj/:cnpj', null,
			{
				'update' : { method: 'PUT' }
			});
	}])
    .factory('ReportsUsuarioService', ['$resource', 'apiUrl', function($resource, apiUrl){
		return $resource(apiUrl + '/api/relatorios/cnpj/:cnpj/usuario/:usuario', null,
			{
				'update' : { method: 'PUT' }
			});
	}])
    .factory('ReportsVisualizadoService', ['$resource', 'apiUrl', function($resource, apiUrl){
		return $resource(apiUrl + '/api/relatorios/visualizado/:id/usuario/:usuario', null,
			{
				'update' : { method: 'PUT' }
			});
	}])
    .factory('FontesService', ['$resource', 'apiUrl', function($resource, apiUrl){
		return $resource(apiUrl + '/api/fontes/:id');
	}])
    .factory('FontesCnpjService', ['$resource', 'apiUrl', function($resource, apiUrl){
		return $resource(apiUrl + '/api/fontes/cnpj/:cnpj');
	}])
    .factory('PaineisService', ['$resource', 'apiUrl', function($resource, apiUrl){
		return $resource(apiUrl + '/api/paineis/:id', null,
        {
            'update' : { method : 'PUT' }

        });
	}])
    .factory('PaineisCnpjService', ['$resource', 'apiUrl', function($resource, apiUrl){
		return $resource(apiUrl + '/api/paineis/cnpj/:cnpj');
	}])
	.factory('ResourceInterceptor', ['$cookies', '$q', '$rootScope', function($cookies, $q, $rootScope){
		return {
			request: function(config){
				config.headers['x-access-token'] = $cookies.get('token');
                config.headers['usuario_id'] = $cookies.get('usuario_id');

                $rootScope.$broadcast('start', { data: 'req'});

				return config;
			},
			requestError: function(rejection){
                alert('Falha ao enviar.');

				return $q.reject(rejection);
			},
			response: function(response){
                $rootScope.$broadcast('done');

                return response;
			},
			responseError: function(rejection){
                alert('O servidor retornou uma falha.');

                $rootScope.$broadcast('fail');

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
                titulo: '@',
                selecionavel: '=',
                action: '&?'
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

                $scope.clique = function(event, index){
                    if($attrs['action']){
                        $scope.action({ evento: event, objeto: $scope.items[index] } );
                    }
                };

                $scope.isString = function(type){
                    var saida = false;

                    if(type.toLowerCase() == 'string'){
                        saida = true;
                    }

                    return saida;
                };

                $scope.isNumber = function(type){
                    var saida = false;

                    if(type.toLowerCase() == 'number'){
                        saida = true;
                    }

                    return saida;
                };

                $scope.isDate = function(type){
                    var saida = false;

                    if(type.toLowerCase() == 'date'){
                        saida = true;
                    }

                    return saida;
                };

                $scope.isIcon = function(type){
                    var saida = false;

                    if(type.toLowerCase() == 'icon'){
                        saida = true;
                    }

                    return saida;
                };

                $scope.isBoolean = function(type){
                    var saida = false;

                    if(type.toLowerCase() == 'boolean'){
                        saida = true;
                    }

                    return saida;
                };


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
	.controller('MainController', ['AutenticaService', 'UsuariosService', 'Storage', 'ClientesService', '$location', '$cookies', '$route', '$mdSidenav', '$scope', '$mdDialog', '$timeout', function(AutenticaService, UsuariosService, Storage, ClientesService, $location, $cookies, $route, $mdSidenav, $scope, $mdDialog, $timeout){
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
	}])
	.controller('UsuariosController', ['Storage', 'UsuariosService', 'UsuariosResetService', 'UsuariosClienteService', 'ClientesService', 'UsuariosAutorizaService', 'UsuariosClienteCnpjService', '$scope', '$cookies', '$mdDialog', '$mdMedia', function(Storage, UsuariosService, UsuariosResetService, UsuariosClienteService, ClientesService, UsuariosAutorizaService, UsuariosClienteCnpjService, $scope, $cookies, $mdDialog, $mdMedia){
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
                self.lista = UsuariosClienteService.query({ id: usuarioLogado.cliente._id });
            }
            else if(self.isLogadoAdmin()) {
                if($cookies.get('cliente_id') == undefined){
                    UsuariosService.query().$promise.then(function(response){
                        self.lista = response;

                        self.lista.forEach(function(usuario){
                            try{
                                usuario.clienteNome = usuario.cliente.nome_fantasia;
                            }
                            catch(exception){
                                usuario.clienteNome = "";
                            }
                        });
                    });
                }
                else{
                    self.lista = UsuariosClienteCnpjService.query({ cnpj: $cookies.get('cliente_id') });
                }

            }

            return self.lista;
		};

		self.carregar(); // Inicializa a lista

		/*self.enviar = function(){
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
		};*/


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
                        alert(response.message);
                    }
                },
                function(error){
                    alert("erro");
                });
        };

        $scope.$on('cliente', function(event, data){
            carregarClientes();
        });
	}])
	.controller('ClientesController', ['ClientesService', 'PlanosService', '$scope', '$mdDialog', '$mdMedia', '$rootScope', function(ClientesService, PlanosService, $scope, $mdDialog, $mdMedia, $rootScope){
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
	}])
    .controller('PlanosController', ['PlanosService', '$scope', '$mdDialog', '$mdMedia', '$rootScope', function(PlanosService, $scope, $mdDialog, $mdMedia, $rootScope){
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

    }])

    .controller('PainelController', [ 'FontesService', 'FontesCnpjService', 'PaineisService', 'PaineisCnpjService', 'Storage', '$scope', '$cookies', function(FontesService, FontesCnpjService, PaineisService, PaineisCnpjService, Storage, $scope, $cookies){
        // Controller de Painel
        var self = this;

        self.fontes = [];
        self.fonteAtual = {};

        var graficoEscolhido = {};

        var editado = false;

        self.carregarFontes = function(){
            if($cookies.get('cnpj') != undefined && $cookies.get('cnpj') != "") self.fontes = FontesCnpjService.query({ cnpj: $cookies.get('cnpj') });
        };

        self.carregarFontes();

        self.lista = [];

        self.carregarPaineis = function(){
            if($cookies.get('cnpj') != undefined && $cookies.get('cnpj') != "") self.lista = PaineisCnpjService.query({ cnpj: $cookies.get('cnpj') });
        };

        self.carregarPaineis();

        self.novoPainel = function(){
            self.painel = {
                cnpj: $cookies.get('cnpj'),
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
    .controller('ReportsController', ['ClientesService','ReportsService','ReportsUsuarioService', 'ReportsVisualizadoService', 'ReportsIdService', 'UsuariosService', 'UsuariosClienteCnpjService', 'Storage', '$cookies', '$scope', '$mdDialog', '$mdMedia', function(ClientesService, ReportsService, ReportsUsuarioService, ReportsVisualizadoService, ReportsIdService, UsuariosService, UsuariosClienteCnpjService, Storage, $cookies, $scope, $mdDialog, $mdMedia){
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
                if($cookies.get('cliente_id') == undefined){
                    //carrega todos

                    self.usuarios = UsuariosService.query();
                }
                else{
                    // carrega pelo cnpj da navbar

                    self.usuarios = UsuariosClienteCnpjService.query({ cnpj: $cookies.get('cliente_id') });
                }
            }
            else if(self.isMaster()){
                // carrega pelo cnpj do master

                self.usuarios = UsuariosClienteCnpjService.query({ cnpj: Storage.getUsuario().cliente.cnpj });
            }
        };

        self.carregaUsuarios();

        self.insereIcones = function(lista){
            lista.forEach(function(item){
                if(self.isHtml(item)){
                    item.html = true;
                    item.image = false;
                    item.icone = 'view_comfy';
                }
                else if(self.isImage(item)){
                    item.html = false;
                    item.image = true;
                    item.icone = 'pie_chart';
                }
            });
        };

        self.carregarReports = function(){
            if(self.isAdmin()){
                if($cookies.get('cliente_id') != undefined){
                    if(self.usuarioId == undefined){
                        ReportsService.query({ cnpj: $cookies.get('cliente_id') }).$promise
                        .then(
                            function(res){
                                self.listaReports = res;

                                self.insereIcones(self.listaReports);
                            },
                            function(error){});
                    }
                    else{
                        ReportsUsuarioService.query({ cnpj: $cookies.get('cliente_id'), usuario: self.usuarioId }).$promise
                        .then(
                            function(res){
                                self.listaReports = res;

                                self.insereIcones(self.listaReports);
                            },
                            function(error){});
                    }
                }

            }
            else if(self.isMaster()){
                if(self.usuarioId == undefined){
                    ReportsService.query({ cnpj: Storage.getUsuario().cliente.cnpj }).$promise
                        .then(
                            function(res){
                                self.listaReports = res;

                                self.insereIcones(self.listaReports);
                            },
                            function(error){});
                }
                else{
                    ReportsUsuarioService.query({ cnpj: Storage.getUsuario().cliente.cnpj, usuario: self.usuarioId }).$promise
                        .then(
                            function(res){
                                self.listaReports = res;

                                self.insereIcones(self.listaReports);
                            },
                            function(error){});
                }
            }
            else{
                ReportsUsuarioService.query({ cnpj: Storage.getUsuario().cliente.cnpj, usuario: Storage.getUsuario().username }).$promise
                        .then(
                            function(res){
                                self.listaReports = res;

                                self.insereIcones(self.listaReports);
                            },
                            function(error){});
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

        $scope.showDialog = function(ev, report) {
            ReportsIdService.get({ id: report._id }).$promise
            .then(
                function(response){
                    return $mdDialog.show({
                        controller: DialogReportController,
                        templateUrl: 'templates/view_report_dialog.tmpl.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        bindToController: true,
                        locals: { report: response },
                        clickOutsideToClose: false
                    });
                },
                function(error){}
            ).
            then(
                function(objeto) {
                    alert(objeto);
                },
                function() {
                    $scope.status = 'You cancelled the dialog.';
                });


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
