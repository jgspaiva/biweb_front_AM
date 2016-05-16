angular.module('biwebApp').
controller('ReportsController', ['ClientesService','ReportsService','ReportsUsuarioService', 'ReportsVisualizadoService', 'ReportsIdService', 'UsuariosService', 'UsuariosClienteCnpjService', 'Storage', '$cookies', '$scope', '$mdDialog', '$mdMedia', function(ClientesService, ReportsService, ReportsUsuarioService, ReportsVisualizadoService, ReportsIdService, UsuariosService, UsuariosClienteCnpjService, Storage, $cookies, $scope, $mdDialog, $mdMedia){
        // Controller de Reports
        var self = this;

        self.isAdmin = function(){
            return (Storage.getUsuario().perfil == 'admin');
        };

        self.isMaster = function(){
            return (Storage.getUsuario().perfil == 'master');
        };

        // o relatorio clicado
        self.reportAtual = {};

        // Lista de Relatorios
        self.listaReports = [];

        self.usuarios = [];

        self.carregaUsuarios = function(){
            if(self.isAdmin()){
                if($cookies.get('cliente_id') == undefined){
                    //carrega todos

                    self.usuarios = UsuariosService.query();
                }
                else{
                    // carrega pelo cnpj da navbar

                    self.usuarios = UsuariosClienteCnpjService.query({ cnpj: $cookies.get('cliente_id') });
                }
            }
            else if(self.isMaster()){
                // carrega pelo cnpj do master

                self.usuarios = UsuariosClienteCnpjService.query({ cnpj: Storage.getUsuario().cliente.cnpj });
            }
        };

        self.carregaUsuarios();

        self.insereIcones = function(lista){
            lista.forEach(function(item){
                if(self.isHtml(item)){
                    item.html = true;
                    item.image = false;
                    item.icone = 'view_comfy';
                }
                else if(self.isImage(item)){
                    item.html = false;
                    item.image = true;
                    item.icone = 'pie_chart';
                }
            });
        };

        self.carregarReports = function(){
            if(self.isAdmin()){
                if($cookies.get('cliente_id') != undefined){
                    if(self.usuarioId == undefined){
                        ReportsService.query({ cnpj: $cookies.get('cliente_id') }).$promise
                        .then(
                            function(res){
                                self.listaReports = res;

                                self.insereIcones(self.listaReports);
                            },
                            function(error){});
                    }
                    else{
                        ReportsUsuarioService.query({ cnpj: $cookies.get('cliente_id'), usuario: self.usuarioId }).$promise
                        .then(
                            function(res){
                                self.listaReports = res;

                                self.insereIcones(self.listaReports);
                            },
                            function(error){});
                    }
                }

            }
            else if(self.isMaster()){
                if(self.usuarioId == undefined){
                    ReportsService.query({ cnpj: Storage.getUsuario().cliente.cnpj }).$promise
                        .then(
                            function(res){
                                self.listaReports = res;

                                self.insereIcones(self.listaReports);
                            },
                            function(error){});
                }
                else{
                    ReportsUsuarioService.query({ cnpj: Storage.getUsuario().cliente.cnpj, usuario: self.usuarioId }).$promise
                        .then(
                            function(res){
                                self.listaReports = res;

                                self.insereIcones(self.listaReports);
                            },
                            function(error){});
                }
            }
            else{
                ReportsUsuarioService.query({ cnpj: Storage.getUsuario().cliente.cnpj, usuario: Storage.getUsuario().username }).$promise
                        .then(
                            function(res){
                                self.listaReports = res;

                                self.insereIcones(self.listaReports);
                            },
                            function(error){});
            }

        };

        self.carregarReports();

        self.clicado = function(report, spin){
            var spinner = '#spin'+spin;

            $(spinner).removeClass('ocultar').addClass('mostrar');

            ReportsIdService.get({ id: report._id }).$promise
            .then(
                function(response){
                    self.reportAtual = response;

                    $(spinner).removeClass('mostrar').addClass('ocultar');

                    $('#modalMaximo').modal('show');


                    if(self.isHtml(report)){            $('#frameHtml').contents().find('html').html(decodeURIComponent(escape(atob(self.reportAtual.imagem.data))));
                    }

                    if(self.isNovo(report) && (!self.isAdmin())){
                        return ReportsVisualizadoService.update({ id: report._id, usuario: username }, {}).$promise;
                    }
                },
                function(error){
                    $(spinner).removeClass('mostrar').addClass('ocultar');
                })
            .then(
                function(response){
                    for (i in report.visualizado){
                        if(report.visualizado[i].login == username) report.visualizado[i].valor = true;
                    }
                },
                function(error){

                });
        };

        self.miniImagem = function(report){
            var saida = '';

            if(self.isImage(report)) saida = 'imagens/painel.jpg';
            else if(self.isHtml(report)) saida = 'imagens/cubo.jpg';

            return saida;
        };

        self.imagem = function(report){
            var saida = '';

            if(self.isImage(report)) saida = 'data:' + report.imagem.contentType + ';base64,' + report.imagem.data;
            else if(self.isHtml(report)) saida = 'imagens/painel.jpg';

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

        self.mudaUsuario = function(){
            self.carregarReports();
        };

        $scope.showDialog = function(ev, report) {
            ReportsIdService.get({ id: report._id }).$promise
            .then(
                function(response){
                    return $mdDialog.show({
                        controller: DialogReportController,
                        templateUrl: 'templates/view_report_dialog.tmpl.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        bindToController: true,
                        locals: { report: response },
                        clickOutsideToClose: false
                    });
                },
                function(error){}
            ).
            then(
                function(objeto) {
                    alert(objeto);
                },
                function() {
                    $scope.status = 'You cancelled the dialog.';
                });


        };

    }]);
