angular.module('biwebApp', ['ngRoute', 'ngResource', 'ngCookies', 'ngMaterial', 'ngSanitize', 'ngMessages'])
.run(['$rootScope', '$window', 'servAuth', function($rootScope, $window, sAuth){

    $window.fbAsyncInit = function() {
        FB.init({
            appId      : '230447407347738',
            xfbml      : true,
            cookie     : true,
            status     : true,
            version    : 'v2.6'
        });

        FB.getLoginStatus(function(response){
            switch(response.status){
                case 'connected':
                    console.log('Já conectado');

                    FB.api('/me', { fields: 'name, picture, email' }, function(response) {
                        $rootScope.$apply(function(){
                            sAuth.usuario = response;
                            sAuth.logado = true;
                        });

                    });
                    break;
                case 'not_authorized':
                    console.log('Não autorizado');

                    $rootScope.$apply(function(){
                        sAuth.logado = false;
                    });
                    break;
                default:
                    console.log('Não logado');

                    $rootScope.$apply(function(){
                        sAuth.logado = false;
                    });
                    break;
            }
        });
    };

    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];

        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
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
        template: '<h1>Bem-vindo ao Dashboard Designer</h1>'});
})
// Constantes

.constant('apiUrl', 'http://begyn.com.br:3100')

.service('servAuth', function(){
    var self = this;

    self.usuario = {};

    self.logado = false;

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

}])

.directive('ngCsvImport', function() {
	return {
		restrict: 'E',
		transclude: true,
		replace: true,
		scope:{
			content:'=?',
			header: '=?',
			headerVisible: '=?',
			separator: '=?',
			separatorVisible: '=?',
			result: '=?',
			encoding: '=?',
			encodingVisible: '=?',
			accept: '=?'
		},
		templateUrl: 'componentes/csv_uploader.tmpl.html',
		link: function(scope, element) {
			scope.separatorVisible = scope.separatorVisible || false;
			scope.headerVisible = scope.headerVisible || false;

			angular.element(element[0].querySelector('.separator-input')).on('keyup', function(e) {
				if ( scope.content != null ) {
					var content = {
						csv: scope.content,
						header: scope.header,
						separator: e.target.value,
						encoding: scope.encoding
					};

                    console.log(content.csv);

					scope.result = CSV2JSON(content.csv);
					scope.$apply();
				}
			});

			element.on('change', function(onChangeEvent) {
				var reader = new FileReader();

				scope.filename = onChangeEvent.target.files[0].name;

				reader.onload = function(onLoadEvent) {
					scope.$apply(function() {
						var content = {
							csv: onLoadEvent.target.result.replace(/\r\n|\r/g,'\n'),
							header: scope.header,
							separator: scope.separator
						};
						scope.content = content.csv;
						scope.result = CSV2JSON(content.csv);
						scope.result.filename = scope.filename;
					});
				};

				if ((onChangeEvent.target.type === "file") && (onChangeEvent.target.files != null || onChangeEvent.srcElement.files != null)) {
					reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0], scope.encoding);
				}
                else {
					if ( scope.content != null ) {
						var content = {
							csv: scope.content,
							header: !scope.header,
							separator: scope.separator
						};
						scope.result = CSV2JSON(content.csv);
					}
				}
			});

            var CSVToArray = function(strData, strDelimiter) {
                strDelimiter = (strDelimiter || ",");
                var objPattern = new RegExp((
                    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                    "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");

                var arrData = [[]];

                var arrMatches = null;

                while (arrMatches = objPattern.exec(strData)) {
                    var strMatchedDelimiter = arrMatches[1];

                    if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
                        arrData.push([]);
                    }

                    if (arrMatches[2]) {
                        var strMatchedValue = arrMatches[2].replace(
                            new RegExp("\"\"", "g"), "\"");
                    } else {
                        var strMatchedValue = arrMatches[3];
                    }

                    arrData[arrData.length - 1].push(strMatchedValue);
                }

                return (arrData);

            };

            var CSV2JSON = function(csv) {
                var array = CSVToArray(csv);

                var objArray = [];
                var headerArray = [];

                for (var i = 1; i < array.length; i++) {
                    objArray[i - 1] = {};
                    for (var k = 0; k < array[0].length && k < array[i].length; k++) {
                        var key = array[0][k];
                        key = key.trim();

                        var valStr = (array[i][k]).trim();

                        var val = undefined;

                        if(tipo(valStr) == "number") val = Number(valStr);
                        else val = valStr;

                        objArray[i - 1][key] = val;

                        // Header
                        if(i == 1) {
                            var regHeader = { campo: key, tipo: tipo(valStr)};

                            headerArray.push(regHeader);
                        }
                    }
                }

                var json = JSON.stringify(objArray);
                var str = json.replace(/},/g, "},\r\n");

                sessionStorage.setItem('fonte', str);


                //Header
                var jsonHeader = JSON.stringify(headerArray);
                var strHeader = jsonHeader.replace(/},/g, "},\r\n");

                sessionStorage.setItem('header', strHeader);

                return str;
            };

            var tipo = function(valor){
                var saida = "";

                if(valor.match(/^\d+$/) != null){
                    saida = "number";
                }
                else if(valor.match(/^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g) != null){
                    saida = "date";
                }
                else{
                    saida = "string";
                }

                return saida;
            };
        }
    }
});
