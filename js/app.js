angular.module('biwebApp', ['ngRoute', 'ngResource'])

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
	.factory('ResourceInterceptor', ['Storage', '$q', function(Storage, $q){
		return {
			request: function(config){
				config.headers['x-access-token'] = Storage.getToken();
                config.headers['usuario_id'] = Storage.getUsuario()._id;

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
	.controller('MainController', ['AutenticaService', 'Storage', '$location', function(AutenticaService, Storage, $location){
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

                    if(self.usuario.expirada) {
                        alert('ATENÇÃO: Sua senha expirou!');

                        $location.path('/senha');
                    }
				}
			});
		};

        self.logout = function(){
            if(confirm('Deseja realmente sair?')){
                self.isLogado = false;
                self.usuario = { nome: 'Convidado' };
                self.user = { username: '', password: '' };

                Storage.setToken('');
                Storage.setUsuario({ id: '' });

                $location.path('/');
            }
        };
	}])
	.controller('UsuariosController', ['Storage', 'UsuariosService', 'UsuariosResetService', 'UsuariosClienteService', 'ClientesService', 'UsuariosAutorizaService', '$scope', function(Storage, UsuariosService, UsuariosResetService, UsuariosClienteService, ClientesService, UsuariosAutorizaService, $scope){
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
                self.lista = UsuariosService.query();
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
                    { cadastro: 'reports', nome: 'Reports', verbos: [ 'GET', 'PUT' ] }
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
                    { cadastro: 'reports', nome: 'Reports', verbos: [ 'GET', 'PUT' ] }
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
	.controller('ClientesController', ['ClientesService', 'PlanosService', '$scope', function(ClientesService, PlanosService, $scope){
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

    .controller('PainelController', [function(){
        // Controller de Painel
    }])
    .controller('ReportsController', ['ClientesService','ReportsService','ReportsUsuarioService', 'ReportsVisualizadoService','Storage', function(ClientesService, ReportsService, ReportsUsuarioService, ReportsVisualizadoService, Storage){
        // Controller de Reports
        var self = this;

        self.isAdmin = function(){
            return (Storage.getUsuario().perfil == 'admin');
        };

        // Criterios de busca
        var username = Storage.getUsuario().username;
        self.cnpj = '';

        if(!self.isAdmin()) self.cnpj = Storage.getUsuario().cliente.cnpj;

        self.listaClientes = [];

        self.carregaClientes = function(){
            self.listaClientes = ClientesService.query();
        };

        if(self.isAdmin()) self.carregaClientes();

        // o relatorio clicado
        self.reportAtual = {};

        // Lista de Relatorios
        self.listaReports = [];

        self.carregarReports = function(){
            if(self.isAdmin()){
                self.listaReports = ReportsService.query({ cnpj: self.cnpj });
            }
            else{
                self.listaReports = ReportsUsuarioService.query({ cnpj: self.cnpj, usuario: username });
            }

        };

        if(!self.isAdmin())self.carregarReports();

        self.clicado = function(report){
            self.reportAtual = report;

            if(self.isNovo(report) && (!self.isAdmin())){
                ReportsVisualizadoService.update({ id: report._id, usuario: username }, {}).$promise
                    .then(
                    function(response){
                        for (i in report.visualizado){
                            if(report.visualizado[i].login == username) report.visualizado[i].valor = true;
                        }
                    },
                    function(erro){ }
                    );
            }

            $('#modalMaximo').modal('show');

            if(self.isHtml(report)){
                $('#frameHtml').contents().find('html').html(decodeURIComponent(escape(atob(report.imagem.data))));
            }
        };

        self.miniImagem = function(report){
            var saida = '';

            if(self.isImage(report)) saida = 'data:' + report.imagem.contentType + ';base64,' + report.imagem.data;
            else if(self.isHtml(report)) saida = 'imagens/html_type.jpg';

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

        self.mudaCliente = function(){
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

                        $location.path('/');
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


    }]);
