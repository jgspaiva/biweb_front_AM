angular.module('biwebApp').
controller('MainController', ['AutenticaService', 'UsuariosService', 'Storage', 'ClientesService', '$location', '$cookies', '$route', '$mdSidenav', '$scope', '$rootScope','$mdDialog', '$timeout', function(AutenticaService, UsuariosService, Storage, ClientesService, $location, $cookies, $route, $mdSidenav, $scope, $rootScope, $mdDialog, $timeout){

    // Métodos para Facebook API Login

    // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
        console.log('Funcionou');

      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
  }

  // This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '230447407347738',
    cookie     : true,  // enable cookies to allow the server to access
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.6' // use version 2.2
  });

  // Now that we've initialized the JavaScript SDK, we call
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));


    $scope.goto = function(rota){
        $mdSidenav('left').toggle();

        $scope.searchTerm = "";

        $timeout(function(){
            $location.path('/' + rota);
        }, 707);
    };

    $scope.openLeftMenu = function(){
        $mdSidenav('left').toggle();
    };

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

    $scope.showSearch = false;

    $scope.mudaBusca = function(){
        $rootScope.$broadcast('search', { searchTerm: $scope.searchTerm });
    };

    $scope.cliqueSearch = function(){
        $scope.showSearch = !$scope.showSearch;

        $scope.searchTerm = "";

        if(!$scope.showSearch) $scope.mudaBusca();
    };

	/*var self = this;

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
        });*/

}]);
