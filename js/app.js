angular.module('laclimaApp', ['ngRoute', 'ngResource'])

// Router
	.config(function($routeProvider){

		$routeProvider
            .when('/caixa', {
                templateUrl: 'partials/caixa.html',
                controller: 'CaixaController as cxaCtrl'
            })
			.when('/usuarios', {
				templateUrl: 'partials/usuarios.html',
				controller: 'UsuariosController as usrCtrl'
			})
			.when('/clientes', {
				templateUrl: 'partials/clientes.html',
				controller: 'ClientesController as cliCtrl'
			})
			.when('/exames', {
				templateUrl: 'partials/exames.html',
				controller: 'ExamesController as exaCtrl'
			})
			.when('/atendimentos', {
				templateUrl: 'partials/atendimentos.html',
				controller: 'AtendimentosController as ateCtrl'
			})
			.when('/resultados', {
				templateUrl: 'partials/resultados.html',
				controller: 'ResultadosController as resCtrl'
			})
			.when('/medicos', {
				templateUrl: 'partials/medicos.html',
				controller: 'MedicosController as medCtrl'
			})
			.otherwise({
				template: '<h1>Bem-vindo ao Sistema de Gestão do LACLIMA</h1>'
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
		return $resource('http://begyn.com.br:3000/api/autentica');
	}])
	.factory('UsuariosService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3000/api/usuarios/:id', null,
			{
				'update' : { method: 'PUT' }
			});
	}])
	.factory('ClientesService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3000/api/clientes/:id', null,
			{
				'update' : { method: 'PUT' }
			});
	}])
	.factory('ClientesNomeService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3000/api/clientes/nome/:nome');
	}])
	.factory('ClientesRgService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3000/api/clientes/rg/:rg');
	}])
    .factory('CaixaService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3000/api/caixa/:id', null,
			{
				'update' : { method: 'PUT' }
			});
	}])
	.factory('ExamesService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3000/api/exames/:id', null,
			{
				'update' : { method: 'PUT' }
			});
	}])
	.factory('ExamesNomeService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3000/api/exames/nome/:nome');
	}])
	.factory('AtendimentosService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3000/api/atendimentos/:id', null,
			{
				'update' : { method: 'PUT' }
			});
	}])
	.factory('ResultadosService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3000/api/resultados/:id', null,
			{
				'update' : { method: 'PUT' }
			});
	}])
    .factory('ResultadosClienteService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3000/api/resultados/cliente/:id');
	}])
	.factory('MedicosService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3000/api/medicos/:id', null,
			{
				'update' : { method: 'PUT' }
			});
	}])
	.factory('MedicosNomeService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3000/api/medicos/nome/:nome');
	}])
	.factory('MedicosCrmService', ['$resource', function($resource){
		return $resource('http://begyn.com.br:3000/api/medicos/crm/:crm');
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
	.controller('MainController', ['AutenticaService', 'UsuariosService', 'Storage', function(AutenticaService, UsuariosService, Storage){
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
    .controller('CaixaController', ['CaixaService','Storage', function(CaixaService, Storage){
        var self = this;

        self.caixa = {};

        self.carregar = function(){
            self.caixa = CaixaService.get({ id: 'CaixaSimples' });
        };

        self.carregar();

        self.limpaEntrada = function(){
            self.entrada = {};
        };

        self.enviar = function(){
            self.entrada.operacao = 'd';

            CaixaService.update({ id: 'CaixaSimples'}, self.entrada).$promise
            .then(function(response){
                alert(response.message);

                self.carregar();
                self.limpaEntrada();
                $('#modalForm').modal('hide');
            });

        };

        self.icone = function(operacao){
            var saida = 'down';

            if(operacao == 'c') saida = 'up';

            return saida;
        };

        // Retirada
        self.opcoes = [
            { id: 'OP01',
              descricao: 'Comissão',
              operacao: 'd' },
            { id: 'OP02',
              descricao: 'Material de Expediente',
              operacao: 'd' },
            { id: 'OP03',
              descricao: 'Pagamento de Conta',
              operacao: 'd' }];




    }])
	.controller('AtendimentosController', ['AtendimentosService', 'CaixaService','ClientesNomeService', 'ClientesService', 'ExamesNomeService', 'MedicosNomeService', 'Storage', function(AtendimentosService, CaixaService, ClientesNomeService, ClientesService, ExamesNomeService, MedicosNomeService, Storage){
		var self = this;
		// Lista de Atendimentos
		self.lista = [];

		// CLIENTES
		// Lista
		self.listaClientes = [];

		self.isClienteEscolhido = false; // Se o cliente ja foi escolhido
		self.isBusca = false;  // Se a busca esta fazendo busca

		// Funcao para des-escolher o cliente
		self.limpaClienteEscolhido = function(){
			self.clienteEscolhido = {
				_id: '',
				nome: '',
				data_nascimento: '',
				rg: '',
				cpf: '',
				peso: 0,
				altura: 0
			};

			self.isClienteEscolhido = false;
		};

		// Funcao para limpar os campos de inclusao de Cliente
		self.limpaCliente = function(){
			self.cliente = {
				nome: '',
				data_nascimento: '',
				rg: '',
				cpf: '',
				peso: 0,
				altura: 0
			};
		};

		// Configuracao inicial
		// Limpa o cliente no inicio
		self.limpaCliente();
		// Limpa o cliente escolhido
		self.limpaClienteEscolhido();

		// Funcao para buscar a lista de clientes a partir de parte do nome
		self.clienteSearch = function(){
			self.isBusca = true;

			return self.listaClientes = ClientesNomeService.query({ nome: self.cliente.nome });
		};

		// Funcao para selecionar o cliente dos resultados da busca
		self.escolherCliente = function(cli){
			self.clienteEscolhido = cli;

			self.isBusca = false;
			self.isClienteEscolhido = true;
			self.limpaCliente();
			self.listaClientes = [];
		};

		// Funcao para adicionar um novo cliente
		self.adicionarCliente = function(){
			return ClientesService.save(self.cliente, function(res){
				self.clienteEscolhido = self.cliente;
				self.clienteEscolhido._id = res._id;
                self.clienteEscolhido.id = res.id;

				self.isClienteEscolhido = true;
				self.limpaCliente();
			});
		};

		// EXAMES
		// Limpa a lista de exames selecionados
		self.examesEscolhidos = [];
		// Limpa a lista de exames buscados
		self.listaExames = [];

		// Indica se esta fazendo busca de exames
		self.isExameBusca = false;

		// Funcao para remover um exame escolhido da lista
		self.limpaExameEscolhido = function(id){
			self.examesEscolhidos.splice(id, 1);
		};

		// Limpa o campo de busca de exames
		self.exameNomeSearch = '';

		// Funcao de busca de exames
		self.exameSearch = function(){
			self.isExameBusca = true;

			return self.listaExames = ExamesNomeService.query({ nome: self.exameNomeSearch });
		};

		// Funcao para escolher o exame da lista
		self.escolherExame = function(exame){
			var exameIncidencia = { exame: '', incidencia: 0 };

			exameIncidencia.exame = exame;
			exameIncidencia.incidencia = 1;

			self.examesEscolhidos.push(exameIncidencia);
		};

		// Funcao para dizer se a lista de exames escolhidos tem algum elemento
		self.hasExameEscolhido = function(){
			var saida = false;

			if(self.examesEscolhidos.length > 0) saida = true;

			return saida;
		};

        self.valorTotal = function(){
            var saida = 0;

            self.examesEscolhidos.forEach(function(exaInd){
				saida += (exaInd.incidencia * exaInd.exame.preco);
            });

            return self.atendimento.pagamentoTotal = saida;
        };

        self.isPagamentoEntradaValido = function(){
            return ((self.atendimento.pagamentoEntrada >= self.valorTotal() / 2) && (self.atendimento.pagamentoEntrada <= self.valorTotal()));
        };

        self.valorQuitar = function(ate){
            var saida = 0;

            if(!ate.quitado) saida = ate.pagamentoTotal - ate.pagamentoEntrada;

            return saida;
        };

		// MEDICOS
		// Lista
		self.listaMedicos = [];

		self.isMedicoEscolhido = false; // Se o medico ja foi escolhido
		self.isMedicoBusca = false;  // Se a busca esta fazendo busca

		// Funcao para des-escolher o medico
		self.limpaMedicoEscolhido = function(){

			self.medicoEscolhido = {
				_id: '',
				nome: '',
				crm: '',
				uf: ''
			};

			self.isMedicoEscolhido = false;
		};

		// Configuracao inicial
		// Limpa o cliente escolhido
		self.limpaMedicoEscolhido();

		// Limpa o campo de busca de medicos
		self.medicoNomeSearch = '';

		// Funcao para buscar a lista de medicos a partir de parte do nome
		self.medicoSearch = function(){
			self.isMedicoBusca = true;

			return self.listaMedicos = MedicosNomeService.query({ nome: self.medicoNomeSearch });
		};

		// Funcao para selecionar o cliente dos resultados da busca
		self.escolherMedico = function(med){
			self.medicoEscolhido = med;

			self.isMedicoBusca = false;
			self.isMedicoEscolhido = true;
			self.listaMedicos = [];
		};

		// GERAL
		// Funcao para carregar todos os atendimentos
		self.isProntoEnvio = function(){
			return ((self.hasExameEscolhido()) && self.isClienteEscolhido && self.isPagamentoEntradaValido());
		};

		self.editado = false;
		var idEditado = '';

		self.atendimento = {
			cliente: '',
			medico: '',
			exames : []
		};

		self.enviar = function(){
			if(self.editado){
				self.atendimento.cliente = self.clienteEscolhido._id;

				if(self.isMedicoEscolhido) self.atendimento.medico = self.medicoEscolhido._id;
				else if(self.atendimento.hasOwnProperty('medico')) delete self.atendimento['medico'];

				var exames = [];

				self.examesEscolhidos.forEach(function(exaInd){
					var exameIncidencia = {
						exame: exaInd.exame._id,
						incidencia: exaInd.incidencia
					};

					exames.push(exameIncidencia);
				});

				self.atendimento.exames = exames;

				AtendimentosService.update({ id: idEditado }, self.atendimento, function(response){
					self.editado = false;

					self.limpaTudo();
					self.carregar();

					$('#modalForm').modal('hide');
				});
			}
			else {
				self.atendimento.cliente = self.clienteEscolhido._id;

				if(self.isMedicoEscolhido) self.atendimento.medico = self.medicoEscolhido._id;
				else if(self.atendimento.hasOwnProperty('medico')) delete self.atendimento['medico'];

				var exames = [];

				self.examesEscolhidos.forEach(function(exaInd){
					var exameIncidencia = {
						exame: exaInd.exame._id,
						incidencia: exaInd.incidencia
					};

					exames.push(exameIncidencia);
				});

				self.atendimento.exames = exames;

				AtendimentosService.save(self.atendimento).$promise
                    .then(function(res){
                        alert(res.message);

                        var entrada = {
                            operacao: 'c',
                            valor: self.atendimento.pagamentoEntrada,
                            descricao: 'Pagamento de entrada do atendimento :'+res.id
                        };

                        return CaixaService.update({ id: 'CaixaSimples'}, entrada).$promise;

                    })

                    .then(function(res){
                        alert(res.message);
                        self.limpaTudo();
                        self.carregar();
                    });
			}
		};

		self.carregar = function(){
			return self.lista = AtendimentosService.query();
		};

		self.editar = function(ate){
			self.editado = true;

			idEditado = ate._id;

			self.atendimento.id = ate.id;
            self.atendimento.pagamentoEntrada = ate.pagamentoEntrada;

			self.clienteEscolhido = ate.cliente;
			self.isClienteEscolhido = true;

			if(ate.hasOwnProperty('medico')){
				self.medicoEscolhido = ate.medico;
				self.isMedicoEscolhido = true;
			}
			else{
				self.limpaMedicoEscolhido();
			}

			self.examesEscolhidos = ate.exames;
		};

		self.remover = function(ate){
			if(confirm('Deseja remover este atendimento?')){
				AtendimentosService.remove({ id: ate._id }).$promise
                    .then(function(res){
                        alert(res.message);

                        var valor = ate.pagamentoEntrada;

                        if(ate.quitado) valor = ate.pagamentoTotal;

                        var entrada = {
                            operacao: 'd',
                            valor: valor,
                            descricao: 'Estorno do atendimento :'+ate.id
                        };

                        return CaixaService.update({ id: 'CaixaSimples'}, entrada).$promise;

				    })
                    .then(function(res){
                        alert(res.message);
                        self.carregar();

                    });
			}
		};

		self.limpaTudo = function(){
			self.listaClientes = [];
			self.limpaClienteEscolhido();
			self.limpaCliente();

			self.listaExames = [];
			self.examesEscolhidos = [];
			self.exameNomeSearch = '';
			self.isExameBusca = false;

			self.listaMedicos = [];
			self.limpaMedicoEscolhido();
			self.medicoNomeSearch = '';
			self.isMedicoBusca = false;

            self.atendimento.pagamentoEntrada = 0;

			self.editado = false;
		};

        self.quitar = function(ate){
            if(confirm('Deseja quitar o valor de R$' + self.valorQuitar(ate))){
                ate.quitado = true;

                AtendimentosService.update({ id: ate._id }, ate).$promise
                .then(function(res){
                    alert(res.message);

                    var entrada = {
                        operacao: 'c',
                        valor: (ate.pagamentoTotal - ate.pagamentoEntrada),
                        descricao: 'Quitacao do atendimento :'+ate.id
                    };

                    return CaixaService.update({ id: 'CaixaSimples'}, entrada).$promise;
                })
                .then(function(res){
                    alert(res.message);
                });
            }
        };

		// Carrega a lista
		self.carregar();



	}])
	.controller('UsuariosController', ['UsuariosService', 'Storage', function(UsuariosService, Storage){
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
				unidade: '',
				permissoes : [],
				_id: ''
			};

			editado = false;
		};

		var permissoes = function(perfil){
			var saida = [];

			if(perfil === 'atendente'){
				saida = [
					{ cadastro: 'atendimentos', nome: 'Atendimentos', verbos: [ 'GET', 'POST', 'PUT', 'DELETE' ] },
					{ cadastro: 'clientes', nome: 'Clientes', verbos: [ 'GET', 'POST', 'PUT', 'DELETE' ] },
					{ cadastro: 'resultados', nome: 'Resultados', verbos: [ 'GET' ] },
                    { cadastro: 'caixa', nome: 'Caixa', verbos: [ 'GET', 'POST' ] }
				];
			}
			else if(perfil === 'biomedica'){
				saida = [
					{ cadastro: 'atendimentos', nome: 'Atendimentos', verbos: [ 'GET' ] },
					{ cadastro: 'clientes', nome: 'Clientes', verbos: [ 'GET' ] },
					{ cadastro: 'resultados', nome: 'Resultados', verbos: [ 'GET', 'POST', 'PUT', 'DELETE' ] },
					{ cadastro: 'exames', nome: 'Exames', verbos: [ 'GET', 'POST', 'PUT', 'DELETE' ] },
					{ cadastro: 'medicos', nome: 'Médicos', verbos: [ 'GET', 'POST', 'PUT', 'DELETE' ] }
				];
			}
			else if(perfil === 'admin'){
				saida = [
					{ cadastro: 'atendimentos', nome: 'Atendimentos', verbos: [ 'GET', 'POST', 'PUT', 'DELETE' ] },
					{ cadastro: 'clientes', nome: 'Clientes', verbos: [ 'GET', 'POST', 'PUT', 'DELETE' ] },
					{ cadastro: 'resultados', nome: 'Resultados', verbos: [ 'GET' ] },
					{ cadastro: 'exames', nome: 'Exames', verbos: [ 'GET', 'POST', 'PUT', 'DELETE' ] },
					{ cadastro: 'medicos', nome: 'Médicos', verbos: [ 'GET', 'POST', 'PUT', 'DELETE' ] },
					{ cadastro: 'usuarios', nome: 'Usuários', verbos: [ 'GET', 'POST', 'PUT', 'DELETE' ] }
				];
			}
			else if(perfil === 'financeiro'){
				saida = [
					{ cadastro: 'atendimentos', nome: 'Atendimentos', verbos: [ 'GET' ] },
					{ cadastro: 'clientes', nome: 'Clientes', verbos: [ 'GET' ] },
                    { cadastro: 'caixa', nome: 'Caixa', verbos: [ 'GET', 'POST' ] }
				];
			}
			else if(perfil === 'cliente'){
				saida = [
					{ cadastro: 'resultados', nome: 'Resultados', verbos: [ 'GET' ] }
				];
			}

			return saida;
		};



	}])
	.controller('ExamesController', ['ExamesService', 'Storage', function(ExamesService, Storage){
		var self = this;

		var editado = false;
		var idEditado = '';

		self.lista = [];

		self.carregar = function(){
			return self.lista = ExamesService.query();
		};

		self.carregar();

		self.limpaExame = function(){
			self.exame = {
				nome : '',
				descricao: '',
				idade_minima: 0,
				idade_maxima: 999,
				masculino: true,
				feminino: true,
				grupo: '',
				preco: 0.0,
				indicadores: []
			};

			editado = false;
		};

		var limpaIndicador = function(){
			self.indicador = {
				descricao: '',
				numerico: true
			};
		};

		self.limpaExame();
		limpaIndicador();

		self.enviar = function(){
			if(!editado){
				ExamesService.save(self.exame, function(response){
					//alert(response.message);

					self.limpaExame();
					self.carregar();
				});
			}
			else{
				ExamesService.update({ id: idEditado }, self.exame, function(response){
					editado = false;

					//alert(response.message);

					self.limpaExame();
					self.carregar();

					$('#modalForm').modal('hide');
				});
			}
		};

		self.editar = function(exa){
			idEditado = exa._id;
			editado = true;

			self.exame = exa;
		};

		self.remover = function(id){
			if(confirm('Deseja remover este exame?')){
				ExamesService.remove({ id: id }, function(response){
					//alert(response.message);
					self.carregar();
				});
			}
		};

		self.adicionar = function(){
			self.exame.indicadores.push(self.indicador);

			limpaIndicador();
		};

		self.removerIndicador = function(index){
			self.exame.indicadores.splice(index, 1);
		};


	}])
	.controller('ResultadosController', ['ResultadosService', 'ResultadosClienteService', 'Storage', function(ResultadosService, ResultadosClienteService, Storage){
		var self = this;

		self.lista = [];

		self.carregar = function(){
			if(Storage.getUsuario().perfil == 'cliente') self.lista = ResultadosClienteService.query({id: Storage.getUsuario().cliente });
            else self.lista = ResultadosService.query();

            return self.lista;
		};

        self.resultado = {};

        self.limpaResultado = function(){
            self.resultado = {};
        }

		self.carregar();

        self.avaliar = function(resultado){
            self.resultado = resultado;
        };

        self.enviar = function(){
            for(var i=0;i < self.resultado.exame.indicadores.length;i++){
                self.resultado.resultado[i].indicador = self.resultado.exame.indicadores[i].descricao;
                self.resultado.resultado[i].numerico = self.resultado.exame.indicadores[i].numerico;
            }

            self.resultado.liberado_impressao = true;
            self.resultado.liberado_internet = true;

            ResultadosService.update({ id: self.resultado._id }, self.resultado).$promise
            .then(
                function(response){
                    self.limpaResultado();
                    self.carregar();

                    alert(response.message);

				    $('#modalAvaliacaoForm').modal('hide');
                },
                function(error){
                    alert('Erro');
                }
            );
        };

        // Impressao de Resultados

        var linhaAtual = 1;
        var pagina = 0;

        var addCabecalhoPagina = function(docPdf){
            linhaAtual = 1;
            pagina++;
            docPdf.text(20, 10, '*** Cabeçalho aqui *** P. ' + pagina);
        };

        var addCabecalhoDocumento = function(docPdf){
            pagina = 0;
        };

        var addRodapeDocumento = function(docPdf){};

        var addRodapePagina = function(docPdf){
            docPdf.text(20, 265, '=== Rodapé aqui === P. ' + pagina);
        };

        var novaLinha = function(docPdf, texto){
            if(linhaAtual > 30) {
                addRodapePagina(docPdf);
                docPdf.addPage();
                addCabecalhoPagina(docPdf);
            }

            docPdf.text(20, 10 + (7 * linhaAtual), texto);

            linhaAtual++;
        };

        self.pdf = function(resultado){
            var doc = new jsPDF('portrait', 'mm', 'a4');

            addCabecalhoDocumento(doc);
            addCabecalhoPagina(doc);

            novaLinha(doc, resultado.exame.nome + ' - ' + resultado.exame.descricao);
            novaLinha(doc, '');

            resultado.resultado.forEach(function(res){
                novaLinha(doc, res.indicador + ' = ' + res.valor);
            });

            addRodapePagina(doc);
            addRodapeDocumento(doc);

            doc.save('resultado_'+ resultado.atendimento.id + '_' + resultado.exame.nome + '.pdf');

        };

	}])
	.controller('MedicosController', ['MedicosService', 'Storage', function(MedicosService, Storage){
		var self = this;

		self.lista = [];

		var editado = false;
		var idEditado = '';

		self.carregar = function(){
			return self.lista = MedicosService.query();
		};

		self.carregar();

		self.limpaMedico = function(){
			self.medico = {
				nome : '',
				crm: '',
				uf: ''
			};

			editado = false;
		};

		self.limpaMedico();

		self.enviar = function(){
			if(!editado){
				MedicosService.save(self.medico, function(response){
					self.limpaMedico();
					self.carregar();
				});
			}
			else{
				MedicosService.update({ id: idEditado }, self.medico, function(response){
					editado = false;

					self.limpaMedico();
					self.carregar();

					$('#modalForm').modal('hide');
				});
			}
		};

		self.editar = function(med){
			idEditado = med._id;
			editado = true;

			self.medico = med;
		};

		self.remover = function(id){
			if(confirm('Deseja remover este médico?')){
				MedicosService.remove({ id: id }, function(response){
					self.carregar();
				});
			}
		};


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
	}]);
