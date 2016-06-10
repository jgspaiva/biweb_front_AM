angular.module('biwebApp', ['ngRoute', 'ngResource', 'ngCookies', 'ngMaterial', 'ngSanitize', 'ngMessages'])
.run(['$rootScope', '$window', 'servAuth', function($rootScope, $window, sAuth){

    $rootScope.user = {};

    $window.fbAsyncInit = function() {
        FB.init({
            appId       : '230447407347738',
            cookie      : true,
            status      : true,
            xfbml       : true,
            version     : 'v2.6'
        });

        sAuth.watchAuthenticationStatusChange();
    };

    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];

        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

}])

// Router
.config(function($routeProvider){
    $routeProvider
    .when('/usuarios', {
        templateUrl: 'partials/usuarios.html',
        controller: 'UsuariosController as usrCtrl'})

    .when('/principal', {
        templateUrl: 'partials/principal.html',
        controller: 'InicialController as iniCtrl'})

    .when('/clientes', {
        templateUrl: 'partials/clientes.html',
        controller: 'ClientesController as cliCtrl'})

    .when('/planos', {
        templateUrl: 'partials/planos.html',
        controller: 'PlanosController as plaCtrl'})

    .when('/painel', {
        templateUrl: 'partials/painel.html',
        controller: 'PainelController as pnlCtrl'})

    .when('/senha', {
        templateUrl: 'partials/senha.html',
        controller: 'SenhaController as senCtrl'})

    .otherwise({
        template: '<h1>Bem-vindo ao PWBI Web</h1>'});
})
    // Constantes

.constant('apiUrl', 'http://begyn.com.br:3100')

.service('servAuth', function(){

    watchAuthenticationStatusChange = function() {

        var _self = this;

        FB.Event.subscribe('auth.authResponseChange', function(res) {

            if (res.status === 'connected') {

                // Conectado

                _self.getUserInfo();

            }
            else {
                // Não conectado
            }
        });

    }

    getUserInfo = function() {

        var _self = this;

        FB.api('/me', function(res) {

            $rootScope.$apply(function() {

                $rootScope.user = _self.user = res;

            });

        });

    }

    logout = function() {

        var _self = this;

        FB.logout(function(response) {

            $rootScope.$apply(function() {

                $rootScope.user = _self.user = {};

            });

        });

    }

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

            $scope.clique = function(event, item){
                event.stopPropagation();

                if($attrs['action']){
                    $scope.action({ evento: event, objeto: item } );
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
}]);
