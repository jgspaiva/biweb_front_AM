angular.module('biwebApp').
controller('UtilizacaoController', ['UsuariosClienteService', 'UsuariosService', '$scope', 'Storage', function(UsuariosClienteService, UsuariosService, $scope, Storage){
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
