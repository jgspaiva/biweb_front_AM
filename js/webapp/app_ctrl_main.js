angular.module('biwebApp').
controller('MainController', ['AutenticaService', 'UsuariosService', 'ClientesService', '$location', '$cookies', '$route', '$mdSidenav', '$scope', '$rootScope','$mdDialog', '$timeout', function(AutenticaService, UsuariosService, ClientesService, $location, $cookies, $route, $mdSidenav, $scope, $rootScope, $mdDialog, $timeout){
    $scope.logado = false;

    $scope.isLogado = function(){
        return $scope.logado;
    };

    $scope.login = function(){
        FB.login(function(response) {

            if (response.authResponse) {

                console.log('Welcome!  Fetching your information.... ');

                FB.api('/me', { fields: 'name, email' }, function(response) {
                    console.log('Good to see you, ' + response.name + '.');
                    console.log('Seu email é ' + response.email);

                    $scope.logado = true;

                });

            } else {
                console.log('User cancelled login or did not fully authorize.');
            }

        }, {
            scope: 'email'
        });

    };

    $scope.logout = function(){
        FB.logout(function(response){
            console.log('Logged out');

            $scope.logado = false;
        });
    };

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

}]);
