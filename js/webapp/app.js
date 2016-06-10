angular.module('biwebApp', ['ngRoute', 'ngResource', 'ngCookies', 'ngMaterial', 'ngSanitize', 'ngMessages'])
.run(['$rootScope', '$window', 'servAuth', function($rootScope, $window, sAuth){

}])

// Router
.config(function($routeProvider){
    $routeProvider
    .when('/principal', {
        templateUrl: 'partials/principal.html',
        controller: 'InicialController as iniCtrl'})

    .when('/painel', {
        templateUrl: 'partials/painel.html',
        controller: 'PainelController as pnlCtrl'})

    .otherwise({
        template: '<h1>Bem-vindo ao PWBI Web</h1>'});
})
// Constantes

.constant('apiUrl', 'http://begyn.com.br:3100')

.service('servAuth', function(){



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
