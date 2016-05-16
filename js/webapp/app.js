angular.module('biwebApp', ['ngRoute', 'ngResource', 'ngCookies', 'ngMaterial', 'ngSanitize', 'dx', 'ngMessages'])

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
    .constant('apiUrl', 'http://begyn.com.br:3100')

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


    .directive('compareTo', [function(){
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo",
            },
            link: function($scope, $element, $attrs, ngModel){
                ngModel.$validators.compareTo = function(modelValue){
                    return modelValue == $scope.otherModelValue;
                };

                $scope.$watch("otherModelValue", function(){
                    ngModel.$validate();
                });
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
                $scope.searchTerm = "";

                $scope.$on('search', function(event, data){
                    $scope.searchTerm = data.searchTerm;
                });

                $scope.toggleAllCheck = function(){
                    angular.forEach($scope.items, function(item, index){
                        item.check = $scope.allCheck;
                    });
                };

                $scope.$watchCollection("items", function(newValue, oldValue){
                    $scope.items = newValue;
                });

                $scope.clique = function(event, index){
                    event.stopPropagation();

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
    }]);
