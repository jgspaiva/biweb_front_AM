// Factory
angular.module('biwebApp')
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
	}]);
